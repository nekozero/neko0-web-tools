// ==UserScript==
// @name         [Neko0] 淘宝天猫一键好评
// @description  淘宝&天猫评价页面添加一键好评按钮
// @version      1.6.9
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.taobao.com/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao.js
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @include      *://rate.taobao.com/*
// @include      *://ratewrite.tmall.com/*
// ==/UserScript==

// 初始化设定
let settingValueList = {
	// 评价语列表
	rateMsgListText: ['很满意的一次购物。真的很喜欢。完全超出期望值。质量非常好。掌柜好人，一生平安。非常满意。与卖家描述的完全一致。发货速度非常快。包装非常仔细、严实。物流公司服务态度很好。运送速度很快。下次有需求还来买。服务周到，态度热情。发货及时，物流很快。各方面都满意。给你全五星好评。'],
	autoSort: true,
	autoDel: 3,
};
for (let obj in settingValueList) {
	if (localStorage.getItem(obj) === null) {
		localStorage.setItem(obj, settingValueList[obj]);
	}
}
// Math.floor(Math.random()*10);
// 置入Style
let style = `<style>
/* 设置框 */
.n-box {
    user-select: none;
    position: fixed;
    right: 40px;
    bottom: 80px;
    width: 56px;
    height: 56px;
    padding: 12px;
    background: white;
    border-radius: 3px;
    box-sizing: border-box;
    z-index: 99999;
    color: #888;
    border: 2px solid #f5f5f5;
    transition: all 256ms;
    z-index: 1000000;
    overflow: hidden;
}
.n-box.open {
    width: 296px;
    height: 266px;
}
.n-box > *:not(.switch){
    opacity: 0;
    transition: all 256ms;
}
.n-box.open > *:not(.switch){
    opacity: 1;
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
    z-index: 1;
}
.n-box.open .button.switch {
    transform: rotate(180deg);
}
/* 其他 */
.n-box label {
    display: block;
}
.n-box label .word-count {
    float: right;
}
/* 输入框 */
.n-box textarea {
    display: block;
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
    margin-top: 6px;
}
/* 更新按钮 */
.n-box .button.update {
    display: block;
    width: 100%;
    padding: 6px 12px;
    margin-top: 6px;
    box-sizing: border-box;
    text-align: center;
    background: #ff4401;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}
/* 开关 */
.n-box .toggle {
    float: left;
    padding: 6px;
    box-sizing: border-box;
    margin-top: 6px;
}
.n-box .toggle.auto-sort > span{
    display: none;
}
/* 输入框 */
.n-box .input.auto-del {
    float: left;
    margin-top: 6px;
}
.n-box .input.auto-del input {
    border: none;
    box-sizing: border-box;
    padding: 6px;
    width: 30px;
    text-align: center;
    float: left;
    box-shadow: inset 0 0 0 1px #888888;
    border-radius: 6px;
}
.n-box .input.auto-del label {
    float: left;
    padding: 6px;
}

/* 一键评价 */
.submitbox {
    text-align: center;
    padding: 20px 0 6px !important;
}
.submitboxplus {
    user-select: none;
    text-align: center;
}
.tb-btn {
    color: #fff;
    background-color: #3498db;
    box-shadow: inset 0 -2px 0 rgba(0,0,0,.15);
    display: inline-block;
    text-decoration: none;
    text-align: center;
    font-size: 13px;
    line-height: 1.385;
    padding: 9px 13px;
    border-radius: 4px;
    border: none;
    font-weight: 400;
    transition: color .25s linear,background-color .25s linear;
    cursor: pointer;
}
.tb-btn:hover {
    background-color: #5dade2;
    border-color: #5dade2;
}
.tb-btn.haoping {
    background-color: #f40;
    border-color: #f40;
}

.tm-btn {
    user-select: none;
    display: inline-block;
    padding: 0 10px;
    border: 0;
    line-height: 25px;
    font-weight: 700;
    background: 0 0;
    cursor: pointer;
    text-align: center;
    margin: 0 6px 12px;
    border-radius: 2px;
    color: #c40000;
    background-color: #fff;
    box-shadow: inset 0 0 0 1px;
}
.tm-btn.haoping {
    user-select: none;
    color: #fff;
    background-color: #c40000;
    box-shadow: none;
}
</style>`
$('head').append(style)

// 置入DOM
let dom = `<div class="n-box">
<span class="button switch">
    <i class="fas fa-cog fa-lg"></i>
</span>

<label for="rateMsgListText">随机用评价语<span class="word-count"></span></label>
<textarea rows="5" id="rateMsgListText"></textarea>
<span class="button update rate-msg-list-text">
    <i class="fas fa-edit fa-lg"></i>&nbsp;&nbsp;更新
</span>

<div class="toggle auto-sort">
    <span class="on"><i class="fas fa-toggle-on fa-lg"></i> 自动打乱排序开启</span>
    <span class="off"><i class="fas fa-toggle-off fa-lg"></i> 自动打乱排序关闭</span>
</div>
<div class="input auto-del">
    <input id="autoDel" /> <label for="autoDel">个内容随机删除</label>
</div>

</div>`
$('body').append(dom)

// 绑定点击事件
// 打开设置窗口
$('.n-box .button.switch').click(() => {
	$('.n-box').toggleClass('open')
})
// 提交评语更新
$('.n-box .button.update.rate-msg-list-text').click(() => {
	localStorage.setItem('rateMsgListText', $('#rateMsgListText').val())
})
// 切换自动打乱排序
$('.n-box .toggle.auto-sort').click(() => {
    $('.auto-sort .on').toggle()
    $('.auto-sort .off').toggle()
    localStorage.setItem('autoSort', !JSON.parse(localStorage.getItem('autoSort')))
})
// 监听字数
$('.word-count').text($('#rateMsgListText').val().length)
$('#rateMsgListText').bind('input propertychange', function() {
	$('.word-count').text($(this).val().length)
});
// 监听删除数
$('#autoDel').bind('input propertychange', function() {
	localStorage.setItem('autoDel', $(this).val())
});

// 写入已存储的设置
$('#rateMsgListText').val(localStorage.getItem('rateMsgListText'))
$('#autoDel').val(JSON.parse(localStorage.getItem('autoDel')))
if (JSON.parse(localStorage.getItem('autoSort'))){
    $('.auto-sort .on').show()
    $('.auto-sort .off').hide()
}else{
    $('.auto-sort .off').show()
    $('.auto-sort .on').hide()
}

/**
 * 数组随机排序并抽取指定数量
 *
 * @param   {array}  arr    要进行处理的数组
 * @param   {string}  count  最终输出结果的个数
 *
 * @return  {array}         输出处理后的数组
 */
function getRandomArrayElements(arr, count) {
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp, index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
}

/**
 * 对评语进行处理
 *
 * @return  {string}  返回处理过的评语内容
 */
function processedText() {
	var text = localStorage.getItem('rateMsgListText')
	var autoDel = JSON.parse(localStorage.getItem('autoDel'))
	// 随机排序评语
	if (JSON.parse(localStorage.getItem('autoSort'))) {
		var arr = text.split('。')
		var count = autoDel ? arr.length - autoDel : arr.length // 随机删除评语个数设定
		text = getRandomArrayElements(arr, count).join(' ')
	}
	return text
}

var host = window.location.host;
var isTB = host === 'rate.taobao.com';
var isTM = host === 'ratewrite.tmall.com';

// 淘宝一键好评
function taobaoStar() {
	var tbGoodRate = document.querySelectorAll('.good-rate');
	for (var i = 0, a; a = tbGoodRate[i++];) {
		a.click();
	}
	var tbStar = document.querySelectorAll('.rate-stars label');
	tbStar[4].childNodes[0].click();
	tbStar[9].childNodes[0].click();
	tbStar[14].childNodes[0].click();
}

function taobaoMsg() {
	var tbRateMsg = document.querySelectorAll('.rate-msg');
	for (var i = 0, a; a = tbRateMsg[i++];) {
		// 写入评价
		a.value = processedText()
	}
}

function taobaoFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tb-btn star">一键满星</div>
        <div class="tb-btn msg">一键评语</div>
        <div class="tb-btn starmsg">一键满星+评语</div>
        <div class="tb-btn haoping">一键提交好评</div>
    </div>`
	$('.submitbox').after(elemStar)
	$('.tb-btn.star').click(() => { taobaoStar() })
	$('.tb-btn.msg').click(() => { taobaoMsg() })
	$('.tb-btn.starmsg').click(() => {
		taobaoMsg()
		taobaoStar()
	})
	$('.tb-btn.haoping').click(() => {
		taobaoMsg()
		taobaoStar()
		setTimeout(() => {
			$('.J_submit_rate').click();
		}, 500);
	})
}

// 天猫一键好评
function tmallStar() {
	var tmStar = document.querySelectorAll('[data-star-value="5"]');
	for (var i = 0, a; a = tmStar[i++];) {
		a.click();
	}
}

function tmallMsg() {
	// 写入评价
	let textInputer
	if (document.querySelector('.J_textInput')) textInputer = document.querySelectorAll('.J_textInput')
	if (document.querySelector('.J_textEditorContent')) textInputer = document.querySelectorAll('.J_textEditorContent')
	if (document.querySelector('.J_textInput').shadowRoot) {
		if (document.querySelector('.J_textInput').shadowRoot.querySelector('#textEditor').shadowRoot) {
			textInputer = document
				.querySelector('.J_textInput')
				.shadowRoot.querySelector('#textEditor')
				.shadowRoot.querySelectorAll('#textEl')
		}
    }
    for (var i = 0, a; a = textInputer[i++];) {
		a.value = processedText()
	}
}

function tmallFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tm-btn star">一键满星</div>
        <div class="tm-btn msg">一键评语</div>
        <div class="tm-btn starmsg">一键满星+评语</div>
        <div class="tm-btn haoping">一键提交好评</div>
    </div>`
	$('.compose-submit').after(elemStar)
	$('.tm-btn.star').click(() => { tmallStar() })
	$('.tm-btn.msg').click(() => { tmallMsg() })
	$('.tm-btn.starmsg').click(() => {
		tmallMsg()
		tmallStar()
	})
	$('.tm-btn.haoping').click(() => {
		tmallMsg()
		tmallStar()
		setTimeout(() => {
			$('.compose-btn [type="submit"]').click();
		}, 500);
	})
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