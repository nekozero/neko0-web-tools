// ==UserScript==
// @name         [Neko0] 淘宝天猫一键好评
// @description  用于方便地积攒淘气值，以享用高淘气值的低价88VIP等特殊权益来省钱 taobao tmall AI AI评价 AI评语
// @version      1.8.8
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.taobao.com/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://t.me/+URovzRdPTyHlWtQd
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao/main.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/taobao/main.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @run-at       document-idle
// @license      AGPL-3.0-or-later
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js
// @resource     style https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.1/automation/taobao/style.css
// @resource     html-n-box https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.1/automation/taobao/n-box.html
// @include      *://rate.taobao.com/*
// @include      *://ratewrite.tmall.com/*
// @include      *://buyertrade.taobao.com/trade*
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
	modelType: 'GPT', // 'GPT', 'Gemini', 'Custom'
	gpt_config: {
		url: 'https://api.openai.com/v1/chat/completions',
		headers:
			'{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer sk-..."\n}',
		data: '{\n  "model": "gpt-4o-mini",\n  "messages": [\n    {\n      "role": "user",\n      "content": "{{aitext_commit}}"\n    }\n  ],\n  "max_tokens": 2000\n}',
	},
	gemini_config: {
		url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=AIza...',
		headers: '{\n  "Content-Type": "application/json"\n}',
		data: '{\n  "contents": [\n    {\n      "role": "user",\n      "parts": [\n        {\n          "text": "{{aitext_commit}}"\n        }\n      ]\n    }\n  ],\n  "safetySettings": [\n    {\n      "category": "HARM_CATEGORY_HATE_SPEECH",\n      "threshold": "BLOCK_NONE"\n    },\n    {\n      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",\n      "threshold": "BLOCK_NONE"\n    },\n    {\n      "category": "HARM_CATEGORY_HARASSMENT",\n      "threshold": "BLOCK_NONE"\n    },\n    {\n      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",\n      "threshold": "BLOCK_NONE"\n    }\n  ]\n}',
	},
	custom_config: {
		url: '',
		headers: '',
		data: '',
	},
	aitextCount: 200,
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
	
	// Migration logic: Move old API keys to new config
	let migrated = false
	if (store.openaiApiKey && store.openaiApiKey.trim() !== '') {
		console.log('Migrating OpenAI API Key...')
		// Only migrate if we haven't already customized the headers (simple check: if headers contain the default placeholder)
		if (store.gpt_config.headers.includes('Bearer sk-...')) {
			store.gpt_config.headers = store.gpt_config.headers.replace('Bearer sk-...', 'Bearer ' + store.openaiApiKey)
			migrated = true
		}
		// Clear old key
		delete store.openaiApiKey
		migrated = true
	}
	
	if (store.geminiApiKey && store.geminiApiKey.trim() !== '') {
		console.log('Migrating Gemini API Key...')
		// Only migrate if url contains default placeholder
		if (store.gemini_config.url.includes('key=AIza...')) {
			store.gemini_config.url = store.gemini_config.url.replace('key=AIza...', 'key=' + store.geminiApiKey)
			migrated = true
		}
		// Clear old key
		delete store.geminiApiKey
		migrated = true
	}
	
	// Fix GPT max_tokens migration
	if (store.gpt_config && store.gpt_config.data && store.gpt_config.data.includes('"max_tokens": 200')) {
		console.log('Fixing GPT max_tokens...')
		store.gpt_config.data = store.gpt_config.data.replace('"max_tokens": 200',('"max_tokens": 2000'))
		migrated = true
	}

	if (migrated) {
		GM_setValue('taobaorate', store)
		console.log('Configuration Migration Complete')
	} else {
		GM_setValue('taobaorate', store)
	}
}

// Removed AIUrl object as it is now configurable


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
// 切换 Tab
function switchTab(tabId) {
    $('.n-box .tab-item').removeClass('active');
    $('.n-box .tab-item[data-tab="' + tabId + '"]').addClass('active');

    $('.n-box-content').removeClass('active');
    $('#tab-' + tabId).addClass('active');

    // Update n-box class for height
    $('.n-box').removeClass('tab-comment-settings tab-ai-config');
    $('.n-box').addClass('tab-' + tabId);
}

// Init default tab
switchTab('comment-settings');

$('.n-box .tab-item').click(function() {
    var tabId = $(this).data('tab');
    switchTab(tabId);
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

// AI Model Type
console.log('AI Model Type', GM_getValue('taobaorate').modelType)
$('#aiModelType').val(GM_getValue('taobaorate').modelType)
function loadModelConfig(type) {
	let store = GM_getValue('taobaorate')
	let configName = type.toLowerCase() + '_config'
	let config = store[configName]
	if (config) {
		$('#aiUrl').val(config.url)
		$('#aiHeaders').val(config.headers)
		$('#aiData').val(config.data)
	}
}
loadModelConfig(GM_getValue('taobaorate').modelType)

$('#aiModelType').change(function () {
	let newType = $(this).val()
	let store = GM_getValue('taobaorate')
	store.modelType = newType
	GM_setValue('taobaorate', store)
	loadModelConfig(newType)
	console.log('AI Model Type Update', newType)
})

// Listeners for URL, Headers, Data to update current config
function updateCurrentConfig() {
	let store = GM_getValue('taobaorate')
	let type = $('#aiModelType').val()
	let configName = type.toLowerCase() + '_config'
	store[configName] = {
		url: $('#aiUrl').val(),
		headers: $('#aiHeaders').val(),
		data: $('#aiData').val(),
	}
	GM_setValue('taobaorate', store)
}

$('#aiUrl').bind('input propertychange', updateCurrentConfig)
$('#aiHeaders').bind('input propertychange', updateCurrentConfig)
$('#aiData').bind('input propertychange', updateCurrentConfig)

// 监听AI生成字数数
console.log('监听AI生成字数数', GM_getValue('taobaorate').aitextCount)
$('#aitextCount').val(GM_getValue('taobaorate').aitextCount)
$('#aitextCount').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.aitextCount = $(this).val()
	GM_setValue('taobaorate', store)
	console.log('监听AI生成字数数 更新', GM_getValue('taobaorate').aitextCount)
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

/**
 * 通用AI调用函数
 * @param {string} prompt - 提示词内容
 * @returns {Promise<string|boolean>} - 返回生成的文本或false
 */
async function callAI(prompt) {
	const store = GM_getValue('taobaorate')
	const type = store.modelType
	const configName = type.toLowerCase() + '_config'
	const config = store[configName]

	if (!config || !config.url) {
		alert('AI Configuration Error: URL is missing')
		return false
	}

	// 变量替换
	let url = config.url
		.replace(/{{openaiApiKey}}/g, store.openaiApiKey)
		.replace(/{{geminiApiKey}}/g, store.geminiApiKey)

	// Headers 处理
	let headersStr = config.headers
		.replace(/{{openaiApiKey}}/g, store.openaiApiKey)
		.replace(/{{geminiApiKey}}/g, store.geminiApiKey)
	
	let headers = {}
	try {
		if (headersStr.trim()) {
			headers = JSON.parse(headersStr)
		}
	} catch (e) {
		console.error('Headers JSON parse error', e)
		alert('Headers JSON parse error: ' + e.message)
		return false
	}

	// Data 处理
	// 为了兼容换行符和特殊字符，我们先对 prompt 进行转义处理
	const escapedPrompt = prompt.replace(/[\r\n]/g, '\\n').replace(/"/g, '\\"')
	
	let dataStr = config.config || config.data 
	dataStr = dataStr
		.replace(/{{aitext_commit}}/g, escapedPrompt)
		.replace(/{{openaiApiKey}}/g, store.openaiApiKey)
		.replace(/{{geminiApiKey}}/g, store.geminiApiKey)

	let data = {}
	try {
		if (dataStr.trim()) {
			data = JSON.parse(dataStr)
		}
	} catch (e) {
		console.error('Data JSON parse error', e)
		alert('Data JSON parse error: ' + e.message)
		return false
	}

	try {
		const response = await axios.post(url, data, { headers: headers })
		
		// 响应解析
		let resultText = ''
		
		if (store.modelType === 'GPT') {
			if (response.data.choices && response.data.choices[0]) {
				resultText = response.data.choices[0].message.content
			}
		} else if (store.modelType === 'Gemini') {
			if (response.data.candidates && response.data.candidates[0]) {
				resultText = response.data.candidates[0].content.parts[0].text
			}
		} else {
			// Custom: Try GPT then Gemini
			if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
				resultText = response.data.choices[0].message.content
			} else if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
				resultText = response.data.candidates[0].content.parts[0].text
			} else {
				// 无法解析，返回整个JSON string供调试
				console.log('Unique custom response', response.data)
				resultText = JSON.stringify(response.data)
			}
		}
		
		return resultText.trim()
	} catch (error) {
		console.error('AI Request Error', error)
		if (error.response && error.response.data && error.response.data.error) {
			alert('AI Error: ' + error.response.data.error.message)
		} else {
			alert('AI Request Failed: ' + error.message)
		}
		return false
	}
}

/**
 * 填充评论主逻辑
 */
async function fillReviews() {
	const store = GM_getValue('taobaorate')
	const aitext_count = store.aitextCount
	
	if (isTB) {
		// 淘宝逻辑
		let tbTitleNodes
		if (document.querySelector('.item-title a')) {
			tbTitleNodes = document.querySelectorAll('.item-title a')
		} else if (document.querySelector('.item-info h3 a')) {
			tbTitleNodes = document.querySelectorAll('.item-info h3 a')
		}
		
		let tbRateMsg = document.querySelectorAll('.rate-msg')
		for (let i = 0; i < tbRateMsg.length; i++) {
			if (!tbRateMsg[i].value) {
				let productName = tbTitleNodes[i].textContent.trim()
				let prompt = `写一份关于网购买到的 “${productName}” 的${aitext_count}字好评。简短、口语化。（只出最终评语内容，不要任何多余的废话）`
				
				let result = await callAI(prompt)
				if (result) {
					tbRateMsg[i].value = result
				}
			}
		}
	} else if (isTM) {
		// 天猫逻辑
		let productName = document.querySelector('.ui-form-label h3') ? document.querySelector('.ui-form-label h3').textContent.trim() : '商品'
		
		let prompt = ''
		if (document.querySelector('.J_rateItem')) {
			// 首评：需要商品评价和服务评价
			prompt = `写一份关于网购买到的 “${productName}” 的口语化好评。分别写出${aitext_count}字的商品评价和${aitext_count}字的服务评价。商品评价写完后再写服务评价，商品评价与服务评价之间一定要用|间隔！一定要用|间隔！（只出最终评语内容，不要任何多余的废话）`
		} else {
			// 追评
			prompt = `写一份关于网购买到的 “${productName}” 的${aitext_count}字的一段时间使用后的追评好评。（只出最终评语内容，不要任何多余的废话）`
		}
		
		let result = await callAI(prompt)
		if (result) {
			if (document.querySelector('.J_rateItem')) {
				let parts = result.replace(/[\n*]/g, '').split('|')
				if (parts.length >= 2) {
					document.querySelector('.J_rateItem').value = parts[0].replace('商品评价：', '').trim()
					document.querySelector('.J_rateService').value = parts[1].replace('服务评价：', '').trim()
				} else {
					// Fallback if separator missing
					document.querySelector('.J_rateItem').value = result
				}
			} else if (document.querySelector('.ap-ct-textinput textarea')) {
				document.querySelector('.ap-ct-textinput textarea').value = result
			} else if (document.querySelector('.J_textInput')) { 
				// 针对 tmallMsg 中的选择器逻辑覆盖
				tmallMsgSet(result) // 复用或新建一个设置值的逻辑
			}
		}
	}
	return 202 // Success code
}

// 辅助函数：天猫设置值 (extracted from original tmallMsg)
function getTmallInputElements() {
	let textInputer
	const textInput = document.querySelector('.J_textInput')
	if (textInput) {
		textInputer = document.querySelectorAll('.J_textInput')
		if (textInput.shadowRoot) {
			const textEditor = textInput.shadowRoot.querySelector('#textEditor')
			if (textEditor && textEditor.shadowRoot) {
				textInputer = textEditor.shadowRoot.querySelectorAll('#textEl')
			}
		}
	} else if (document.querySelector('.J_textEditorContent')) {
		textInputer = document.querySelectorAll('.J_textEditorContent')
	}
	return textInputer
}

// 辅助函数：天猫设置值 (extracted from original tmallMsg)
function tmallMsgSet(text) {
	let textInputer = getTmallInputElements()
    if (textInputer) {
        for (var i = 0, a; (a = textInputer[i++]); ) {
            a.value = text
        }
    }
}


function taobaoFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tb-btn star">一键满星</div>
        <div class="tb-btn msg">一键评语</div>
        <div class="tb-btn starmsg">一键满星+评语</div>
        <div class="tb-btn haoping">一键提交好评</div>
    </div>
	<div class="submitboxplusai">
		<div class="tb-btn msg-ai">AI评语</div>
		<div class="tb-btn haoping-ai">一键满星AI好评</div>
    </div>
	`
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

	$('.tb-btn.msg-ai').click(() => {
		fillReviews()
	})

	$('.tb-btn.haoping-ai').click(async () => {
		const result = await fillReviews()
		console.log(result)

		if (result === 202) {
			taobaoStar()
			setTimeout(() => {
				$('.submitbox [type="submit"]').click()
			}, 500)
		}
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
	let textInputer = getTmallInputElements()
	if (textInputer) {
		for (var i = 0, a; (a = textInputer[i++]); ) {
			a.value = processedText()
		}
	}
}



function tmallFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tm-btn star">一键满星</div>
        <div class="tm-btn msg">一键评语</div>
        <div class="tm-btn starmsg">一键满星+评语</div>
        <div class="tm-btn haoping">一键提交好评</div>
		<br />
        <div class="tm-btn msg-ai">AI评语</div>
        <div class="tm-btn haoping-ai">一键提交AI好评</div>
    </div>`
	$('.compose-submit').after(elemStar)
	$('.tm-btn.star').click(() => {
		tmallStar()
	})
	$('.tm-btn.msg').click(() => {
		tmallMsg()
	})
	$('.tm-btn.msg-ai').click(() => {
		fillReviews()
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
	$('.tm-btn.haoping-ai').click(async () => {
		const result = await fillReviews()
		console.log(result)

		if (result === 202) {
			tmallStar()
			setTimeout(() => {
				$('.compose-btn [type="submit"]').click()
			}, 500)
		}
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
		$('.trade-button.trade-button-type-of-secondary.trade-button-size-of-middle:contains("打印")').after(
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
    new MutationObserver((_, observer) => {
        const haoping = document.querySelector('.haoping');
        if (!haoping) {
            tmallFun();
            autorate();
        } else {
            observer.disconnect();
        }
    }).observe(document.body, { childList: true, subtree: true });
}