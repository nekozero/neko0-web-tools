// ==UserScript==
// @name         [Neko0] DIM增强
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://app.destinyitemmanager.com/4611686018489549229/d2/inventory
// @grant        none
// @run-at       document-idle
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==
// 快捷键加强
$(document).keydown(function(event) {
    // 操作框
    let actionBox = $('.item-details:last-child>div>div')
    // 当前按键
    let keyCode = event.keyCode.toString()
    if (keyCode.match(/81/)) {
        $(actionBox[0]).children('div:nth-child(2)').children().click()
    }
    if (keyCode.match(/87/)) {
        $(actionBox[1]).children('div:nth-child(2)').children().click()
    }
    if (keyCode.match(/69/)) {
        $(actionBox[2]).children('div:nth-child(2)').children().click()
    }
    if (keyCode.match(/82/)) {
        $(actionBox[3]).children('div:nth-child(1)').children().click()
    }
})
