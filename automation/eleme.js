// ==UserScript==
// @name         H5版饿了么自动好评
// @description  H5版饿了么批量自动好评
// @version      1.0.3
// @author       JoJunIori
// @namespace    neko0-web-tools
// @homepageURL  https://github.com/jojuniori/neko0-web-tools
// @grant        none
// @run-at       document-end
// @license      AGPLv3
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @include      *://h5.ele.me/*
// ==/UserScript==

// 除了用来自动好评之外根本没什么用的网页
// 所以就随便写写啦
setInterval(function() {
	if (location.pathname == "/order/") {
		if (document.querySelector('.cardbutton.alert')) {
			document.querySelector('.cardbutton.alert').click();
		}
	} else if (location.pathname == "/order/detail/") {
		if (document.querySelector('div[class*="order-star-"] > label:nth-child(5)')) {
			document.querySelector('div[class*="face-"] > div:nth-child(3)').click();
			document.querySelector('div[class*="order-star-"] > label:nth-child(5)').click();
			setTimeout(() => {
				document.querySelectorAll('.sprite-star')[4].click();
				document.querySelectorAll('.sprite-star')[9].click();
				setTimeout(() => {
					document.querySelector('div[class*="food-block-"] + div[class*="create-"] > span').click()
				}, 20);
			}, 20);
		}
	} else if (location.pathname == "/aftercomment/") { document.querySelector('.check-button').click(); }
}, 1000);