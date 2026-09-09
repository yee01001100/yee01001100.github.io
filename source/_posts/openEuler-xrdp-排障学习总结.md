---
title: openEuler WSL2 xrdp 远程桌面完整排障与磁盘迁移 —— 学习总结
date: 2026-09-09-27 20:24:00
tags:
  -Linux
categories: [Linux]
---



# openEuler WSL2 xrdp 远程桌面完整排障与磁盘迁移 —— 学习总结

> 场景还原：Windows + WSL2 中安装 openEuler 24.03，装了 xrdp 后远程桌面"能连上、但登录后进不去桌面"。
> 最终解决：切到 Xvnc 后端 + 补 startwm 脚本，并把整个发行版从 C 盘迁到 D 盘。
> 本文按"现象 → 排查 → 根因 → 修复 → 验证 → 延伸"的顺序整理，附带原理讲解。

---

## 一、先建立正确的心智模型：xrdp 的工作链路

远程桌面要真正出现桌面，链路是**五段接力**：

```
Windows 远程桌面客户端 (mstsc)
        │  RDP 协议 (TCP 3389)
        ▼
xrdp（前端，负责 RDP 握手、登录界面）
        │  UNIX socket 通信
        ▼
xrdp-sesman（会话管理器：PAM 认证、分配 display 号、拉起会话）
        │
        ├─► Xorg / Xvnc（后端"显示服务器"，真正画屏幕的那个）
        │        │  DISPLAY=:10
        │        ▼
        └─► startwm.sh（窗口管理器脚本，负责把桌面环境跑起来）
                 │
                 ▼
            桌面会话 (UKUI: kwin 窗口管理器 + panel + 文件管理器…)
```

**"能连上"只证明第一段（xrdp 前端 + 登录界面）是好的**；"进不去桌面"说明问题出在后三段：显示服务器没起来，或窗口管理器没起来。这个心智模型决定了排查时该看哪里。

---

## 二、排查过程（方法比结论重要）

### 第 1 步：确认"表面状态"

进发行版先看三样东西，10 秒钟判断服务层是否健康：

```bash
systemctl status xrdp xrdp-sesman   # 服务活着吗
ss -tln | grep 3389                 # 端口在听吗
ps -ef | grep -E 'xrdp|Xvnc|Xorg'   # 进程在跑吗
```

本例：服务 active、3389 正常监听 → **前端没问题**，问题在会话创建。

### 第 2 步：看日志，让系统自己告诉你答案

xrdp 的日志分三层，对应上面的链路：

| 日志 | 对应层 | 本例中的关键行 |
|---|---|---|
| `/var/log/xrdp.log` | 前端 | `Can't create session for user yee - X server could not be started` |
| `/var/log/xrdp-sesman.log` | 会话管理 | `Starting X server on display 10: /usr/libexec/Xorg :10 ...` 之后 `waitforx: Unable to open display :10` → `X server failed to start` |
| `~/.xorgxrdp.10.log` | X 本身 | `(EE) parse_vt_settings: Cannot open /dev/tty0 (Permission denied)` → `Fatal server error` |

三份日志层层递进，把问题从"会话失败"缩小到"Xorg 崩了"，再定位到"打不开 /dev/tty0"。

### 第 3 步：挖根因（本例有三个坑）

**坑 1：WSL 没有真实虚拟终端，Xorg 以普通用户身份启动时碰壁**

- `/dev/tty0` 权限是 `crw--w---- root tty`，登录用户 yee 不在 tty 组 → 无权打开 → Xorg 直接 Fatal
- 佐证：Xorg 的日志文件写在了 `/home/yee/` 下 → 说明 sesman 是以 **yee 的身份**去启动 Xorg 的（普通用户的 Xorg 在 WSL 里走不通）
- 在真实 Linux 机器上 Xorg 能跑，是因为有完整的 VT/DRM 环境；**WSL2 是个精简虚拟机，没有这些**

> 顺带踩到的坑：`rpm -q xorg-x11-server-Xorg` 报"未安装"，但 `/usr/libexec/Xorg` 明明存在——openEuler 的包名是 `xorg-x11-server`。**查文件属于哪个包要用 `rpm -qf /实际/路径`，别猜包名。**

**坑 2：窗口管理器脚本 startwm.sh 不存在**

- sesman.ini 里写的 `startwm.sh` 期望在 `/etc/xrdp/`（或用户家目录），但 rpm 包把它装在了 `/usr/libexec/xrdp/` —— 文件在，位置不对，等于没有
- 后果：就算 X 起来了，也没有任何东西去启动桌面会话 → 还是黑屏/退出
- 这解释了为什么修好 X 后端还不够，必须把 startwm 一起补上

**坑 3（潜在）：默认会话类型是 Xorg**

- xrdp.ini 里 `[Xorg]` 排在 `[Xvnc]` 前面 → 登录界面默认选 Xorg → 每次都走死路

---

## 三、解决方案：为什么切 Xvnc 而不是硬修 Xorg

两条路：

| 路线 | 要做什么 | 评价 |
|---|---|---|
| 修 Xorg | 装 xorgxrdp、解决 /dev/tty0 访问（加组/改权限/ioctl 限制） | 在 WSL 里绕来绕去，脆弱 |
| **切 Xvnc** | 系统已装 tigervnc-server，只需改配置 | **Xvnc 是纯用户态 X 服务器，不需要 VT、不需要显卡驱动，天然适合容器/WSL** ✅ |

选了 Xvnc，改动三处（全部先备份原文件再改）：

```ini
# 1) /etc/xrdp/xrdp.ini：把整个 [Xvnc] 会话块挪到 [Xorg] 前面
#    （登录界面"会话"下拉框的默认项 = 排在最前面的会话）

# 2) /etc/xrdp/sesman.ini
DefaultWindowManager=/etc/xrdp/startwm.sh     # 用绝对路径，最稳
ReconnectScript=/usr/libexec/xrdp/reconnectwm.sh
```

```bash
# 3) 新建 /etc/xrdp/startwm.sh（chmod 755）—— 真正的"桌面启动器"
#!/bin/sh
[ -r /etc/profile ] && . /etc/profile
[ -r /etc/default/locale ] && . /etc/default/locale
export LANG LANGUAGE LC_ALL
unset DBUS_SESSION_BUS_ADDRESS
export XDG_SESSION_TYPE=x11 XDG_CURRENT_DESKTOP=UKUI XDG_SESSION_DESKTOP=UKUI
exec dbus-run-session -- /usr/bin/ukui-session
```

要点讲解：

- **xrdp 的 Xvnc 后端会自动处理认证**：登录时你输的密码就是 VNC 密码，不需要手动 `vncpasswd`，这是 xrdp + tigervnc 的标准玩法
- `dbus-run-session`：给会话建一条**独立的 D-Bus 会话总线**，Qt 系桌面（UKUI/KDE）没有它起不来
- `XDG_CURRENT_DESKTOP` 等变量告诉桌面组件"我在 UKUI 环境里"
- display 号从 `:10` 开始（sesman.ini 的 `X11DisplayOffset=10`），会话间自动错开

### 验证方法（不连 RDP 也能测）

用目标用户身份在虚拟 display 上手动把会话"演一遍"，看进程是否存活：

```bash
runuser -l yee -c 'Xvnc :20 -SecurityTypes None -nolisten tcp -localhost &'
runuser -l yee -c 'DISPLAY=:20 dbus-run-session -- /usr/bin/ukui-session &'
ps -ef | grep -E 'ukui|kwin|peony'   # ukui-kwin_x11 / ukui-panel / peony-qt-desktop 都活着 = 成功
# 测完清理：pkill -f 'ukui-session'; pkill -f 'Xvnc :20'
```

实测输出里 `ukui-kwin_x11`、`ukui-panel`、`peony-qt-desktop`（文件管理器）全部拉起 → 桌面环境本身没问题 → 剩下的交给真实 RDP 连接验证。

---

## 四、延伸问题 1：xrdp 开机自启吗？

**在 systemd 层面：会。** 原理是单元依赖：

```
xrdp.service:   Requires=xrdp-sesman.service   （硬依赖：启动我必先启动它）
                After=xrdp-sesman.service      （顺序：它先就绪我再上）
```

`xrdp.service` 是 enabled 的 → 发行版每次启动，systemd 拉起 xrdp 时会**连带拉起 sesman**（所以 sesman 单独是 disabled 也没关系）。

实测验证方法（模拟"下次打开 WSL"）：

```powershell
wsl --terminate openEuler-24.03    # 停掉发行版
wsl -u root -d openEuler-24.03 -- /bin/true   # 再启动它
# 然后检查：systemctl is-active xrdp xrdp-sesman → active；ss -tln 有 3389
```

**WSL 特有的边界**：systemd 自启的触发点是"**发行版启动**"。Windows 重启后 WSL 默认处于 Stopped，必须先激活一次发行版（跑任意 `wsl` 命令）才会轮到 systemd 干活。想要 Windows 一开机就能连，还得配 Windows 侧的计划任务，那是另一层的事。

---

## 五、延伸问题 2：发行版占 C 盘空间怎么办？

### 先分清两个概念

| | 是什么 | 在哪 | 能不能动 |
|---|---|---|---|
| WSL 引擎 | wsl.exe、内核、WSLg | C 盘系统区 | 固定，只占几百 MB |
| 发行版数据 | **单个虚拟磁盘文件 `ext4.vhdx`** | 商店版默认 `%LOCALAPPDATA%\Packages\<包名>\LocalState\` | **可以搬、可以瘦** |

"WSL 在 C 盘"的大头其实只是这一个文件。本例：ext4.vhdx 占 7.6 GB，而发行版里真实数据只有 5.7 GB —— **动态扩展的虚拟磁盘只涨不缩，删了文件也不会自动变小**（虚胖 ~1.9 GB）。

### 手段一览（从轻到重）

```bash
# 1) 内部清理（发行版内）
dnf clean all                        # 清软件源缓存（本例 288 MB）
journalctl --vacuum-size=50M         # 收缩系统日志
fstrim -av                           # 告诉虚拟磁盘"这些块没用了"

# 2) 稀疏化：以后删文件自动回收（WSL ≥ 2.0 官方功能，免管理员）
wsl --terminate openEuler-24.03
wsl --manage openEuler-24.03 --set-sparse true

# 3) 整体搬家到别的盘（本次采用）
wsl --shutdown                       # 注意：--terminate 不够！VM 还锁着磁盘文件
wsl --manage openEuler-24.03 --move D:\WSL\openEuler-24.03
# 效果：发行版名、用户、数据原样保留，只改磁盘挂载位置；C 盘立即释放 7.6 GB

# 4) 备用：导出导入（更重，一般不用）
wsl --export  <发行版>  backup.tar
wsl --unregister <发行版>
wsl --import   <发行版>  D:\新位置  backup.tar --version 2
```

**踩坑实录**：第一次搬家用了 `--terminate` 再 `--move`，报 `ERROR_SHARING_VIOLATION`（文件被占用）——因为终止发行版 ≠ 停掉 WSL2 虚拟机，磁盘还挂在 VM 上。**必须 `wsl --shutdown` 让 VM 完全退出**，move 才能成功。

---

## 六、可复用的经验清单（考点总结）

1. **"能连上 ≠ 能用"**：RDP 握手成功只说明 xrdp 前端正常；桌面出不来，按链路往后查——显示服务器 → 窗口管理器脚本 → 桌面环境
2. **日志三级递进**：`xrdp.log`（前端）→ `xrdp-sesman.log`（会话）→ `~/.xorgxrdp.N.log`（X 服务器自己），错误一定会留在某一级里
3. **WSL 三大特殊性**：没有真实 VT（/dev/tty0 是坑）、没有 GPU（Xorg 后端受限）、systemd 要手动开启（`/etc/wsl.conf` 写 `[boot] systemd=true`）——所以 **Xvnc 后端是 WSL/容器里的通用解法**
4. **查包别猜名**：用 `rpm -qf <文件路径>` 反查归属；openEuler 的 Xorg 包就叫 `xorg-x11-server`
5. **配置完整性检查**：`startwm.sh` 这类"最后一步"文件缺失同样致命；配置里引用路径尽量写绝对路径
6. **动手前先备份**：改 `sesman.ini` / `xrdp.ini` 前 `cp -a` 一份 `.bak`
7. **验证闭环**：改完别只"看配置没问题"，要实测——模拟用户会话拉起桌面、或重启发行版验证自启
8. **虚拟磁盘只涨不缩**：动态 vhdx 不会自动瘦身；清理后需要 fstrim + 压缩/稀疏化，或干脆搬到空间充裕的盘

---

## 附：本次操作的关键命令速查

```powershell
# 进入发行版执行命令（root）
wsl -u root -d openEuler-24.03 -- bash -c "命令"

# 服务与自启
systemctl is-enabled xrdp xrdp-sesman     # enabled / disabled
systemctl restart xrdp xrdp-sesman

# 磁盘
wsl -l -v                                 # 看状态/版本
wsl --shutdown                            # 完全停掉 WSL 虚拟机
wsl --manage openEuler-24.03 --move D:\WSL\openEuler-24.03   # 搬家
wsl --manage openEuler-24.03 --set-sparse true               # 稀疏化
```
