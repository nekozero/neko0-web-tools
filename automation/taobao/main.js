// ==UserScript==
// @name         [Neko0] 淘宝天猫一键好评
// @description  用于方便地积攒淘气值，以享用高淘气值的低价88VIP等特殊权益来省钱
// @version      1.7.4
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.taobao.com/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao/main.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao/main.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @resource     style https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.1/automation/taobao/style.css
// @resource     html-n-box https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.1/automation/taobao/n-box.html
// @include      *://rate.taobao.com/*
// @include      *://ratewrite.tmall.com/*
// @include        *://buyertrade.taobao.com/trade*
// ==/UserScript==

/** 初始化设定 开始 */
// 默认值
var taobaorate = {
	autorate: false,
	rateMsgListText:
		'很满意的一次购物。真的很喜欢。完全超出期望值。质量非常好。掌柜好人，一生平安。非常满意。与卖家描述的完全一致。发货速度非常快。包装非常仔细、严实。物流公司服务态度很好。运送速度很快。下次有需求还来买。服务周到，态度热情。发货及时，物流很快。各方面都满意。给你全五星好评。',
	autoSort: true,
	autoDel: 3,
	autoPraiseAll: false,
}
// 判断是否存在设定
if (GM_getValue('taobaorate') === undefined) {
	GM_setValue('taobaorate', taobaorate)
} else {
	let store = GM_getValue('taobaorate')
	$.each(taobaorate, function (i) {
		if (store[i] === undefined) {
			store[i] = taobaorate[i]
		}
	})
	GM_setValue('taobaorate', store)
}
/** 初始化设定 结束 */

// 置入Style
GM_addStyle(GM_getResourceText('style'))

// 置入DOM
$('body').append(GM_getResourceText('html-n-box'))

// 绑定点击事件
// 打开设置窗口
$('.n-box .button.switch').click(() => {
	$('.n-box').toggleClass('open')
})
// 提交评语更新
$('.n-box .button.update.rate-msg-list-text').click(() => {
	let store = GM_getValue('taobaorate')
	store.rateMsgListText = $('#rateMsgListText').val()
	GM_setValue('taobaorate', store)
})
// 切换自动打乱排序
$('.n-box .toggle.auto-sort').click(() => {
	$('.auto-sort .on').toggle()
	$('.auto-sort .off').toggle()

	let store = GM_getValue('taobaorate')
	store.autoSort = !store.autoSort
	GM_setValue('taobaorate', store)
})
// 监听字数
$('.word-count').text($('#rateMsgListText').val().length)
$('#rateMsgListText').bind('input propertychange', function () {
	$('.word-count').text($(this).val().length)
})
// 监听删除数
$('#autoDel').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.autoDel = $(this).val()
	GM_setValue('taobaorate', store)
})

// 写入已存储的设置
$('#rateMsgListText').val(GM_getValue('taobaorate').rateMsgListText)
$('#autoDel').val(JSON.parse(GM_getValue('taobaorate').autoDel))
if (JSON.parse(GM_getValue('taobaorate').autoSort)) {
	$('.auto-sort .on').show()
	$('.auto-sort .off').hide()
} else {
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
		temp,
		index
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random())
		temp = shuffled[index]
		shuffled[index] = shuffled[i]
		shuffled[i] = temp
	}
	return shuffled.slice(min)
}

/**
 * 对评语进行处理
 *
 * @return  {string}  返回处理过的评语内容
 */
function processedText() {
	var text = GM_getValue('taobaorate').rateMsgListText
	console.log(text)
	var autoDel = JSON.parse(GM_getValue('taobaorate').autoDel)
	// 随机排序评语
	if (JSON.parse(GM_getValue('taobaorate').autoSort)) {
		var arr = text.split('。')
		var count = autoDel ? arr.length - autoDel : arr.length // 随机删除评语个数设定
		text = getRandomArrayElements(arr, count).join(' ')
	}
	return text
}

var host = window.location.host
var isTB = host === 'rate.taobao.com'
var isTM = host === 'ratewrite.tmall.com'
var isList = host === 'buyertrade.taobao.com'

// 淘宝一键好评
function taobaoStar() {
	var tbGoodRate = document.querySelectorAll('.good-rate')
	for (var i = 0, a; (a = tbGoodRate[i++]); ) {
		a.click()
	}
	var tbStar = document.querySelectorAll('.rate-stars label')
	var tbStarGroup = tbStar.length / 5
	for (let i = 1; i < tbStarGroup + 1; i++) {
		let num = i * 5 - 1
		document.querySelectorAll('.rate-stars label')[num].childNodes[0].click()
	}
}

function taobaoMsg() {
	var tbRateMsg = document.querySelectorAll('.rate-msg')
	for (var i = 0, a; (a = tbRateMsg[i++]); ) {
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
	$('.tb-btn.star').click(() => {
		taobaoStar()
	})
	$('.tb-btn.msg').click(() => {
		taobaoMsg()
	})
	$('.tb-btn.starmsg').click(() => {
		taobaoMsg()
		taobaoStar()
	})
	$('.tb-btn.haoping').click(() => {
		taobaoMsg()
		taobaoStar()
		setTimeout(() => {
			$('.submitbox [type="submit"]').click()
		}, 500)
	})
}

// 天猫一键好评
function tmallStar() {
	var tmStar = document.querySelectorAll('[data-star-value="5"]')
	for (var i = 0, a; (a = tmStar[i++]); ) {
		a.click()
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
	for (var i = 0, a; (a = textInputer[i++]); ) {
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
	$('.tm-btn.star').click(() => {
		tmallStar()
	})
	$('.tm-btn.msg').click(() => {
		tmallMsg()
	})
	$('.tm-btn.starmsg').click(() => {
		tmallMsg()
		tmallStar()
	})
	$('.tm-btn.haoping').click(() => {
		tmallMsg()
		tmallStar()
		setTimeout(() => {
			$('.compose-btn [type="submit"]').click()
		}, 500)
	})
}

// 自动执行Function
let autorate = () => {
	// 判断开启才执行
	if (GM_getValue('taobaorate').autorate) {
		setTimeout(function () {
			$('.submitboxplus .haoping')[0].click()
			// 关闭自动执行开关
			let store = GM_getValue('taobaorate')
			store.autorate = false
			GM_setValue('taobaorate', store)
		}, 2000)
		setTimeout(() => {
			open(location, '_self').close()
		}, 4000)
	}
}

function test(i) {}

// 判断页面后添加对应页面元素
if (isList) {
	// 单个好评按钮
	$("a[class^='button-']:contains('评价')").each(function () {
		let dom = `<a href="javascript:;" class="list-auto-btn">一键好评</a>`
		$(this).parent().append(dom)
		// console.log($(this).attr('href'))
	})
	$("a:contains('一键好评')").each(function () {
		$(this).click(function () {
			// 打开自动执行开关
			let store = GM_getValue('taobaorate')
			store.autorate = true
			GM_setValue('taobaorate', store)
			// 跳转页面
			setTimeout(() => {
				window.open($(this).prev().attr('href'), '_blank')
			}, 300)
		})
	})
	/** 全体好评按钮 开始 */
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1)
		var vars = query.split('&')
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=')
			if (pair[0] == variable) {
				return pair[1]
			}
		}
		return false
	}
	let autoPraiseAllOn = function () {
		let store = GM_getValue('taobaorate')
		store.autoPraiseAll = true
		GM_setValue('taobaorate', store)
	}
	let autoPraiseAllOff = function () {
		let store = GM_getValue('taobaorate')
		store.autoPraiseAll = false
		GM_setValue('taobaorate', store)
	}
	// 判断是否在待评价列表
	if (getQueryVariable('tabCode') === 'waitRate') {
		// 判断是否有待评价商品
		if ($('.list-auto-btn').length < 1) {
			autoPraiseAllOff()
			return false
		}
		// 判断是否已开启开关
		if (!GM_getValue('taobaorate').autoPraiseAll) {
			/** 未开启 */
			// 置入DOM
			$(`div[class^='simple-pagination-mod__container']`).prepend(
				'<button class="button-auto-praise-all">一键自动全部好评</button>'
			)
			// 绑定Event
			$('.button-auto-praise-all').click(() => {
				// 开启全自动执行
				autoPraiseAllOn()
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			})
		} else {
			/** 已开启 */
			// 置入取消按钮
			let dom = `<div class="fully-automatic-praise"><span class="cancel">停止自动执行</span></div>`
			$('body').append(dom)
			// 绑定Event
			$('.fully-automatic-praise .cancel').click(() => {
				// 关闭全自动执行
				autoPraiseAllOff()
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			})
			// 执行好评
			$.each($('.list-auto-btn'), function (i, el) {
				setTimeout(function () {
					$(el).click()
				}, i * 10000)
			})
			setTimeout(function () {
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			}, ($('.list-auto-btn').length + 1) * 10000)
		}
	}
	/** 全体好评按钮 结束 */
} else if (isTB) {
	taobaoFun()
	autorate()
} else if (isTM) {
	var timer = setInterval(detection, 1000)
	detection()
}
function detection() {
	var haoping = document.querySelector('.haoping')
	if (!haoping) {
		tmallFun()
		autorate()
	} else {
		clearInterval(timer)
	}
}
