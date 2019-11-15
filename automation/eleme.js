// ==UserScript==
// @name         [Neko0] 饿了么自动好评
// @description  HTML5版饿了么批量自动好评
// @version      1.0.6
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://h5.ele.me/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/eleme.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/eleme.js
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @include      *://h5.ele.me/*
// ==/UserScript===

// 置入Style
let style = `<style>
/* 设置框 */
.n-box {
    cursor: pointer;
    position: fixed;
    right: 12px;
    bottom: calc(12px + 13.333333vw);
    width: 23vw;
    height: 8vw;
    background: white;
    border-radius: 2vw;
    z-index: 99999;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    font-size: 3vw;
    color: #0089dc;
}
/* 开关按钮 */
.n-box .button.switch {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 23vw;
    height: 8vw;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>`
$('head').append(style)

// 置入DOM
let dom = `<div class="n-box">
<span class="button switch">
    <i class="fas fa-magic fa-lg"></i>
    &nbsp;
    <span> 自动好评</span>
</span>
</div>`
if (location.pathname == "/" || location.pathname == "/discover/" || location.pathname == "/order/" || location.pathname == "/profile/") {
	if (sessionStorage.getItem('autoPraise') !== 'true') {
		// 判断已开启未开关才置入DOM
		$('body').append(dom)
	}
}

// 绑定Event
$('.n-box .button.switch').click(() => {
	sessionStorage.setItem('autoPraise', 'true')
	location.href = 'https://h5.ele.me/order/'
})

// 设定Function
let autoPraise = {
	// 开始评价
	start: () => {
		// 页面判断开始
		if (location.pathname == "/order/") {
			// 订单列表页面
			if (document.querySelector('.cardbutton.alert')) {
				// 存在未评价订单时直接模拟点击来跳转
				document.querySelector('.cardbutton.alert').click()
			} else {
				let scrollDown = () => { $('html').scrollTop(9999999) }
				let autoScroll = setInterval(() => {
					// 判断是否到底
					if (!document.querySelector('.limited')) {
						// 尚未到底则继续拉
						return scrollDown()
					} else {
						// 到底了则终止
						clearInterval(autoScroll);
						return autoPraise.done()
					}
				}, 1000)
			}
		} else if (location.pathname == "/order/detail/") {
			// 订单评价页面
			if (document.querySelector('div[class*="order-star-"] > label:nth-child(5)')) {
				document.querySelector('div[class*="face-"] > div:nth-child(3)').click()
				document.querySelector('div[class*="order-star-"] > label:nth-child(5)').click()
				setTimeout(() => {
					document.querySelectorAll('.sprite-star')[4].click()
					document.querySelectorAll('.sprite-star')[9].click()
					setTimeout(() => {
						document.querySelector('div[class*="food-block-"] + div[class*="create-"] > span').click()
					}, 20)
				}, 20)
			}
		} else if (location.pathname == "/aftercomment/") {
            // 饿了么删除了返回按钮，手动返回order页
            location.href = 'https://h5.ele.me/order/'
		}
	},
	// 结束评价
	done: () => {
		sessionStorage.setItem('autoPraise', 'false');
		alert('已全部好评完毕')
		location.href = 'https://h5.ele.me/order/'
	}
}

setTimeout(() => {
	// 自动执行启动
	if (sessionStorage.getItem('autoPraise') !== 'true') {
		// 判断未打开开关则终止
		return false
	}
	return autoPraise.start()
}, 1000)