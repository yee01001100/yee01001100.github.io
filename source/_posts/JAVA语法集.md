---
title: JAVA语法集
date: 2026-04-26 20:50:11
tags:
  - JAVA
categories:
  - JAVA
---

明白了，您需要一份更完整、详尽的 Java 语法文档，而不是简化的速查表。下面我将按照常规的教学参考风格，系统性地介绍 Java 的核心语法，包括详细的说明和充足的代码示例，覆盖从基础到高级的常用内容。

---

# Java 语法完整参考手册

## 1. 基本结构

### 1.1 源文件组织

一个 Java 源文件通常包含以下部分（按顺序）：

1. **包声明**（可选）
2. **导入语句**（可选）
3. **类/接口/枚举/记录定义**（至少一个）

```java
// 包声明（必须放在第一行，注释除外）
package com.example.myapp;

// 导入其他包中的类
import java.util.List;
import java.util.ArrayList;

// 可选：静态导入，导入静态成员
import static java.lang.Math.PI;

// 类定义（每个文件最多有一个 public 类，且类名与文件名相同）
public class MyClass {
    // 类体
}
```

### 1.2 程序入口点

Java 应用程序的入口是 `main` 方法，签名固定为：

```java
public static void main(String[] args) {
    // 程序开始执行的地方
}
```

- `public`：该方法可以被任何代码调用
- `static`：属于类本身，无需创建对象即可调用
- `void`：不返回值
- `String[] args`：命令行参数数组

## 2. 注释

Java 支持三种注释形式：

| 类型     | 语法             | 用途                                           |
| -------- | ---------------- | ---------------------------------------------- |
| 单行注释 | `// 注释内容`    | 简短注释                                       |
| 多行注释 | `/* 注释内容 */` | 多行说明，不能嵌套                             |
| 文档注释 | `/** 文档 */`    | 生成 API 文档，支持 `@param`、`@return` 等标签 |

```java
// 这是一个单行注释

/*
 * 这是一个多行注释
 * 可以跨越多行
 */

/**
 * 计算两个整数的和。
 * @param a 第一个加数
 * @param b 第二个加数
 * @return 两数之和
 */
public int add(int a, int b) {
    return a + b;
}
```

## 3. 基本数据类型

Java 有 8 种基本数据类型（primitive types），它们不是对象，存储在栈内存中。

| 类型       | 关键字    | 占用字节                | 取值范围             | 默认值   | 示例                          |
| ---------- | --------- | ----------------------- | -------------------- | -------- | ----------------------------- |
| 字节型     | `byte`    | 1                       | -128 ~ 127           | 0        | `byte b = 100;`               |
| 短整型     | `short`   | 2                       | -32768 ~ 32767       | 0        | `short s = 10000;`            |
| 整型       | `int`     | 4                       | 约 ±21亿             | 0        | `int i = 100000;`             |
| 长整型     | `long`    | 8                       | 极大                 | 0L       | `long l = 100000L;`（需加 L） |
| 单精度浮点 | `float`   | 4                       | 约 ±3.4e38           | 0.0f     | `float f = 3.14f;`（需加 f）  |
| 双精度浮点 | `double`  | 8                       | 约 ±1.8e308          | 0.0d     | `double d = 3.14159;`         |
| 字符型     | `char`    | 2                       | 0 ~ 65535（Unicode） | '\u0000' | `char c = 'A';`               |
| 布尔型     | `boolean` | 未精确定义（通常1字节） | `true` 或 `false`    | `false`  | `boolean flag = true;`        |

**注意**：`char` 使用单引号，`String` 使用双引号，但 `String` 不是基本类型，是类。

## 4. 变量与常量

### 4.1 变量声明与初始化

```java
type variableName;          // 声明
variableName = value;       // 赋值
type variableName = value;  // 声明并初始化

// 示例
int count;
count = 10;
double price = 19.99;
String name = "Java";       // String 是引用类型
```

### 4.2 常量

使用 `final` 关键字修饰，一旦赋值不可更改。常量名通常全大写，单词间用下划线分隔。

```java
final double PI = 3.1415926535;
final int MAX_SIZE = 100;
```

### 4.3 变量作用域

- **局部变量**：在方法、构造方法或代码块中声明，必须显式初始化，作用域从声明点到所在块结束。
- **实例变量**（成员变量）：在类中、方法外声明，属于对象，有默认值。
- **类变量**（静态变量）：用 `static` 修饰，属于类，所有实例共享。

```java
public class VariableDemo {
    static int classVar = 100;      // 类变量
    int instanceVar;                // 实例变量，默认 0

    public void method() {
        int localVar = 50;          // 局部变量
        System.out.println(localVar);
    }
}
```

## 5. 运算符

### 5.1 算术运算符

| 运算符 | 含义                   | 示例    |
| ------ | ---------------------- | ------- |
| `+`    | 加法 / 字符串连接      | `a + b` |
| `-`    | 减法                   | `a - b` |
| `*`    | 乘法                   | `a * b` |
| `/`    | 除法（整数除法会截断） | `a / b` |
| `%`    | 取模（余数）           | `a % b` |

### 5.2 关系运算符（结果为 boolean）

| 运算符 | 含义     | 示例     |
| ------ | -------- | -------- |
| `==`   | 相等     | `a == b` |
| `!=`   | 不等     | `a != b` |
| `>`    | 大于     | `a > b`  |
| `<`    | 小于     | `a < b`  |
| `>=`   | 大于等于 | `a >= b` |
| `<=`   | 小于等于 | `a <= b` |

### 5.3 逻辑运算符（操作 boolean）

| 运算符 | 含义       | 短路特性                |
| ------ | ---------- | ----------------------- |
| `&&`   | 逻辑与     | 左边 false 则右边不计算 |
| `||`   | 逻辑或     | 左边 true 则右边不计算  |
| `!`    | 逻辑非     | 无                      |
| `&`    | 不短路的与 | 无                      |
| `|`    | 不短路的或 | 无                      |
| `^`    | 异或       | 无                      |

### 5.4 赋值运算符

| 运算符 | 示例     | 等价于      |
| ------ | -------- | ----------- |
| `=`    | `a = b`  |             |
| `+=`   | `a += b` | `a = a + b` |
| `-=`   | `a -= b` | `a = a - b` |
| `*=`   | `a *= b` | `a = a * b` |
| `/=`   | `a /= b` | `a = a / b` |
| `%=`   | `a %= b` | `a = a % b` |

### 5.5 位运算符（操作整数二进制位）

| 运算符 | 含义                   |
| ------ | ---------------------- |
| `&`    | 按位与                 |
| `|`    | 按位或                 |
| `^`    | 按位异或               |
| `~`    | 按位取反               |
| `<<`   | 左移                   |
| `>>`   | 算术右移（符号位扩展） |
| `>>>`  | 逻辑右移（零扩展）     |

### 5.6 其他运算符

- **条件运算符（三元）**：`condition ? expr1 : expr2`
- **instanceof**：`obj instanceof ClassName` 判断对象是否为某类型实例

```java
int max = (a > b) ? a : b;
boolean isString = (obj instanceof String);
```

### 5.7 运算符优先级

从高到低（常用）：`()` > `!` ~ `++ --` > `* / %` > `+ -` > `<< >> >>>` > `< > <= >= instanceof` > `== !=` > `&` > `^` > `|` > `&&` > `||` > `?:` > `=` 等赋值运算符。

## 6. 控制流程

### 6.1 条件语句

#### if-else 语句

```java
if (condition1) {
    // condition1 为 true 时执行
} else if (condition2) {
    // condition1 false, condition2 true
} else {
    // 所有条件均为 false
}
```

大括号即使只有一条语句也建议写上，避免错误。

#### switch 语句

从 Java 7 开始，`switch` 支持 `int`、`char`、`byte`、`short`、`String` 和枚举类型。

```java
switch (expression) {
    case value1:
        // 当 expression == value1 时执行
        break;   // 可选，防止 fall-through
    case value2:
        // ...
        break;
    default:
        // 没有匹配时执行
}
```

**Java 12+ 增强 switch**（可作为表达式返回结果）：

```java
// 箭头语法，无需 break
switch (day) {
    case MONDAY, FRIDAY -> System.out.println("Work day");
    case SATURDAY, SUNDAY -> System.out.println("Weekend");
    default -> System.out.println("Midweek");
}

// 作为表达式返回值
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY                -> 7;
    default -> 8;
};
```

### 6.2 循环语句

#### for 循环

```java
for (initialization; condition; increment) {
    // 循环体
}
// 示例：打印 0~9
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

#### 增强 for 循环（foreach）

用于遍历数组或实现了 `Iterable` 的集合。

```java
for (Type variable : iterable) {
    // 每次迭代将元素赋给 variable
}
// 示例
int[] numbers = {1, 2, 3};
for (int n : numbers) {
    System.out.println(n);
}
```

#### while 循环

```java
while (condition) {
    // 条件为 true 时重复执行
}
```

#### do-while 循环

至少执行一次循环体。

```java
do {
    // 循环体
} while (condition);
```

### 6.3 跳转语句

- **`break`**：退出当前循环或 `switch` 语句。可配合标签退出多层循环。
- **`continue`**：跳过本次循环剩余语句，进入下一次迭代。
- **`return`**：从方法中返回，若方法有返回值则必须带返回值。

```java
// 带标签的 break
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break outer; // 跳出外层循环
        }
    }
}
```

## 7. 数组

### 7.1 声明与创建

```java
// 声明
int[] arr;          // 推荐写法
int arr2[];         // 也可，但不推荐

// 创建（必须指定长度）
arr = new int[5];

// 声明并创建
int[] arr3 = new int[10];

// 静态初始化（同时赋值）
int[] arr4 = {1, 2, 3, 4, 5};
int[] arr5 = new int[]{6, 7, 8};
```

### 7.2 访问与修改

```java
arr[0] = 100;          // 索引从 0 开始
int value = arr[0];
int len = arr.length;  // length 属性，不是方法
```

### 7.3 多维数组

Java 中多维数组是数组的数组，可以是不规则的（锯齿数组）。

```java
// 二维数组
int[][] matrix = new int[3][4];       // 3行4列
int[][] matrix2 = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 不规则数组
int[][] jagged = new int[3][];
jagged[0] = new int[2];
jagged[1] = new int[4];
jagged[2] = new int[1];
```

## 8. 字符串

`String` 是 Java 内置的类，表示不可变的字符序列。字符串字面量（如 `"hello"`）存储在字符串常量池中。

### 8.1 创建字符串

```java
String s1 = "Hello";              // 字面量
String s2 = new String("Hello");  // 显式创建对象（不推荐）
char[] chars = {'H', 'i'};
String s3 = new String(chars);
```

### 8.2 常用方法

```java
int len = str.length();               // 长度
char ch = str.charAt(0);              // 获取字符
String sub = str.substring(1, 4);     // 子串 [1,4)
int idx = str.indexOf("ell");         // 查找子串位置
boolean eq = str.equals("Hello");     // 内容比较（非 ==）
boolean eqIgnore = str.equalsIgnoreCase("hello");
boolean starts = str.startsWith("He");
boolean ends = str.endsWith("lo");
String lower = str.toLowerCase();
String upper = str.toUpperCase();
String trimmed = str.trim();          // 去除首尾空白
String replaced = str.replace('l', 'w');
String[] parts = str.split(",");      // 分割
boolean empty = str.isEmpty();
```

### 8.3 字符串拼接

```java
String s = "Hello" + " " + "World";   // 使用 + 运算符
String s2 = s.concat("!");            // 另一种方式
String s3 = String.join("-", "2025", "04", "26");
```

**注意**：频繁拼接字符串应使用 `StringBuilder` 或 `StringBuffer`（线程安全）以提高性能。

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("World");
String result = sb.toString();
```

## 9. 面向对象编程

### 9.1 类与对象

#### 类定义

```java
[修饰符] class ClassName [extends 父类] [implements 接口列表] {
    // 字段（成员变量）
    // 构造方法
    // 方法
    // 代码块
    // 内部类
}
```

#### 成员变量（字段）

```java
public class Person {
    // 实例变量
    private String name;
    private int age;
    
    // 类变量（静态）
    public static int population = 0;
}
```

#### 方法

```java
[修饰符] 返回类型 方法名(参数列表) [throws 异常列表] {
    // 方法体
    [return 返回值;]
}
```

#### 构造方法

- 名称与类名相同，没有返回类型（连 `void` 也没有）
- 如果没有定义任何构造方法，编译器会自动生成一个无参构造方法
- 可以重载

```java
public class Person {
    private String name;
    
    // 无参构造
    public Person() {
        name = "Unknown";
    }
    
    // 有参构造
    public Person(String name) {
        this.name = name;   // this 指代当前对象
    }
}
```

#### 对象创建

```java
Person p = new Person("Alice");
```

### 9.2 封装

使用访问修饰符控制成员的可访问性：

| 修饰符                  | 同类 | 同包 | 子类 | 任何地方 |
| ----------------------- | ---- | ---- | ---- | -------- |
| `private`               | ✓    |      |      |          |
| 默认（package-private） | ✓    | ✓    |      |          |
| `protected`             | ✓    | ✓    | ✓    |          |
| `public`                | ✓    | ✓    | ✓    | ✓        |

典型做法：字段通常是 `private`，通过 `public` 的 getter/setter 访问。

```java
public class Student {
    private int id;
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
}
```

### 9.3 继承

使用 `extends` 关键字实现单继承。子类可以：

- 继承父类的 `public` 和 `protected` 成员（以及同包下的默认成员）
- 重写父类方法（`@Override` 注解可选但建议）
- 使用 `super` 调用父类构造方法或成员

```java
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void speak() {
        System.out.println("Some sound");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // 必须第一句
    }
    
    @Override
    public void speak() {
        System.out.println("Woof!");
    }
}
```

### 9.4 多态

- 编译时类型和运行时类型可以不同
- 方法调用根据运行时对象的实际类型决定（动态绑定）

```java
Animal a = new Dog("Buddy");
a.speak();   // 输出 "Woof!"，因为实际是 Dog
```

### 9.5 抽象类与接口

#### 抽象类

使用 `abstract` 修饰，可以包含抽象方法（没有方法体）和具体方法。不能被实例化，需要子类继承并实现抽象方法。

```java
public abstract class Shape {
    protected String color;
    
    public abstract double getArea();   // 抽象方法
    
    public void setColor(String color) {
        this.color = color;
    }
}
```

#### 接口

使用 `interface` 定义，所有方法默认为 `public abstract`（Java 8 之后可以有默认方法和静态方法）。一个类可以实现多个接口（多继承）。

```java
public interface Drawable {
    void draw();   // 自动是 public abstract
    
    // Java 8 默认方法
    default void print() {
        System.out.println("Printing...");
    }
    
    // Java 8 静态方法
    static void info() {
        System.out.println("Drawable interface");
    }
}

// 实现接口
public class Circle extends Shape implements Drawable {
    private double radius;
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Draw a circle");
    }
}
```

### 9.6 静态成员

- **静态变量**：所有实例共享一份，通过类名访问（也可以通过对象访问，但不推荐）
- **静态方法**：只能直接访问静态成员，不能访问实例成员（因为没有 `this`）
- **静态代码块**：类加载时执行一次，用于初始化静态变量

```java
public class Counter {
    public static int count = 0;
    
    public Counter() {
        count++;
    }
    
    public static void showCount() {
        System.out.println("Count: " + count);
    }
    
    static {
        System.out.println("Class loaded");
    }
}
```

### 9.7 内部类

#### 成员内部类

定义在外部类内部，可以访问外部类的所有成员（包括 private）。

```java
public class Outer {
    private int x = 10;
    
    class Inner {
        public void print() {
            System.out.println(x);   // 访问外部类私有成员
        }
    }
}

// 使用
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

#### 静态内部类

用 `static` 修饰，不持有外部类的引用。

```java
public class Outer {
    static class StaticInner {
        // ...
    }
}
// 使用
Outer.StaticInner inner = new Outer.StaticInner();
```

#### 局部内部类

定义在方法内部，作用域仅限于该方法。

#### 匿名内部类

没有名字的类，常用于临时实现接口或抽象类。

```java
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};
```

### 9.8 枚举

使用 `enum` 关键字定义一组常量，是特殊的类，可以拥有字段、方法和构造方法。

```java
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
    
    private boolean isWeekend;
    
    static {
        MONDAY.isWeekend = false;
        // ...
    }
    
    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }
}

// 使用
Day d = Day.MONDAY;
System.out.println(d.isWeekend());
```

### 9.9 记录（Record）

Java 14 引入（17 正式），用于简洁地定义不可变数据载体。自动生成构造方法、`equals()`、`hashCode()` 和 `toString()`。

```java
public record Point(int x, int y) {}

// 使用
Point p = new Point(3, 4);
System.out.println(p.x());  // 自动生成访问器，名为 x()
```

可以添加自定义构造方法或方法。

## 10. 异常处理

### 10.1 异常层次

```
Throwable
├── Error        // 严重错误，程序无法处理，如 OutOfMemoryError
└── Exception    // 程序应处理的异常
    ├── RuntimeException  // 非受检异常（Unchecked），如 NullPointerException
    └── 其他异常           // 受检异常（Checked），如 IOException
```

### 10.2 处理异常

使用 `try-catch-finally` 或 `try-with-resources`。

```java
try {
    // 可能抛出异常的代码
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("除数不能为零：" + e.getMessage());
    e.printStackTrace();
} finally {
    System.out.println("无论是否发生异常，都会执行");
}
```

- `catch` 块可以有多个，应从小范围异常到大范围排列。
- `finally` 可选，用于释放资源。

### 10.3 抛出异常

```java
public void setAge(int age) throws IllegalArgumentException {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负数");
    }
    this.age = age;
}
```

- `throws`：声明方法可能抛出的异常（通知调用者）
- `throw`：实际抛出异常对象

### 10.4 try-with-resources

自动关闭实现了 `AutoCloseable` 接口的资源（如文件流、数据库连接等）。

```java
try (FileInputStream fis = new FileInputStream("file.txt");
     BufferedReader br = new BufferedReader(new InputStreamReader(fis))) {
    String line = br.readLine();
    // ...
} catch (IOException e) {
    e.printStackTrace();
}
// 离开 try 块时自动调用 close()
```

### 10.5 自定义异常

继承 `Exception`（受检）或 `RuntimeException`（非受检）。

```java
public class MyBusinessException extends Exception {
    public MyBusinessException(String message) {
        super(message);
    }
}
```

## 11. 泛型

泛型提供编译时类型安全，允许在定义类、接口、方法时使用类型参数。

### 11.1 泛型类

```java
public class Box<T> {
    private T content;
    
    public void set(T content) {
        this.content = content;
    }
    
    public T get() {
        return content;
    }
}

// 使用
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String s = stringBox.get();  // 无需强制转换
```

### 11.2 泛型方法

```java
public static <T> T getMiddle(T... arr) {
    return arr[arr.length / 2];
}
// 调用
String middle = getMiddle("a", "b", "c");
```

### 11.3 通配符

- `?`：未知类型
- `? extends T`：T 或 T 的子类型（上界）
- `? super T`：T 或 T 的父类型（下界）

```java
public void printList(List<?> list) {
    for (Object obj : list) System.out.println(obj);
}

public void addNumbers(List<? super Integer> list) {
    list.add(42);   // 可以加入 Integer 或其子类
}
```

### 11.4 类型擦除

Java 泛型在编译时进行类型检查，然后擦除类型信息，在字节码中变为原始类型（如 `Box` 变成 `Box<Object>`），并插入必要的强制转换。

## 12. 集合框架

Java 集合框架提供了一系列接口和实现类，位于 `java.util` 包中。

### 12.1 主要接口

- **Collection**：单元素集合的根接口
  - **List**：有序、可重复（`ArrayList`、`LinkedList`、`Vector`）
  - **Set**：无序、不可重复（`HashSet`、`LinkedHashSet`、`TreeSet`）
  - **Queue** / **Deque**：队列（`ArrayDeque`、`PriorityQueue`）
- **Map**：键值对（`HashMap`、`LinkedHashMap`、`TreeMap`、`Hashtable`）

### 12.2 常用示例

```java
// List
List<String> list = new ArrayList<>();
list.add("Apple");
list.add("Banana");
String fruit = list.get(0);

// Set
Set<Integer> set = new HashSet<>();
set.add(10);
set.add(20);
set.add(10);   // 重复，不会添加

// Map
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 25);
int age = map.get("Alice");

// 遍历
for (String s : list) { ... }
list.forEach(s -> System.out.println(s));  // Lambda 表达式

map.forEach((k, v) -> System.out.println(k + ": " + v));
```

### 12.3 迭代器

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.equals("Banana")) it.remove();  // 安全删除
}
```

## 13. Lambda 表达式与函数式接口

### 13.1 Lambda 语法

```java
(parameters) -> { statements; }
(parameters) -> expression   // 等价于 { return expression; }
```

示例：

```java
// 无参数
Runnable r = () -> System.out.println("Hello");

// 一个参数，可省略括号
Consumer<String> c = s -> System.out.println(s);

// 两个参数
Comparator<Integer> comp = (a, b) -> a - b;

// 多行语句需加大括号
BiFunction<Integer, Integer, Integer> add = (a, b) -> {
    int sum = a + b;
    return sum;
};
```

### 13.2 函数式接口

只有一个抽象方法的接口，可以使用 `@FunctionalInterface` 注解（可选，但推荐）。常用的内置函数式接口：

| 接口                | 抽象方法              | 用途       |
| ------------------- | --------------------- | ---------- |
| `Predicate<T>`      | `boolean test(T t)`   | 条件判断   |
| `Consumer<T>`       | `void accept(T t)`    | 消费一个值 |
| `Supplier<T>`       | `T get()`             | 提供值     |
| `Function<T,R>`     | `R apply(T t)`        | 转换       |
| `UnaryOperator<T>`  | `T apply(T t)`        | 一元操作   |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | 二元操作   |

### 13.3 方法引用

简化 Lambda 表达式，语法为 `类名::方法名` 或 `对象::方法名`。

```java
// 静态方法引用
Function<String, Integer> parseInt = Integer::parseInt;

// 实例方法引用（特定对象）
List<String> list = Arrays.asList("a", "b");
list.forEach(System.out::println);  // 等价于 s -> System.out.println(s)

// 实例方法引用（任意对象，调用者作为参数）
BiFunction<String, String, Integer> compare = String::compareTo;
// 等价于 (a, b) -> a.compareTo(b)

// 构造方法引用
Supplier<ArrayList<String>> supplier = ArrayList::new;
```

## 14. Stream API

Stream 用于对集合进行函数式操作，如过滤、映射、规约等。Stream 不存储数据，不改变源数据，支持链式操作。

### 14.1 创建 Stream

```java
// 从集合
List<String> list = ...;
Stream<String> stream = list.stream();
Stream<String> parallelStream = list.parallelStream();  // 并行流

// 从数组
String[] arr = {"a", "b"};
Stream<String> stream2 = Arrays.stream(arr);

// 直接创建
Stream<Integer> stream3 = Stream.of(1, 2, 3);

// 无限流
Stream.generate(Math::random).limit(10);
Stream.iterate(0, n -> n + 1).limit(100);
```

### 14.2 中间操作（惰性）

| 操作                              | 说明                     |
| --------------------------------- | ------------------------ |
| `filter(Predicate)`               | 过滤                     |
| `map(Function)`                   | 映射                     |
| `flatMap(Function)`               | 扁平映射                 |
| `distinct()`                      | 去重                     |
| `sorted()` / `sorted(Comparator)` | 排序                     |
| `limit(long n)`                   | 取前 n 个                |
| `skip(long n)`                    | 跳过前 n 个              |
| `peek(Consumer)`                  | 调试，对每个元素执行操作 |

### 14.3 终止操作（触发计算）

| 操作                          | 说明         |
| ----------------------------- | ------------ |
| `forEach(Consumer)`           | 遍历         |
| `toArray()`                   | 转为数组     |
| `collect(Collector)`          | 收集为集合等 |
| `count()`                     | 计数         |
| `min()/max()`                 | 最值         |
| `findFirst()/findAny()`       | 查找         |
| `anyMatch/allMatch/noneMatch` | 匹配判断     |
| `reduce()`                    | 规约         |

### 14.4 示例

```java
List<String> words = Arrays.asList("hello", "world", "java", "stream");
// 过滤长度 > 4 的单词，转为大写，排序，收集为列表
List<String> result = words.stream()
    .filter(w -> w.length() > 4)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

// 求和
int sum = Stream.of(1, 2, 3, 4)
                .reduce(0, Integer::sum);

// 分组
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));
```

## 15. 注解

注解（Annotation）是一种元数据，可以附加在类、方法、字段等上面，供编译器或运行时工具使用。

### 15.1 内置注解

| 注解                   | 作用             |
| ---------------------- | ---------------- |
| `@Override`            | 声明重写父类方法 |
| `@Deprecated`          | 标记已过时       |
| `@SuppressWarnings`    | 抑制编译警告     |
| `@SafeVarargs`         | 抑制堆污染警告   |
| `@FunctionalInterface` | 声明函数式接口   |

### 15.2 元注解

用于定义注解的注解：

| 元注解        | 作用                                                  |
| ------------- | ----------------------------------------------------- |
| `@Target`     | 限定注解可应用的位置（`ElementType`）                 |
| `@Retention`  | 保留策略（`RetentionPolicy`：SOURCE, CLASS, RUNTIME） |
| `@Documented` | 是否包含在 Javadoc 中                                 |
| `@Inherited`  | 子类自动继承父类的此注解                              |
| `@Repeatable` | 允许同一位置重复使用同一个注解                        |

### 15.3 自定义注解

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value() default "";
    int priority() default 1;
}

// 使用
@MyAnnotation(value = "test", priority = 5)
public void myMethod() {}
```

通过反射可以读取运行时注解的信息：

```java
Method method = ...;
MyAnnotation anno = method.getAnnotation(MyAnnotation.class);
String val = anno.value();
```

## 16. 模块系统（Java 9+）

模块是 Java 9 引入的封装机制，用于替代脆弱的类路径。一个模块通过 `module-info.java` 文件定义。

### 16.1 module-info.java 示例

```java
module com.example.myapp {
    // 导出包，使其对其他模块可见
    exports com.example.myapp.api;
    
    // 限定导出（仅对特定模块可见）
    exports com.example.myapp.internal to com.example.other;
    
    // 需要依赖的模块
    requires java.sql;
    requires transitive java.logging;  // 传递性依赖
    
    // 开放包给反射（例如框架）
    opens com.example.myapp.model to javafx.base;
    
    // 提供服务实现
    provides com.example.spi.Service with com.example.myapp.MyServiceImpl;
    
    // 使用服务
    uses com.example.spi.Service;
}
```

### 16.2 模块化 JDK

JDK 本身被模块化，可通过 `java --list-modules` 查看。模块化帮助更好地封装和减少运行时镜像大小。

## 17. Optional 类

`Optional` 是一个容器对象，用于可能为 `null` 的值，避免空指针异常。

### 17.1 创建 Optional

```java
Optional<String> empty = Optional.empty();
Optional<String> ofNonNull = Optional.of("hello");   // 不能为 null
Optional<String> ofNullable = Optional.ofNullable(null); // 可为 null
```

### 17.2 常用方法

```java
Optional<String> opt = Optional.of("Java");
if (opt.isPresent()) {
    System.out.println(opt.get());
}

// 推荐使用函数式方式
opt.ifPresent(s -> System.out.println(s));
String value = opt.orElse("default");
String value2 = opt.orElseGet(() -> computeDefault());
String value3 = opt.orElseThrow(IllegalStateException::new);

// 转换
Optional<Integer> len = opt.map(String::length);
Optional<String> filtered = opt.filter(s -> s.length() > 3);
```

### 17.3 使用场景

主要用作返回类型，表示可能缺失的值。不要用作字段或方法参数。

```java
public Optional<User> findUserById(int id) {
    // 如果没找到，返回 Optional.empty()
}
```

## 18. 日期和时间 API（Java 8+）

`java.time` 包提供了不可变、线程安全的日期时间类。

### 18.1 主要类

| 类                  | 说明                  |
| ------------------- | --------------------- |
| `LocalDate`         | 日期（年-月-日）      |
| `LocalTime`         | 时间（时:分:秒.纳秒） |
| `LocalDateTime`     | 日期+时间             |
| `ZonedDateTime`     | 带时区的日期时间      |
| `Instant`           | 时间戳（UTC）         |
| `Duration`          | 时间差（秒/纳秒）     |
| `Period`            | 日期差（年/月/日）    |
| `DateTimeFormatter` | 格式化和解析          |

### 18.2 示例

```java
// 当前时间
LocalDate today = LocalDate.now();
LocalTime now = LocalTime.now();
LocalDateTime current = LocalDateTime.now();

// 创建指定日期
LocalDate date = LocalDate.of(2025, 4, 26);
LocalTime time = LocalTime.of(14, 30, 0);

// 运算
LocalDate nextWeek = today.plusWeeks(1);
LocalDate lastMonth = today.minusMonths(1);

// 比较
boolean isBefore = date.isBefore(today);

// 格式化
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String formatted = current.format(formatter);
LocalDateTime parsed = LocalDateTime.parse("2025-04-26 14:30:00", formatter);

// 时间差
LocalDate start = LocalDate.of(2025, 1, 1);
LocalDate end = LocalDate.of(2025, 12, 31);
Period period = Period.between(start, end);
long days = ChronoUnit.DAYS.between(start, end);
```

## 19. 输入输出（I/O）

### 19.1 标准输入输出

```java
// 输出
System.out.println("普通输出");
System.err.println("错误输出");

// 输入（使用 Scanner）
Scanner scanner = new Scanner(System.in);
System.out.print("请输入整数：");
int i = scanner.nextInt();
String line = scanner.nextLine();  // 读取一行
```

### 19.2 文件读写（传统 I/O）

```java
// 读文本
try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// 写文本
try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
    writer.write("Hello World");
    writer.newLine();
}

// 二进制文件
try (FileInputStream fis = new FileInputStream("data.bin");
     FileOutputStream fos = new FileOutputStream("copy.bin")) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, len);
    }
}
```

### 19.3 NIO（New I/O）

`java.nio` 提供了更高效的非阻塞 I/O，核心组件：`Buffer`、`Channel`、`Selector`。

```java
// 示例：使用 Files 工具类（简单）
List<String> lines = Files.readAllLines(Paths.get("file.txt"));
Files.write(Paths.get("out.txt"), lines);

// 复制文件
Files.copy(Paths.get("src"), Paths.get("dest"), StandardCopyOption.REPLACE_EXISTING);
```

## 20. 并发编程

### 20.1 线程创建

#### 继承 Thread 类

```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread running");
    }
}
MyThread t = new MyThread();
t.start();
```

#### 实现 Runnable 接口（推荐）

```java
Runnable task = () -> System.out.println("Running");
Thread t = new Thread(task);
t.start();
```

#### 实现 Callable 接口（可返回值）

```java
Callable<Integer> callable = () -> {
    Thread.sleep(1000);
    return 42;
};
FutureTask<Integer> future = new FutureTask<>(callable);
new Thread(future).start();
Integer result = future.get(); // 阻塞等待
```

### 20.2 线程池（Executor 框架）

```java
// 固定大小线程池
ExecutorService executor = Executors.newFixedThreadPool(5);
executor.submit(() -> System.out.println("Task executed"));
executor.shutdown();

// 单线程池
ExecutorService single = Executors.newSingleThreadExecutor();

// 缓存线程池
ExecutorService cached = Executors.newCachedThreadPool();

// 调度线程池
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
scheduler.scheduleAtFixedRate(() -> System.out.println("ping"), 0, 1, TimeUnit.SECONDS);
```

### 20.3 同步与锁

#### synchronized 关键字

```java
// 同步实例方法
public synchronized void increment() { count++; }

// 同步代码块
public void increment() {
    synchronized(this) {
        count++;
    }
}
```

#### Lock 接口（更灵活）

```java
Lock lock = new ReentrantLock();
lock.lock();
try {
    // 临界区
} finally {
    lock.unlock();
}
```

#### 原子类

```java
AtomicInteger atomicInt = new AtomicInteger(0);
atomicInt.incrementAndGet();
```

### 20.4 并发集合

- `ConcurrentHashMap`
- `CopyOnWriteArrayList`
- `BlockingQueue` 接口及实现（`ArrayBlockingQueue`、`LinkedBlockingQueue`）

```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);
queue.put("item");      // 阻塞直到有空间
String item = queue.take();  // 阻塞直到有元素
```

## 21. 其他重要特性

### 21.1 可变参数

```java
public void printNumbers(int... numbers) {
    for (int n : numbers) System.out.println(n);
}
// 调用
printNumbers(1, 2, 3);
printNumbers(new int[]{4, 5});
```

### 21.2 增强的 switch（Java 14+）

已在前文介绍过。

### 21.3 文本块（Java 13+）

用于多行字符串，无需大量转义。

```java
String json = """
    {
        "name": "Alice",
        "age": 30
    }
""";
```

### 21.4 模式匹配（Java 16+）

#### 模式匹配 instanceof

```java
if (obj instanceof String s) {
    // 这里 s 已经是 String 类型
    System.out.println(s.length());
}
```

#### 模式匹配 switch（Java 17 preview，21 正式）

```java
Object obj = "hello";
String result = switch (obj) {
    case Integer i -> "Integer: " + i;
    case String s -> "String: " + s;
    case null    -> "null";
    default      -> "Unknown";
};
```

### 21.5 密封类（Java 17）

限制哪些类可以继承或实现。

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
final class Circle implements Shape {}
non-sealed class Rectangle implements Shape {}   // 允许随意继承
class Triangle implements Shape {}  // 可以不加修饰，但必须 permits 列出
```

### 21.6 本地变量类型推断（var，Java 10 开始）

```java
var list = new ArrayList<String>();   // 推断为 ArrayList<String>
var count = 10;                       // 推断为 int
// 不能用于没有初始化的变量、null、Lambda 表达式、方法参数等
```

---

以上即为 Java 语法的完整参考手册，涵盖了从基本语法到现代语言特性的主要内容。每个部分都提供了语法格式、详细说明和实用示例。如需深入了解某个特定主题，可以参考官方文档或相关专题资料。
