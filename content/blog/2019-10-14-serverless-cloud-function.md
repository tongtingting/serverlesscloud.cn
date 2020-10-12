---
title: 由浅入深说 Serverless 之云函数的生命周期
description: 希望通过文章分享帮助大家更深入的了解 Serverless 背后的机制并掌握相关的最佳实践。
keywords: Serverless, Serverless前端开发, Serverless云函数
date: 2019-10-14
thumbnail: https://img.serverlesscloud.cn/2020326/1585217744291-%E6%91%84%E5%9B%BE%E7%BD%91_400730082_wx.jpg
categories: 
  - news
authors: 
  - 朱峰 Ben
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - 云函数
---

希望通过文章分享帮助大家更深入的了解 Serverless 背后的机制并掌握相关的最佳实践。

Serverless 架构是一个分布式、事件驱动型的架构，在这个架构中，核心节点为一个个函数，为了有别于通常的函数，我们称之为 **云函数**。

云函数是按需运行的，所以在未被事件触发时处于关闭状态。

只有当事件触发时，云函数才会被启动和运行。

此外，由于频繁的启动不利于资源的有效利用，大部分云服务商会在云函数启动后，保留云函数的实例两分钟，以便当有同类事件触发时可以被快速处理而不必再次耗费时间和资源启动实例，若两分钟后依然没有同类型的事件触发，再关闭实例。

因此云函数被触发的完整过程是：

1. 事件触发
2. 创建和启动云函数实例
3. 输入事件信息
4. 执行云函数触发代码并返回结果
5. 若有后续同类事件
    1. 输入下一个事件
    2. 执行云函数触发代码并返回结果
    3. 重复第5步
6. 等待两分钟没有新事件，销毁云函数实例

转化为云函数的生命周期，则分为三步：

- Mount 启动
- Invoke 触发
- Destroy 关闭

由于云函数的关闭是由服务商直接控制的，所以无法进行捕获和定制。

在 FaasJS 中，生命周期在云函数中的体现为：

```javascript
// onMount 云函数实例启动
import { Func } from '@faasjs/func';
let count = 0;

export default new Func({
  handler() { // onInvoke 云函数的触发代码在 handler 中
    return count++;
  }
});
```

上面的云函数示例，触发时返回的是当前云函数实例启动后被触发的次数。

那么对于云函数的生命周期，有哪些最佳实践可供参考呢？目前的建议有以下两点：

1. 将常量的定义和创建放在 Mount 阶段
2. 将数据库连接放在 Mount 阶段
3. 仅把与输入事件强相关的代码放在 Invoke 阶段

示例如下：

```javascript
import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';

// 初始化数据库对象和连接
const sql = new Sql();

// 定义常量
const types = {
  user: 0,
  admin: 1
 };

export default new Func({
  plugins: [sql],
  async handler(){
    return await sql.query('SELECT count(*) FROM users WHERE type = ?', [types.user]);
  }
});
```

在示例代码中，数据库连接会在云函数实例启动时被创建，并随着实例的关闭而销毁。在云函数实例存在的情况下，每次事件触发都会使用同一个数据库连接，而不必每次等待额外的时间去连接数据库。此外这种方式也可以有效控制数据库的连接数量，不会因为云函数的触发次数过多而产生大量的数据库连接。

在启动阶段就声明好的常量，一方面有助于提升的代码可读性，另外一方面也可以避免在事件触发时重复创建常量的问题（虽然通常情况下这对性能影响很小）。