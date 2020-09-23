// ==UserScript==
// @name         [Neko0] DIM增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.destinyitemmanager.com/4611686018489549229/d2/inventory
// @grant        none
// @run-at       document-idle
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==
// 快捷键加强
$(document).keydown(function(event) {
    // 当前按键
    let keyCode = event.keyCode.toString()
    let ActionBox = $('.item-details:last-child>div>div')
    if (keyCode.match(/81/)) {
        $(ActionBox[0]).find('div')
            .contents()
            .filter(function() {
                if ($(this).text() === '寄存') $(this).click()
            })
    }
    if (keyCode.match(/87/)) {
        $(ActionBox[1]).find('div')
            .contents()
            .filter(function() {
                if ($(this).text() === '寄存') $(this).click()
            })
    }
    if (keyCode.match(/69/)) {
        $(ActionBox[2]).find('div')
            .contents()
            .filter(function() {
                if ($(this).text() === '寄存') $(this).click()
            })
    }
    if (keyCode.match(/82/)) {
        $(ActionBox[3]).find('div')
            .contents()
            .filter(function() {
                if ($(this).text() === '保险库') $(this).click()
            })
    }
})
