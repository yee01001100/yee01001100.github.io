---
title: mysql-server在ubuntu的安装与基础使用
date: 2026-04-26 20:22:59
tags:
  - sql
categories: [web, SQL]
---

# 安装 
## 1.终端普通安装
1. **更新软件包列表**

在终端中执行以下命令更新APT软件源

```bash
sudo apt update
```

2. **安装MySQL服务器**

```bash
sudo apt install mysql-server -y
```

3. **启动MySQL服务并设置开机自启**

安装完成后，服务通常会自动启动。你可以通过以下命令确认并设置开机自启：

```bash
# 设置开机自启
sudo systemctl enable mysql
# 立即启动服务
sudo systemctl start mysql
# 检查服务运行状态
sudo systemctl status mysql
```

4. **运行安全初始化脚本** 

这是**安全关键一步**，脚本会引导你设置root密码，移除匿名用户和测试数据库等。

```bash
sudo mysql_secure_installation
```

根据提示完成设置。新版MySQL可能会要求你首先通过`sudo mysql`命令登录后，为root用户设置密码并更新认证插件，之后才能运行此脚本。

5. **直接登录 (可选)**

在某些新版本的Ubuntu系统中，root用户默认使用`auth_socket`插件进行认证，这意味着你可以直接通过系统的root权限登录MySQL，而无需密码。

```bash
sudo mysql
```

## 2.通用二进制包安装 

当包管理器版本不满足需求，或需要在离线环境、实现多实例部署时，可使用通用二进制包。此方法适用于所有Linux发行版。

1. **下载和解压**

从**MySQL官方社区版下载页面**找到“Linux - Generic”版本并下载。然后解压到`/usr/local`目录：

```bash
tar -xf mysql-8.4.0-linux-glibc2.17-x86_64.tar.xz -C /usr/local/
cd /usr/local
# 创建软链接，方便版本切换
sudo ln -s mysql-8.4.0-linux-glibc2.17-x86_64 mysql
```

2. **创建MySQL用户并设定权限**

```bash
sudo useradd -r -s /sbin/nologin mysql
sudo chown -R mysql:mysql /usr/local/mysql
```

3. **初始化数据库**

```bash
sudo /usr/local/mysql/bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data
```

4. **配置并启动服务**

创建配置文件`/etc/my.cnf`并编辑至少包含`basedir`和`datadir`的内容。
然后创建systemd服务文件或直接启动：

```bash
sudo /usr/local/mysql/bin/mysqld_safe --user=mysql &
```

# 基础使用

完成安装后，你需要掌握一些基础操作来管理数据库。

 1. **连接与退出MySQL服务器**

```bash
# 登录到MySQL服务器
mysql -u root -p
```

输入密码验证成功后，会出现 `mysql>` 提示符，此时便可输入SQL命令了。要退出，输入 `exit` 并回车即可。

2. **数据库基础操作(CRUD)**

| 操作               | 命令示例                                                     |
| ------------------ | ----------------------------------------------------------- |
| **创建**数据库     | `CREATE DATABASE my_database;`                               |
| **查看**所有数据库 | `SHOW DATABASES;`                                            |
| **选择**数据库     | `USE my_database;`                                           |
| **删除**数据库     | `DROP DATABASE my_database;`                                 |
| **创建**数据表     | `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));` |
| **查看**表结构     | `DESCRIBE users;`                                            |
| **插入**数据       | `INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');` |
| **查询**数据       | `SELECT * FROM users;`                                       |
| **更新**数据       | `UPDATE users SET email = 'new_email@example.com' WHERE name = 'Alice';` |
| **删除**数据       | `DELETE FROM users WHERE name = 'Alice';`                    |

3. **用户与权限管理**

- **创建用户**：创建一个新用户并设置密码。

```sql
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'user_password';
```

> 如果希望该用户能从**任何IP地址**连接到数据库，请将`localhost`替换为`%`。

- **授予权限**：授予用户对特定数据库的权限。

```sql
-- 授予用户对 my_database 数据库所有表的所有权限
GRANT ALL PRIVILEGES ON my_database.* TO 'newuser'@'localhost';
```

- **刷新权限**：使权限更改立即生效。

```sql
FLUSH PRIVILEGES;
```

- **查看用户权限**

```sql
SHOW GRANTS FOR 'newuser'@'localhost';
```

- **删除用户**

```sql
DROP USER 'newuser'@'localhost';
```

4. **系统服务管理**

| 操作                | 命令 (systemctl)                             |
| ------------------- | -------------------------------------------- |
| **启动** MySQL 服务 | `sudo systemctl start mysqld` (或 `mysql`)   |
| **停止** MySQL 服务 | `sudo systemctl stop mysqld` (或 `mysql`)    |
| **重启** MySQL 服务 | `sudo systemctl restart mysqld` (或 `mysql`) |
| **查看**服务状态    | `sudo systemctl status mysqld` (或 `mysql`)  |
| **设置**开机自启    | `sudo systemctl enable mysqld` (或 `mysql`)  |
| **禁用**开机自启    | `sudo systemctl disable mysqld` (或 `mysql`) |

> 注：在Ubuntu系统中，服务名通常为`mysql`；而在CentOS/Rocky Linux/openSUSE中，服务名通常为`mysqld`。

5. **开启远程访问**

如果需要从本机以外的其他设备连接到你的MySQL服务器，需要进行以下配置

- **创建允许远程访问的用户**

在MySQL中创建一个允许从任何IP（`%`）或特定IP登录的用户，并授予权限：

```sql
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'StrongPassword!';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

- **配置MySQL监听所有网络接口**

编辑MySQL的配置文件（通常是`/etc/mysql/mysql.conf.d/mysqld.cnf`或`/etc/my.cnf`），将 `bind-address` 这一行设置为 `0.0.0.0`。

```bash
bind-address = 0.0.0.0
```

保存配置文件后，需要**重启MySQL服务**才能使更改生效。

- **配置防火墙**

确保你的Linux防火墙（如`firewalld`或`ufw`）允许外部访问MySQL的默认端口`3306`。

```bash
# 使用firewalld
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload

# 使用ufw (Uncomplicated Firewall)
sudo ufw allow 3306/tcp
```

# 最后注意

1. **强密码策略**：为所有MySQL用户（尤其是`root`）设置足够复杂的密码，并妥善保管。

2. **开启防火墙**：通过防火墙限制只有可信的IP地址能够访问3306端口，避免将数据库完全暴露在公网。

3. **最小权限原则**：创建应用使用的专用用户，并只授予其完成工作所必需的最小权限（例如，只对特定数据库有`SELECT, INSERT, UPDATE, DELETE`权限），而不是滥用`root`账户。

4. **定期备份**：使用 `mysqldump` 工具，养成定期备份数据库的习惯，以防数据丢失。

5. **定期更新**：关注MySQL的安全公告，运行 `sudo apt upgrade` (Debian/Ubuntu) 或 `sudo yum update` (RHEL/CentOS) 来更新MySQL和相关组件，以修复已知的安全漏洞。
