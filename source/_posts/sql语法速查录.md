---
title: sql语法速查录
date: 2026-04-27 17:16:48
tags:
  - SQL
categories: [语法, SQL]
cover: /img/covers/cover-syntax-2.svg
---

以下是 **MySQL 常用 SQL 语句的详细语法及参数讲解**，覆盖数据库、表、数据操作、用户权限等核心命令。每条语句均提供**完整语法格式**与**参数说明**，可作日常开发的手边速查手册。

---

## 一、数据库操作

### 1. CREATE DATABASE – 创建数据库
```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] 数据库名
    [CHARACTER SET 字符集]
    [COLLATE 校对规则]
    [ENCRYPTION {'Y' | 'N'}];
```
| 参数 / 子句            | 说明                                          |
| ---------------------- | --------------------------------------------- |
| `DATABASE` 或 `SCHEMA` | 等价，定义数据库                              |
| `IF NOT EXISTS`        | 仅在数据库不存在时创建，避免报错              |
| `CHARACTER SET`        | 指定字符集，如 `utf8mb4`（推荐）              |
| `COLLATE`              | 指定排序和比较规则，如 `utf8mb4_unicode_ci`   |
| `ENCRYPTION`           | MySQL 8.0.16+ 支持，是否加密表空间（`Y`/`N`） |

**示例：**
```sql
CREATE DATABASE IF NOT EXISTS mydb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;
```

---

### 2. DROP DATABASE – 删除数据库
```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] 数据库名;
```
| 参数        | 说明                 |
| ----------- | -------------------- |
| `IF EXISTS` | 存在才删除，避免报错 |

**注意**：不可恢复，会删除库内所有表和数据。

---

### 3. USE – 选择数据库
```sql
USE 数据库名;
```
将指定数据库设为当前作用域，后续操作无需在表名前加库名。

---

## 二、表操作 (DDL)

### 1. CREATE TABLE – 创建表
```sql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] 表名 (
    列定义,
    ...
    [索引定义],
    [约束定义]
) [表选项];
```

#### 列定义 (column_definition)
```sql
列名 数据类型 [NOT NULL | NULL] [DEFAULT 默认值]
    [AUTO_INCREMENT] [UNIQUE [KEY]] [PRIMARY KEY]
    [COMMENT '列注释']
    [REFERENCES 参考表(参考列)]   -- 内联外键
```

| 关键字                  | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `数据类型`              | 如 `INT`, `VARCHAR(100)`, `DECIMAL(10,2)`, `DATETIME` 等     |
| `NOT NULL`              | 列值不能为 NULL                                              |
| `NULL`                  | 允许 NULL（默认）                                            |
| `DEFAULT 值`            | 设置默认值；若允许 NULL 且未指定，默认为 NULL                |
| `AUTO_INCREMENT`        | 自动递增，通常用于整数主键；一张表只能有一个自增列，且必须被索引 |
| `UNIQUE` / `UNIQUE KEY` | 值必须唯一，可多个 NULL（视 BDB 引擎而定）                   |
| `PRIMARY KEY`           | 主键，自动具有 NOT NULL + UNIQUE；一张表只能有一个主键       |
| `COMMENT`               | 给列添加注释                                                 |
| `REFERENCES`            | 定义外键（仅 InnoDB 支持），简写写法                         |

#### 索引和约束 (表级定义)
```sql
PRIMARY KEY (列1, 列2, ...)
{INDEX | KEY} [索引名] (列1 [ASC|DESC], 列2 ...)
UNIQUE [INDEX | KEY] [索引名] (列1, ...)
FULLTEXT [INDEX | KEY] [索引名] (列)
SPATIAL [INDEX | KEY] [索引名] (列)
FOREIGN KEY [外键名] (外键列) REFERENCES 父表(父列)
    [ON DELETE 操作] [ON UPDATE 操作]
```

| 子句                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `PRIMARY KEY`             | 定义复合主键                                                 |
| `INDEX` / `KEY`           | 普通索引                                                     |
| `UNIQUE`                  | 唯一索引                                                     |
| `FULLTEXT`                | 全文索引（仅 InnoDB 5.6+ 或 MyISAM）                         |
| `SPATIAL`                 | 空间索引（仅 MyISAM 或 InnoDB 8.0+）                         |
| `FOREIGN KEY`             | 外键约束                                                     |
| `ON DELETE` / `ON UPDATE` | 指定父表数据变动时的行为：`CASCADE`（级联）、`SET NULL`、`RESTRICT`（默认）、`NO ACTION`、`SET DEFAULT` |

#### 表选项
```sql
ENGINE = 存储引擎
AUTO_INCREMENT = 初始值
[DEFAULT] CHARACTER SET = 字符集
[DEFAULT] COLLATE = 校对规则
COMMENT = '表注释'
```
| 选项             | 说明                                              |
| ---------------- | ------------------------------------------------- |
| `ENGINE`         | 存储引擎：`InnoDB`（默认）、`MyISAM`、`MEMORY` 等 |
| `AUTO_INCREMENT` | 设置自增列的初始值                                |
| `CHARACTER SET`  | 表级默认字符集，影响所有无指定字符集的文本列      |
| `COLLATE`        | 表级校对规则                                      |
| `COMMENT`        | 表注释，最多 2048 字符                            |

---

### 2. ALTER TABLE – 修改表结构
```sql
ALTER TABLE 表名
    alter_specification [, alter_specification] ...
```

每个 `alter_specification` 可以是以下之一：

| 操作           | 语法                                                         | 说明                        |
| -------------- | ------------------------------------------------------------ | --------------------------- |
| 添加列         | `ADD [COLUMN] 列定义 [FIRST \| AFTER 列名]`                  | 指定位置 `FIRST` 或 `AFTER` |
| 删除列         | `DROP [COLUMN] 列名`                                         |                             |
| 修改列定义     | `MODIFY [COLUMN] 列名 新数据类型 [约束] [FIRST \| AFTER]`    | 可更改数据类型、约束等      |
| 重命名并修改列 | `CHANGE [COLUMN] 旧列名 新列名 新数据类型 [约束]`            | 可同时修改列名和定义        |
| 添加主键       | `ADD PRIMARY KEY (列名...)`                                  |                             |
| 删除主键       | `DROP PRIMARY KEY`                                           |                             |
| 添加外键       | `ADD CONSTRAINT 约束名 FOREIGN KEY (列) REFERENCES 父表(列) [ON DELETE|UPDATE ...]` |                             |
| 删除外键       | `DROP FOREIGN KEY 约束名`                                    |                             |
| 添加索引       | `ADD {INDEX\|KEY} [索引名] (列...);` 或 `ADD UNIQUE [INDEX\|KEY] ...` |                             |
| 删除索引       | `DROP {INDEX\|KEY} 索引名`                                   | 唯一索引也用 DROP INDEX     |
| 重命名表       | `RENAME [TO\|AS] 新表名`                                     |                             |
| 修改表选项     | `ENGINE=..., COMMENT=..., ...`                               |                             |

---

### 3. DROP TABLE / TRUNCATE TABLE
```sql
DROP [TEMPORARY] TABLE [IF EXISTS] 表名 [, 表名...] [RESTRICT | CASCADE];
TRUNCATE [TABLE] 表名;
```
- `DROP TABLE` 会删除表结构和数据，`IF EXISTS` 防止报错。
- `RESTRICT` 和 `CASCADE` 在 MySQL 中无实际作用（为兼容保留）。
- `TRUNCATE TABLE` 清空表数据并重置自增值，不可回滚（InnoDB 下 DDL 隐式提交），比 `DELETE` 快（逐行删除）。

---

## 三、数据操作 (DML)

### 1. INSERT – 插入数据
```sql
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] 表名 [(列1, 列2, ...)]
    {VALUES | VALUE} (值1, 值2, ...) [, (...)]
    [ON DUPLICATE KEY UPDATE 列 = 值, ...];
-- 或
INSERT [INTO] 表名 SET 列1=值1, 列2=值2 ...;
-- 或
INSERT [INTO] 表名 SELECT ...;
```

| 选项 / 子句               | 说明                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `LOW_PRIORITY`            | 低优先级，等待其他读取完成再插入（仅 MyISAM）              |
| `DELAYED`                 | 延迟插入，立即返回，后台批量写入（仅 MyISAM）              |
| `HIGH_PRIORITY`           | 高优先级，优先执行                                         |
| `IGNORE`                  | 忽略插入时的错误（如唯一键冲突），会将插入失败的行转为警告 |
| `ON DUPLICATE KEY UPDATE` | 唯一键冲突时执行更新操作，常用于“存在则更新否则插入”       |

**示例（多行插入）：**
```sql
INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com')
ON DUPLICATE KEY UPDATE email = VALUES(email);
```

---

### 2. UPDATE – 更新数据
```sql
UPDATE [LOW_PRIORITY] [IGNORE] 表名
    SET 列1 = 值1, 列2 = 值2, ...
    [WHERE 条件]
    [ORDER BY ...]
    [LIMIT 行数];
```
| 选项           | 说明                          |
| -------------- | ----------------------------- |
| `LOW_PRIORITY` | 低优先级更新（MyISAM）        |
| `IGNORE`       | 忽略错误（如唯一键冲突）      |
| `ORDER BY`     | 指定更新顺序（与 LIMIT 配合） |
| `LIMIT`        | 限制最大更新行数              |

**多表更新：**
```sql
UPDATE 表1 JOIN 表2 ON 条件 SET 表1.列 = 值 WHERE 进一步条件;
```

---

### 3. DELETE – 删除数据
```sql
DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM 表名
    [WHERE 条件]
    [ORDER BY ...]
    [LIMIT 行数];
```
| 选项     | 说明                                            |
| -------- | ----------------------------------------------- |
| `QUICK`  | 仅适用于 MyISAM，合并删除时跳过索引树的合并步骤 |
| `IGNORE` | 忽略删除时的错误                                |

**多表删除：**
```sql
DELETE 表1, 表2 FROM 表1 JOIN 表2 ON 条件 WHERE ...;
-- 或
DELETE FROM 表1 USING 表1 JOIN 表2 ON 条件 WHERE ...;
```

---

### 4. SELECT – 查询数据（核心）
完整语法从句序：
```sql
SELECT [ALL | DISTINCT | DISTINCTROW]
    [HIGH_PRIORITY]
    [SQL_CACHE | SQL_NO_CACHE]
    [SQL_CALC_FOUND_ROWS]
    选择表达式, ...
FROM 表引用
[WHERE 条件]
[GROUP BY {列名 | 表达式 | 位置} [ASC | DESC], ... [WITH ROLLUP]]
[HAVING 分组过滤条件]
[ORDER BY {列名 | 表达式 | 位置} [ASC | DESC], ...]
[LIMIT {[偏移,] 行数 | 行数 OFFSET 偏移}]
[FOR {UPDATE | SHARE} [OF 表] [NOWAIT | SKIP LOCKED]]
[INTO OUTFILE '文件' ... | INTO 变量 ...]
```

**FROM 子句** 支持：单表、多表（逗号分隔）、JOIN 语句、子查询派生表、表别名。

**JOIN 语法：**
```sql
表1 [INNER | LEFT [OUTER] | RIGHT [OUTER] | CROSS] JOIN 表2
    ON 连接条件
    | USING (公共列名)   -- 要求列名相同
[NATURAL [LEFT | RIGHT] JOIN 表2]   -- 自动按同名列连接
```

**WHERE 常用运算符：**
- 比较：`=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`
- 逻辑：`AND`, `OR`, `NOT`
- 范围：`BETWEEN 小值 AND 大值`, `NOT BETWEEN`
- 集合：`IN (值1, 值2, ...)`, `NOT IN`
- 模糊匹配：`LIKE '模式'`（`%` 任意多字符，`_` 单个字符），可使用 `ESCAPE` 定义转义符
- 正则：`REGEXP '正则表达式'` 或 `NOT REGEXP`
- 空值：`IS NULL`, `IS NOT NULL`
- 安全等于（可比较NULL）：`<=> NULL`

**GROUP BY 与聚合函数：**
- 聚合函数：`COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`, `GROUP_CONCAT()` 等。
- `WITH ROLLUP`：在分组统计后添加总计行。

**HAVING**：对分组后的结果过滤（不能用WHERE的地方，使用聚合函数条件）。

**ORDER BY**：排序，可指定 `ASC`（升序，默认）或 `DESC`（降序），支持多列。

**LIMIT**：
- `LIMIT 计数` – 返回前 N 条。
- `LIMIT 偏移, 计数` – 从第偏移条开始（偏移从0开始）。
- `LIMIT 计数 OFFSET 偏移` – 功能同上。

**FOR UPDATE / FOR SHARE**：行级锁定。
- `FOR UPDATE`：排他锁，允许读取并更新，防止其他事务修改。
- `FOR SHARE`（MySQL 8.0+，同 `LOCK IN SHARE MODE`）：共享锁，允许读取，阻止其他事务排他锁。
- `NOWAIT`：如果锁不可得立即报错；`SKIP LOCKED`：跳过已锁定的行。

---

## 四、用户和权限管理 (DCL)

### 1. CREATE USER – 创建用户
```sql
CREATE USER [IF NOT EXISTS]
    用户名@主机名 [IDENTIFIED BY '密码']
    [IDENTIFIED WITH auth_plugin [BY '密码']]
    [DEFAULT ROLE 角色]
    [REQUIRE {NONE | SSL | X509 | ISSUER 颁发者 ...}]
    [WITH {MAX_QUERIES_PER_HOUR n | MAX_UPDATES_PER_HOUR n
          | MAX_CONNECTIONS_PER_HOUR n | MAX_USER_CONNECTIONS n
          | PASSWORD EXPIRE INTERVAL n DAY | PASSWORD HISTORY DEFAULT
          | ACCOUNT LOCK | ACCOUNT UNLOCK}]
    [COMMENT '注释'];
```

| 参数 / 子句                   | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `用户名@主机名`               | 主机名可以是 `'localhost'`（仅本地），`'%'`（所有IP），具体IP或域名 |
| `IDENTIFIED BY '密码'`        | 指定密码，密码受密码策略影响                                 |
| `IDENTIFIED WITH auth_plugin` | 指定认证插件，如 `mysql_native_password` 或 `caching_sha2_password`（8.0默认）或 `auth_socket` |
| `DEFAULT ROLE`                | 分配默认角色（MySQL 8.0+）                                   |
| `REQUIRE`                     | 要求 SSL 或证书，`NONE` 表示无要求                           |
| `WITH` 选项                   | 资源限制：每小时查询/更新/连接次数，最大同时连接数，密码过期策略，密码历史记录，账户锁定/解锁 |
| `COMMENT`                     | 用户注释                                                     |

**示例（允许远程，使用强密码）：**
```sql
CREATE USER 'admin'@'%' IDENTIFIED BY 'MyStr0ng@Pass';
```

---

### 2. GRANT – 授予权限
```sql
GRANT
    权限1, 权限2, ...
    [ON {数据库.* | 数据库.表 | *.* | 表}]
    TO 用户名@主机 [, 用户...]
    [WITH GRANT OPTION]
    [AS 以某用户身份执行...];
```

**常见权限列表：**
- 全局：`ALL [PRIVILEGES]`, `CREATE`, `DROP`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `INDEX`, `ALTER`, `CREATE VIEW`, `SHOW VIEW`, `GRANT OPTION`, `RELOAD`, `SHUTDOWN`, `PROCESS`, `SUPER`, `REPLICATION SLAVE` 等。
- 特定对象：`EXECUTE` (存储过程)、`TRIGGER`、`EVENT` 等。

| 子句                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| `ON`                | 指定权限作用的对象：`*.*` 全局，`db.*` 某库所有表，`db.table` 特定表 |
| `WITH GRANT OPTION` | 允许被授权者将获得的权限再授予他人                           |
| `AS`                | 用于 GRANT 语句中模拟另一个用户（不常用）                    |

**示例：**
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'webuser'@'%';
```

---

### 3. REVOKE – 撤销权限
```sql
REVOKE
    权限1, 权限2, ...
    ON 对象
    FROM 用户名@主机 [, 用户...];
```

---

### 4. ALTER USER – 修改用户
```sql
ALTER USER [IF EXISTS]
    用户名@主机
    [IDENTIFIED BY '新密码' | IDENTIFIED WITH 插件]
    [DEFAULT ROLE ...]
    [PASSWORD EXPIRE {NEVER | DEFAULT | INTERVAL n DAY}]
    [ACCOUNT {LOCK | UNLOCK}]
    ...;
```
常用于修改密码、锁定账户等。

---

### 5. DROP USER – 删除用户
```sql
DROP USER [IF EXISTS] 用户名@主机 [, 用户名@主机 ...];
```

---

### 6. 其他权限相关命令
- `SHOW GRANTS FOR 用户`：查看用户权限。
- `FLUSH PRIVILEGES`：让权限变更立即生效（GRANT/REVOKE 自动刷新，但直接修改 `mysql.user` 表后需要手动执行）。

---

## 五、事务控制 (TCL)

```sql
-- 开启事务
START TRANSACTION [WITH CONSISTENT SNAPSHOT];
BEGIN [WORK];   -- BEGIN 与 START TRANSACTION 几乎等价

-- 提交
COMMIT [WORK] [AND [NO] CHAIN] [[NO] RELEASE];

-- 回滚
ROLLBACK [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
    [TO [SAVEPOINT] 保存点名];

-- 设置保存点
SAVEPOINT 标识符;

-- 释放保存点
RELEASE SAVEPOINT 标识符;

-- 设置事务隔离级别（全局/会话）
SET [GLOBAL | SESSION] TRANSACTION ISOLATION LEVEL
    {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE};
```

| 选项                       | 说明                                           |
| -------------------------- | ---------------------------------------------- |
| `WITH CONSISTENT SNAPSHOT` | 为 InnoDB 开启一致性快照读                     |
| `AND CHAIN` / `NO CHAIN`   | 提交/回滚后是否立即开始新事务（默认 NO CHAIN） |
| `RELEASE` / `NO RELEASE`   | 完成后是否断开会话连接                         |
| `TO SAVEPOINT`             | 回滚到指定保存点                               |

---

## 六、其他常用命令

```sql
-- 查看表结构
DESCRIBE 表名;    -- 或 DESC 表名
SHOW CREATE TABLE 表名;

-- 查看表索引
SHOW INDEX FROM 表名;

-- 查看所有表
SHOW TABLES [FROM 数据库];

-- 查看变量
SHOW VARIABLES LIKE '%pattern%';

-- 查看状态
SHOW STATUS LIKE '%pattern%';

-- 执行计划
EXPLAIN [FORMAT=JSON] SELECT ...;   -- 分析查询
EXPLAIN ANALYZE SELECT ...;         -- MySQL 8.0.18+ 实际执行并返回时间

-- 清屏（mysql 客户端）
system clear;   -- 或 \! clear
```

