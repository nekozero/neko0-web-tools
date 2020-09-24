// ==UserScript==
// @name         [Neko0] DIM增强
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://app.destinyitemmanager.com/4611686018489549229/d2/inventory
// @grant        none
// @run-at       document-idle
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// 按键
keyList = ['81','87','69','82']
// 快捷键加强
$(document).keydown(function(event) {
    // 操作框
    let actionBox = $('.item-details:last-child>div>div')
    // 当前按键
    let keyCode = event.keyCode
    // 匹配
    for(i in keyList){
        if (keyCode == keyList[i]) {
            $(actionBox[i]).children('div:nth-child('+$(actionBox[i]).children().length+')').children().click()
        }
    }
})
