// ==UserScript==
// @name         [Neko0] Iwara增强
// @description  提供 "一键复制名字 并 喜欢+关注+下载" 与单独 "复制名字" 的功能
// @version      1.0.4
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.iwara.tv/misc/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/iwara.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/iwara.js
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @include      *://*.iwara.tv/videos/*
// ==/UserScript==

// 置入Style
let style = `<style>
.block-plus {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.block-plus::before, .block-plus::after {
    content: unset !important;
}
</style>`
$('head').append(style)

// 文件名
let username = $('.node-info .username').text()
let title = $('.node-info .title').text()
let filename = username + ' - ' + title
// 替换windows文件名禁用字符
filename = filename.replace(/[/\\:*?<>|]/g," ")
// 置入DOM
let dom = `<div class="block block-plus">
<span class="one-tap">
    <a href="#" class="btn btn-primary flag-processed" rel="nofollow">
        <i class="glyphicon glyphicon-tag"></i> 一键喜欢关注下载
    </a>
</span>
<span class="copy-name" data-clipboard-text="` + filename + `">
    <a href="#" class="btn btn-primary flag-processed" rel="nofollow">
        <i class="glyphicon glyphicon-bookmark"></i> 复制名字
    </a>
</span>
</div>`
$('.region.region-sidebar').prepend(dom)

// 剪切板初始化
let clipboard = new ClipboardJS('.copy-name')
clipboard.on('success', function(e) {
    console.info('Action:', e.action)
    console.info('Text:', e.text)
    console.info('Trigger:', e.trigger)
    e.clearSelection()
})
clipboard.on('error', function(e) {
    console.error('Action:', e.action)
    console.error('Trigger:', e.trigger)
})

// 绑定事件
$('.one-tap').click(() => {
    // 拷贝名称
    if ($('.copy-name')[0]) $('.copy-name')[0].click()
    // 喜欢
    if ($('.flag-like .flag.flag-action')[0]) $('.flag-like .flag.flag-action')[0].click()
    // 关注
    if ($('.flag-follow .flag.flag-action')[0]) $('.flag-follow .flag.flag-action')[0].click()
    // 下载
    $('#download-options .list-unstyled li a')[0].click()
})