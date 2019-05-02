// ==UserScript==
// @name         [Neko0] 淘宝天猫一键好评
// @description  淘宝&天猫评价页面添加一键好评按钮
// @version      1.5.6
// @author       JoJunIori
// @namespace    neko0-web-tools
// @homepageURL  https://github.com/jojuniori/neko0-web-tools
// @supportURL   https://github.com/jojuniori/neko0-web-tools/issues
// @updateURL    https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/automation/taobao.js
// @downloadURL  https://raw.githubusercontent.com/jojuniori/neko0-web-tools/master/automation/taobao.js
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @include      *://rate.taobao.com/*
// @include      *://buyertrade.taobao.com/*
// @include      *://ratewrite.tmall.com/*
// ==/UserScript==

// 初始化设定
let settingValueList = {
	// 评价语列表
	rateMsgList: ['质量非常好，与卖家描述的完全一致，非常满意，真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物。掌柜好人，一生平安。'],
};
for (let obj in settingValueList) {
	if (sessionStorage.getItem(obj) === null) {
		sessionStorage.setItem(obj, settingValueList[obj]);
	}
}
// Math.floor(Math.random()*10);
// 置入Style
let style = `<style>
/* 设置框 */
.n-box {
    position: fixed;
    right: 40px;
    bottom: 80px;
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 3px;
    z-index: 99999;
    color: #888;
    border: 2px solid #f5f5f5;
    transition: all 256ms;
    z-index: 1000000;
}
.n-box.open {
    width: 296px;
    height: 296px;
}
/* 开关按钮 */
.n-box .button.switch {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 256ms;
}
.n-box.open .button.switch {
    transform: rotate(180deg);
}
</style>`
$('head').append(style)

// 置入DOM
let dom = `<div class="n-box">
<span class="button switch">
    <i class="fas fa-cog fa-lg"></i>
</span>
</div>`
$('body').append(dom)

$('.n-box .button.switch').click(()=>{
    $('.n-box').toggleClass('open')
})

var host = window.location.host;
var isTB = host === 'rate.taobao.com';
var isTM = host === 'ratewrite.tmall.com';

// 淘宝一键好评
function taobaoFun() {
	var tbParentElem = document.querySelector('.submitbox');
	var tbSubmitBtn = document.querySelector('.J_submit_rate');
	var tbNewDir = document.createElement('button');
	tbNewDir.innerHTML = '一键好评';
	tbNewDir.className = 'tb-rate-btn type-primary tb-rate-btn haoping';
	tbNewDir.style.marginLeft = '50px';
	tbNewDir.onclick = function() {
		var tbRateMsg = document.querySelectorAll('.rate-msg');
		for (var i = 0, a; a = tbRateMsg[i++];) {
			a.value = "质量非常好，与卖家描述的完全一致，非常满意，真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物。掌柜好人，一生平安。"
		}

		var tbGoodRate = document.querySelectorAll('.good-rate');
		for (var i = 0, a; a = tbGoodRate[i++];) {
			a.click();
		}

		var tbStar = document.querySelectorAll('.ks-simplestar img');
		tbStar[4].click();
		tbStar[9].click();
		tbStar[14].click();

		tbSubmitBtn.click();
	};

	tbParentElem.appendChild(tbNewDir);
}

// 天猫一键好评
function tmallFun() {
	var tmParentElem = document.querySelector('.compose-btn');
	var tmSubmitBtn = document.querySelector('.compose-btn [type="submit"]');
	var tmNewDir = document.createElement('button');
	tmNewDir.innerHTML = '一键好评';
	tmNewDir.className = 'tb-rate-btn type-primary tb-rate-btn haoping';
	tmNewDir.style.background = 'white';
	tmNewDir.style.color = '#c40000';
	tmNewDir.style.border = 'inset 1px #c40000';
	tmNewDir.onclick = function() {

		document.querySelector('.J_textInput').shadowRoot.querySelector('#textEditor').shadowRoot.querySelector('#textEl').value = "质量非常好，与卖家描述的完全一致，非常满意，真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物。掌柜好人，一生平安。"

		var tmStar = document.querySelectorAll('[data-star-value="5"]');
		for (var i = 0, a; a = tmStar[i++];) {
			a.click();
		}

		tmSubmitBtn.click();
	};

	console.log(tmParentElem);
	console.log(tmNewDir);
	tmParentElem.appendChild(tmNewDir);
}

if (isTB) {
	taobaoFun();
} else if (isTM) {
	var timer = setInterval(detection, 1000);
	detection();
}

function detection() {
	var haoping = document.querySelector('.haoping');
	if (!haoping) {
		tmallFun();
	} else {
		clearInterval(timer);
	}
}