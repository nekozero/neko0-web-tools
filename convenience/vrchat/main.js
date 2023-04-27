// ==UserScript==
// @name            [Neko0] VRChat Avatar 无限收藏夹
// @name:zh         [Neko0] VRChat 无限虚拟形象收藏夹
// @name:en         [Neko0] VRChat Limitless Favorite Avatar
// @description     无限收藏虚拟形象 Limitless Favorite Avatar
// @description:zh  无限收藏虚拟形象
// @description:en  Limitless Favorite Avatar
// @version         1.0.6
// @author          Mitsuki Joe
// @namespace       neko0-web-tools
// @icon            https://assets.vrchat.com/www/favicons/favicon.ico
// @homepageURL     https://github.com/nekozero/neko0-web-tools
// @supportURL      https://t.me/+FANQrUGRV7A0YmM9
// @updateURL       https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/convenience/vrchat/main.js
// @downloadURL     https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/convenience/vrchat/main.js
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_getResourceText
// @run-at          document-idle
// @license         AGPL-3.0-or-later
// @require         https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/axios@1.1.3/dist/axios.min.js
// @require         https://cdn.jsdelivr.net/npm/vue@2.7.14
// @require         https://unpkg.com/@popperjs/core@2
// @require         https://unpkg.com/tippy.js@6
// @require         https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
// @resource        IMPORTED_CSS_1 https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.rtl.min.css
// @match           *://vrchat.com/*
// @resource        IMPORTED_CSS_2 https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.5/convenience/vrchat/style.css
// @resource        html-avatar-btn https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.5/convenience/vrchat/html-avatar-btn.html
// @resource        html-avatar-list https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.5/convenience/vrchat/html-avatar-list.html
// @resource        html-btn-group https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.5/convenience/vrchat/html-btn-group.html
// @resource        language https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.0.5/convenience/vrchat/language.json
// ==/UserScript==
console.log('VLAF Start')
/** 初始化设定 开始 */
// 设置项默认值
let setting = {
	lang: 'en',
}

// 判断是否存在设定
if (GM_getValue('VLAF_setting') === undefined) {
	GM_setValue('VLAF_setting', setting)
} else {
	let store = GM_getValue('VLAF_setting')
	$.each(setting, function (i) {
		if (store[i] === undefined) {
			store[i] = setting[i]
		}
	})
	GM_setValue('VLAF_setting', store)
}

// 示例模型列表
let avatars = []
if (GM_getValue('VLAF_avatars') === undefined) {
	GM_setValue('VLAF_avatars', avatars)
}

/** 初始化设定 结束 */

// 提示框位置
alertify.set('notifier', 'position', 'top-center')

// 实时获取最新设置
let getSet = () => {
	return GM_getValue('VLAF_setting')
}
// 更改设置
let setSet = (key, value) => {
	let store = GM_getValue('VLAF_setting')
	store[key] = value
	GM_setValue('VLAF_setting', store)
}
// 实时获取最新模型列表
let getAvtrs = () => {
	return GM_getValue('VLAF_avatars')
}

// 文本内容多语言替换
let text = JSON.parse(GM_getResourceText('language'))[getSet().lang]
console.log('getSet()', getSet())
console.log('lang', getSet().lang)
console.log('text', text)

// 置入Style
GM_addStyle(GM_getResourceText('IMPORTED_CSS_1'))
GM_addStyle(GM_getResourceText('IMPORTED_CSS_2'))

// 正则替换DOM内“变量”
// From: https://gist.github.com/cybercase/2298e242e82d32b15787
if (!String.prototype.format) {
	String.prototype.format = function (dict) {
		return this.replace(/{(\w+)}/g, function (match, key) {
			return typeof dict[key] !== 'undefined' ? dict[key] : match
		})
	}
}

// 左侧导航栏
;(function () {
	// 置入DOM
	function domBtnGroup() {
		let html = GM_getResourceText('html-btn-group')
		let output = html.format(text)
		$('.leftbar .btn-group-vertical').prepend(output)
	}
	// 检测页面内容置入插件DOM
	var timer = setInterval(detection, 300)
	detection()
	function detection() {
		var neko0 = document.querySelector('.limitless')
		if (!neko0) {
			domBtnGroup()
		} else {
			clearInterval(timer)
			alertify.success(text.mounted)
		}
	}

	// 绑定点击事件
	// 打开设置窗口
	// $('.n-box .button.switch').click(() => {
	// 	$('.n-box').toggleClass('open')
	// })

	// setTimeout(() => {
	// alertify.success("You've clicked OK")
	// window.alertify = alertify
	// console.log('alertify')
	// }, 1000)
})()

// 判断已收藏
let isInVLAF = avtr_id => {
	let store = getAvtrs()
	return store.find(obj => obj.id === avtr_id)
}
// 格式化当前时间
let getNowDate = () => {
	// 定义一个函数来补齐两位数
	function pad(num) {
		return num < 10 ? '0' + num : num
	}

	// 获取当前时间的 Date 对象
	let date = new Date()

	// 获取年月日时分秒毫秒
	let year = date.getFullYear()
	let month = pad(date.getMonth() + 1)
	let day = pad(date.getDate())
	let hour = pad(date.getHours())
	let minute = pad(date.getMinutes())
	let second = pad(date.getSeconds())
	let millisecond = pad(date.getMilliseconds())

	// 拼接成 2022-07-19T20:50:50.033Z 这种格式
	let formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`

	// 打印结果
	return formatted
}

// Detect error types

// 马上切换
let select = avtr_id => {
	url = window.location.origin + '/api/1/avatars/' + avtr_id + '/select'
	axios
		.put(url)
		.then(function (response) {
			console.log(response)
			alertify.success(text.operation_succeeded)
		})
		.catch(function (error) {
			console.log(error)
			alertify.error(text.operation_failed)
		})
		.finally(function () {})
}
// 收藏到系统收藏夹
let favorites = avtr_id => {
	url = window.location.origin + '/api/1/favorites'
	val = {
		type: 'avatar',
		favoriteId: avtr_id,
		tags: ['avatars1'],
	}
	axios
		.post(url, val)
		.then(function (response) {
			console.log(response)
			alertify.success(text.operation_succeeded)
		})
		.catch(function (error) {
			console.log(error)
			let msg = error.response.data.error.message
			let avatars_full = msg === "You already have 50 favorite avatars in group 'avatars1'"
			let avatars_added = msg === 'You already have that avatar favorited'
			if (avatars_full) {
				alertify.error(text.avatars_full)
			} else if (avatars_added) {
				alertify.warning(text.avatars_added)
			} else {
				alertify.error(text.operation_failed)
			}
		})
		.finally(function () {})
}
// 收藏到无限收藏夹
let limitless = avtr_id => {
	console.log('ƒ limitless')
	url = window.location.origin + '/api/1/avatars/' + avtr_id

	let store = getAvtrs()
	const result = isInVLAF(avtr_id)

	if (result) {
		console.log('存在')
		store = store.filter(function (obj) {
			return obj.id !== avtr_id
		})
		$('#collect').text(text.btn_collect).removeClass('text-danger border-danger')
		GM_setValue('VLAF_avatars', store)
	} else {
		console.log('不存在')
		let data = null
		axios
			.get(url)
			.then(function (response) {
				console.log('limitless', response)
				alertify.success(text.operation_succeeded)
				data = response.data
				data.addTime = getNowDate()
				store.push(data)
				$('#collect').text(text.btn_collect_r).addClass('text-danger border-danger')
				GM_setValue('VLAF_avatars', store)
			})
			.catch(function (error) {
				console.log(error)
			})
			.finally(function () {})
	}
}

// 不同页面
let page_is_avtr_own = () => {
	return document.location.pathname === '/home/avatars'
}
let page_is_avtr_details = () => {
	return document.location.pathname.indexOf('/home/avatar/avtr_') !== -1
}
let page_is_limitless = () => {
	return document.location.pathname === '/home/limitless'
}

let pluginInject = () => {
	if (!page_is_limitless() && $('.neko0.limitless-list.row')[0]) {
		$('.neko0.limitless-list.row')[0].remove()
	}
	if (page_is_avtr_own()) {
		console.log('page_is_avtr_own')
		// 当前使用Avatar
		// let current_avtr_id = document.querySelector('[data-scrollkey]').getAttribute('data-scrollkey')
		// console.log(current_avtr_id)
		// let current_avtr_info = null
		// ;(function () {
		// 	url =
		// 		'https://vrchat.com/api/1/users/' +
		// 		document.querySelector('[aria-label="User Status"]').getAttribute('href').substring(11) +
		// 		'/avatar'
		// 	axios
		// 		.get(url)
		// 		.then(function (response) {
		// 			console.log(response)
		// 			current_avtr_info = response.data
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error)
		// 		})
		// 		.finally(function () {

		// 		})
		// })()
		// 算了暂时先不改这个
	} else if (page_is_avtr_details()) {
		// 当前浏览Avatar
		let current_avtr_id = window.location.pathname.substring(13)

		console.log('page_is_avtr_details', isInVLAF(current_avtr_id), getAvtrs())

		// 置入DOM
		function domAvatar() {
			let html = GM_getResourceText('html-avatar-btn')
			let output = html.format(text)
			$('.col-xs-12.content-scroll  .home-content .row:nth-child(2) .col-4 .btn-group-vertical')
				.attr('id', 'neko0')
				.append(output)
			if (isInVLAF(current_avtr_id)) {
				$('#collect').text(text.btn_collect_r).addClass('text-danger border-danger')
			}

			tippy('#transmit', {
				content: text.tippy_transmit,
			})
			tippy('#use', {
				content: text.tippy_use,
			})
			tippy('#collect', {
				content: text.tippy_collect,
			})

			$('#transmit').click(() => {
				favorites(current_avtr_id)
			})
			$('#use').click(() => {
				select(current_avtr_id)
			})
			$('#collect').click(() => {
				limitless(current_avtr_id)
			})
		}

		// 检测页面内容置入插件DOM
		var timer = setInterval(detection, 300)
		detection()
		function detection() {
			var neko0 = document.querySelector('.neko0')
			if (!neko0) {
				domAvatar()
			} else {
				clearInterval(timer)
			}
		}
		console.log(text.mounted)
	} else if (page_is_limitless()) {
		console.log('page_is_limitless', getAvtrs())
		// 置入DOM
		function domLimitless() {
			let html = GM_getResourceText('html-avatar-list')
			let output = html
			$('.home-content').append(output)

			new Vue({
				el: '#neko0',
				data: {
					text: text,
					items: getAvtrs(),
				},
				methods: {
					// 语言切换
					languageSwitch: function () {
						getSet().lang === 'en' ? setSet('lang', 'zh_cn') : setSet('lang', 'en')
						text = JSON.parse(GM_getResourceText('language'))[getSet().lang]
						location.reload()
					},

					// 导出导入
					exportList: function () {
						// 将 JSON 数据转换为字符串
						const jsonString = JSON.stringify(getAvtrs())
						// 创建一个 Blob 对象
						const blob = new Blob([jsonString], { type: 'application/json' })
						// 创建一个下载链接
						const link = document.createElement('a')
						link.href = URL.createObjectURL(blob)
						link.download = 'LimitlessAvatars.json'
						// 模拟点击链接下载文件
						document.body.appendChild(link)
						link.click()
					},
					importList: function () {
						console.log('ƒ importList')
						const fileInput = document.getElementById('file-input')
						fileInput.click()
					},
					fileUpload: function () {
						console.log('ƒ fileUpload')
						const fileInput = document.getElementById('file-input')
						const file = fileInput.files[0]
						const reader = new FileReader()

						reader.onload = event => {
							const fileContent = event.target.result
							const jsonData = JSON.parse(fileContent)
							console.log('import:', jsonData)

							const A = getAvtrs()
							const B = jsonData

							const diff = _.differenceBy(B, A, 'id')
							const merge = _.concat(A, diff)

							console.log('merge:', merge)
							GM_setValue('VLAF_avatars', merge)
							this.items = merge
						}

						reader.readAsText(file)
					},

					// 格式化时间
					formattedDate: function (str) {
						const dateStr = str
						const date = new Date(dateStr)
						const year = date.getFullYear()
						const month = date.getMonth() + 1
						const day = date.getDate()
						const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
							.toString()
							.padStart(2, '0')}`
						console.log(formattedDate)
						return formattedDate
					},
					hasWindows: function (obj) {
						// 定义一个变量来存储检查结果
						let hasWindows = false

						// 遍历对象中的 unityPackages 数组
						for (let package of obj.unityPackages) {
							// 如果某个元素的 platform 属性等于 standalonewindows，就将结果设为 true，并跳出循环
							if (package.platform === 'standalonewindows') {
								hasWindows = true
								break
							}
						}

						return hasWindows
					},
					hasAndroid: function (obj) {
						// 定义一个变量来存储检查结果
						let hasAndroid = false

						// 遍历对象中的 unityPackages 数组
						for (let package of obj.unityPackages) {
							// 如果某个元素的 platform 属性等于 android，就将结果设为 true，并跳出循环
							if (package.platform === 'android') {
								hasAndroid = true
								break
							}
						}

						return hasAndroid
					},
					favorites: function (avtr_id) {
						favorites(avtr_id)
					},
					select: function (avtr_id) {
						select(avtr_id)
					},
					limitless: function (avtr_id) {
						limitless(avtr_id)
						$('[dat-a="' + avtr_id + '"]')
							.parents('.avatar-li')
							.remove()
					},
				},
				created: function () {
					let _this = this
					window.add_data = _this.add_data
				},

				mounted() {
					tippy('.transmit', {
						content: text.tippy_transmit,
					})
					tippy('.use', {
						content: text.tippy_use,
					})
					tippy('.collect', {
						content: text.tippy_collect,
					})
					tippy('.export', {
						content: text.tippy_export,
					})
					tippy('.import', {
						content: text.tippy_import,
					})
				},
			})
		}

		// 检测页面内容置入插件DOM
		var timer = setInterval(detection, 300)
		detection()
		function detection() {
			var neko0 = document.querySelector('.neko0')
			if (!neko0) {
				domLimitless()
			} else {
				clearInterval(timer)
			}
		}
		console.log(text.mounted)
	}
}

pluginInject()

// 监测页面变换
const _historyWrap = function (type) {
	const orig = history[type]
	const e = new Event(type)
	return function () {
		const rv = orig.apply(this, arguments)
		e.arguments = arguments
		window.dispatchEvent(e)
		return rv
	}
}
history.pushState = _historyWrap('pushState')
history.replaceState = _historyWrap('replaceState')
window.addEventListener('pushState', function (e) {
	console.log('change pushState')
	pluginInject()
})
window.addEventListener('replaceState', function (e) {
	console.log('change replaceState')
})
