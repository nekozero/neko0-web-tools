// ==UserScript==
// @name         [Neko0] Youtube增强
// @description  提供 "一键复制名字" 的按钮
// @version      0.0.1
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @resource     font https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css
// @resource     style https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.1/automation/taobao/style.css
// @resource     button https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.1/automation/taobao/n-box.html
// @include      *://www.youtube.com/watch?v=*
// ==/UserScript==


// 置入Style
GM_addStyle(GM_getResourceText('font'))
// GM_addStyle(GM_getResourceText('style'))

// 置入DOM
// $('body').append(GM_getResourceText('button'))
$('#top-level-buttons-computed').after(`<div class="neko0-copy-name">
<span class="button switch">
    <i class="mdi-content-copy"></i>复制名字
</span>
</div>
`)