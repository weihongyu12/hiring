# 后端说明

本次项目使用了 RESTful 进行通信，框架使用的是 Koa 2。

由于不知道 Node.js 是否是本次面试的重点，所以没有太花精力在后端框架的搭建上，仅仅使用了 Koa 2 做了最简单的功能，没有 MVC，没有单元测试，没有任何安全机制，甚至没有表单校验。

> 如果需要考察 Node.js 的内容，可与我联系

## 目录结构

```
api/
├── bin/
├── src/
|   ├── csv/
|   ├── model/
|   ├── routes/
│   └── utils/
├── .eslintrc.js
├── package.json
└── package-lock.json
```

- `bin/`：项目启动脚本
- `src/`：项目源代码
    - `csv/`：CSV文件（对应生产项目的数据源，应作业要求使用CSV模拟）
    - `model/`：项目源代码（对应生产项目的数据库查询，应作业要求只能使用JS API进行模拟）
    - `routes/`：路由，用于处理请求具体操作
    - `utils/`：工具函数
- `.eslintrc.js`：ESLint 配置，此处使用了 Airbnb JavaScript Style Guide（但是项目代码没有完全遵循此规范，目前只做一个风格警告）

## 接口规范设计

接口按照 RESTful 规范进行设计

| Method | Path | 响应状态码 | 作用 |
|--------|------|----------|-----|
| `GET` | `/example` | 200 OK | 获取多条数据 |
| `GET` | `/example/:id` | 200 OK | 获取单条数据 |
| `POST` | `/example` | 200 Created | 创建数据 |
| `PUT` | `/example/:id` | 200 OK | 更新数据（所有字段） |
| `PATCH` | `/example/:id` | 200 OK | 更新数据（部分字段） |
| `DELETE` | `/example/:id` | 204 Not Content | 删除数据 |

### QueryString

对于查询数据的 QueryString，参数上有着如下约定，通过约定，可以简便的实现数据查询和接口复用

#### 通用约定

| Params | Example | 作用 |
|--------|---------|-----|
| `page` | `/example?page=0&perPage=20` | 页码，从 0 开始计数 |
| `perPage` | `/example?page=0&perPage=20` | 每页条数，如果为 -1 则查询全部 |

#### 类型约定

> 此处模拟的是 MySQL 的三大类型

| Type | Example | 作用 |
|--------|---------|-----|
| string | `/example?name=test` | 查询相关字段是否**包含**该值 |
| number | `/example?amount=2000` | 查询相关字段是否**等于**该值 |
| datetime | `/example?date=2021-05-29` | 查询相关字段是否**等于**该值 |

##### 类型前缀

对于数值型和时间日期型，支持使用前缀来查询数据的相关区间

| Type | Prefix | Example | 作用 |
|------|--------|---------|-----|
| number | `min*`/`max*` | `/example?minAmount=0&maxAmount=20` | 查询某个数值型字段的区间，`min`为最小值，`max`为最大值 |
| datetime | `start*`/`end*` | `/example?startTime=2021-01-01&endTime=2021-12-31` | 查询某个日期时间型字段的区间，`start`为开始时间，`end`为结束时间 |
