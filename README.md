<div align="center">
    <img src="https://github.com/nekozero/neko0-web-tools/raw/master/img/logo.png" width="400"">
    <br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/nekozero/neko0-web-tools?style=social">
    <br>
    <img src="https://img.shields.io/badge/not-a%20bug-brightgreen.svg"> 
    <img src="https://img.shields.io/badge/it's-a%20feature-brightgreen.svg"> 
    <img src="https://img.shields.io/badge/%F0%9F%90%BE-Neko-ff69b4.svg">
    <br>
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/nekozero/neko0-web-tools">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/nekozero/neko0-web-tools">
    <img alt="GitHub" src="https://img.shields.io/github/license/nekozero/neko0-web-tools">
</div>

----

**注意事项**  
1.这是个Tampermonkey脚本项目  
2.以下脚本均依赖于Tampermonkey  
3.部分脚本使用了ES6特性，请勿在过旧版本的浏览器上使用  
👉[Tampermonkey浏览器扩展程序安装地址](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  

---

🎮 VRChat 无限 Avatar 收藏夹 | [安装](https://greasyfork.org/zh-CN/scripts/461702)  
`不止300个！将收藏夹扩展到无限！`
<details>
<summary>介绍</summary>

官方免费的 **50** 个栏位不够用怎么办？

充了 **VRC+** 有 **300** 个栏位后还是不够用怎么办？

使用这个浏览器插件来填补 VRC 官网本该拥有的功能吧！

此开源脚本技巧性地使用了官方的 API 来<a href="#vrc1">**合法地**<sup>1</sup></a>管理您的 Avatars 并**增加到**<a href="#vrc2">**无上限**<sup>2</sup></a>的收藏数量

<!-- ~~视频教程: [📺 Youtube]()　[📺 BiliBili]()~~   -->

<video src='https://user-images.githubusercontent.com/3481868/235583564-ddd31658-d206-45d1-a56e-bb1ac5b5483b.mp4' width='100%'></video>

追加Avatar被封禁检测: 原版收藏夹里Avatar被封后就无法进行任何操作了，甚至无法联系作者，这里会留下收藏时Avatar的信息，并且可以通过作者的url去联系作者获取新的公开模型(如果有的话？) be like:

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/vrc-broke-demo.png)

**<span id="vrc1">※</span>注1：虽然这是用官方的API在工作  
但个人觉得这毕竟还是有触碰到VRC+的利益  
鉴于官方推出VRC+之前那波封MOD加EAC的操作而言     
以后连自家的网站API都封掉的可能性也不是没有  
所以还是建议把有世界获取渠道的Avatar在`"来源世界"`中填入world_id当一份保险**

**<span id="vrc2">※</span>注2：不出意外的话 (指硬盘没满的情况下)  
可以收藏50万个Avatar以上  
但尚未能进行实际测试过  
可能游戏中加起来也没那么多Avatar**

本插件只适用于有**公开链接**的**公开模型(Public)**  
例如[👉这样的](https://vrchat.com/home/avatar/avtr_bc6c06ec-fda2-4490-8db2-946f618dba2d)  
并无任何盗模功能

#### 计划更新：  
- [ ] 增加更多不同的排序方式  
- [ ] 添加可供自定义填写的“注释”“来源世界”   
- [ ] 添加标签系统，用于筛选分类模型  
- [ ] 追加新的更密集的宫格排列样式，与竖向传统详情列表的排列样式  
- [ ] 在Avatar列表单个的方框上添加一键复制URL的按钮（方便分享给好友）
- [x] 检测Avatar失效功能 [2023-05-02]

👉 [» Join TG Discussion](https://t.me/+FANQrUGRV7A0YmM9) ✨

[![follow on twitter](https://img.shields.io/twitter/follow/jojuniori?label=Follow&style=social)](https://twitter.com/jojuniori)  [![Star on GitHub](https://img.shields.io/github/stars/nekozero/neko0-web-tools.svg?style=social)](https://github.com/nekozero/neko0-web-tools/stargazers)  

</details>

---

🛒 淘宝天猫一键好评 | [安装](https://greasyfork.org/zh-CN/scripts/14744)  
`用于方便地积攒淘气值，以享用高淘气值的低价88VIP等特殊权益来省钱`
<details>

<summary>介绍</summary>

###  
![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-Anti-detection.gif)

已更新写入评语时按全角句号(中文句号)分割已存储的评语并进行随机排序的功能选项  
随机抽取3个内容进行删除处理  
以此规避淘宝那套“滥用评价功能惩罚”的自动检测  
默认开启此功能

### ⚠️虽然有随机功能来规避
### ⚠️但是用的人多了后有些组合还是会被淘宝记录检测的  
### ⚠️所以追求完美的请务必使用自定义评语功能  
### ⚠️评价完一条后等几秒钟再评价下一条，不然被检测几率很高  

**自定义功能在评价页右下角有小齿轮用来设置**  
**输入框右上角的数字是字数统计**  

关于评价查看：

https://rate.taobao.com/myRate.htm "评价管理" -> "给他人的评价"

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-myRate.png)

在淘宝&天猫评价页面添加一键好评按钮

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-config1.png)

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-config2.png)

淘宝一键好评：

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao2.png)

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao3.png)

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao4.png)

天猫一键好评：

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao5.png)

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao6.png)

[2020-12-14] 已更新在列表页直接一键好评：

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-update1.png)


[2020-12-24] 加入一键自动全部好评功能，会根据已设定的内容自动挨个好评列表中的待评价商品：

![](https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/img/taobao-update2.png)

[2023-04-17] 加入使用 ChatGPT 进行 AI评语 功能 by [@Cp0204](https://github.com/Cp0204)：

![](https://user-images.githubusercontent.com/5239753/232384165-9d4135c4-68d7-408b-bf38-d9a690931181.gif)
</details>

----

🍔 饿了么全自动好评 | [安装](https://greasyfork.org/zh-CN/scripts/369326)  
`用于方便地积攒饿了么金币，来兑换一些没啥卵用的鬼东西`
<details>

<summary>介绍</summary>

###  
对于我这种天天点外卖的每次都要一个个去点星简直太麻烦了  
自动化是好文明，懒是第一生产力

安装后进入 https://h5.ele.me/  
点击右下角的自动好评就会开始执行  
会自动给未评价的订单打上好评  
如果有不想打好评的可以提前手动评价掉  

如果有人有改进意向欢迎Pull Requests

![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/eleme.gif)

</details>

----

📺 Iwara增强 | [安装](https://greasyfork.org/zh-CN/scripts/382345)  
`增加了两个一键执行的操作`
<details>
<summary>介绍</summary>

###  
目前提供了以下功能
1. 复制名字：复制出 “作者 - 作品名” 格式的名字
2. 一键复制名字 并 喜欢+关注+下载：按下即可复制名字，Like，Follow，并Download Source画质 的文件
3. 功能按钮移动到顶部，点赞过的按钮更醒目，进入视频后不用往下滚动就能一目了然看到自己有没有点赞(下载)过这个视频
4. 进入Ecchi版面自动点击R18警告的继续按钮
5. 针对新版“默认不以Source分辨率播放并无法记忆用户设置的问题”进行了优化，进入后自动加载最高分辨率源
6. 分辨率检测功能，每次进去就能看见作者上传的最高分辨率是多少了
7. 增加帧率侦测功能，低于60fps则以醒目颜色警示

用于收藏视频作品再方便不过了

并不影响页面其他原有功能

#### 更改格式 
![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/iwara.gif)

#### 正面教材 <sub>Rin真是太棒了我™舔爆</sub>
![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/iwara3.png)

#### 反面教材 
![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/iwara4.png)

</details>

----

📺 BiliBili优化 | [安装](https://greasyfork.org/zh-CN/scripts/398155)  
`视频收藏分类功能的优化`
<details>
<summary>介绍</summary>

###  
收藏视频弹窗优化

使用前：
![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/bilibili1.png)

使用后：
![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/bilibili2.png)

</details>

----

🖼 图站增强Danbooru/Gelbooru/Konachan/Yande | [安装](https://greasyfork.org/zh-CN/scripts/387907)  
`快捷键操作与样式修改`
<details>
<summary>介绍</summary>

###  
加入了快捷键操作

* 按下 `←` 或 `A` 上一页
* 按下 `→` 或 `D` 下一页
* 按下 `S` 或 `O` 查看原图 (source/original)
* 按下 `F` 查看来源页面 (from)

Added shortcut key operation

* Press `←` or `A` to the previous page

* Press `→` or `D` to the next page

* Press `S` or `O` to view the original image (source/original)

* Press `F` to view the source page (from)

</details>

---

~~🎮 Steam库存一键出售 | [安装](https://greasyfork.org/zh-CN/scripts/35770)~~
<details>
<summary>已废弃</summary>

###  
库存和重复的卡太多的时候很实用

毕竟一个个写价格确认好几次太麻烦了

会自动获取起价，默认发售价格为起价+0.02

可安装后在脚本代码中自由调整

![](https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/img/steam.png)

</details>

----

### License

AGPLv3
