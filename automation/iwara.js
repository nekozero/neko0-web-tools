// ==UserScript==
// @name         [Neko0] Iwara增强
// @description  提供 "一键复制名字 并 喜欢+关注+下载" 与单独 "复制名字" 的功能, 便捷地收藏自己喜欢的视频到本地, 以免作者销号后就看不到了
// @version      1.2.1
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.iwara.tv/logo.png
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://t.me/+URovzRdPTyHlWtQd
// @updateURL    https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/iwara.js
// @downloadURL  https://raw.githubusercontent.com/nekozero/neko0-web-tools/master/automation/iwara.js
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @match        *://*.iwara.tv/*
// ==/UserScript==

// 视频页
if (window.location.pathname.indexOf('/video/') == -1) return false

// 置入Style
let style = `<style>
.page-video__bottom {
    border-radius: 5px 5px 0 0 !important;
}
.one-tap, .copy-name {
    margin-left: 10px;
}
.detection {
    position: absolute;
    line-height: 20px;
    height: 20px;
    top: -30px;
    width: 100%;
    text-align: center;
    color: #3498db;
    white-space: nowrap;
}
// 根除R18警告
.adultWarning {
    display: none !important;
}
</style>`
$('head').append(style)

// 分辨率检测
function detection() {
	console.log('ƒ detection')
	let video = document.querySelector('.vjs-tech')
	if (video) {
		clearInterval(timer)
		// 自动点击R18警告的继续按钮
		if ($('.adultWarning')[0]) {
			$('.adultWarning__actions>button')[0].click()
		}
		// 按钮
		// 文件名
		let username = $('.username').attr('title')
		let title = $('.page-video__details > .text.mb-1.text--h1.text--bold').text()
		let filename = username + ' - ' + title
		// 替换windows文件名禁用字符
		filename = filename.replace(/[/\\:*?<>|]/g, ' ')
		// 置入DOM
		// Old: <div class="block block-plus"></div>
		let dom = `
<button class="button copy-name button--primary button--solid" data-clipboard-text="${filename}" type="button"><div class="text text--small"><div class="icon mr-1">
    <svg class="svg-inline--fa fa-share-nodes " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V428.7c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2H240c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h8.2c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8h8.9c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z"/></svg>
    </div>复制名字</div>
</button>
<button class="button one-tap button--primary button--solid" type="button"><div class="text text--small"><div class="icon mr-1">
    <svg class="svg-inline--fa fa-share-nodes " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"/></svg>
    </div>一键喜欢关注下载</div>
</button>
`
		// $('.region.region-sidebar').prepend(dom)
		$('.container-fluid > .row > .col-12')[0].prepend($('.page-video__bottom')[0])
		$('.page-video__actions').append(dom)
		// 替换广告的位置
		$('.page-video__details')[0].after($('.contentBlock.mb-2')[0])
		// 绑定 一键喜欢关注下载 事件
		$('.one-tap').click(() => {
			// 拷贝名称
			$('.copy-name').click()
			// 喜欢
			$('.page-video__actions svg.svg-inline--fa.fa-heart').parent().parent().parent().click()
			// 关注
			$('.page-video__byline__actions svg.svg-inline--fa.fa-heart').parent().parent().parent().click()

			// 下载
			$('.dropdown__content a:contains("Source")')[0].click()
		})

		// 解决新版默认不以Source分辨率播放并无法记忆用户设置的问题
		function checkSource() {
			return new Promise((resolve, reject) => {
				console.log('ƒ checkSource')
				if (!video.src.match('_Source.mp4')) {
					$('.vjs-menu-item.resolution-Source').click()
				}
				resolve()
			})
		}

		// video可播放后将分辨率标注出来
		function checkResolution() {
			console.log('ƒ checkResolution')
			// do something
			video.oncanplay = function () {
				console.log(this)
				console.log(this.videoWidth, this.videoHeight)
				if (
					(this.videoWidth < 1920 && this.videoHeight < 1080) ||
					(this.videoWidth < 1080 && this.videoHeight < 1920)
				) {
					$('.container-fluid > .row > .col-12').eq(0).prepend(
						`<div class="detection" style="color: red;">${this.videoWidth} x ${this.videoHeight}</div>`
					)
				} else {
					$('.container-fluid > .row > .col-12').eq(0).prepend(
						`<div class="detection">${this.videoWidth} x ${this.videoHeight}</div>`
					)
				}
			}
		}

		checkSource().then(checkResolution)
	}
}
var timer = setInterval(detection, 1000)

// 剪切板初始化
let clipboard = new ClipboardJS('.copy-name')
clipboard.on('success', function (e) {
	console.info('Action:', e.action)
	console.info('Text:', e.text)
	console.info('Trigger:', e.trigger)
	e.clearSelection()
})
clipboard.on('error', function (e) {
	console.error('Action:', e.action)
	console.error('Trigger:', e.trigger)
})

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
	timer = setInterval(detection, 1000)
})
window.addEventListener('replaceState', function (e) {
	console.log('change replaceState')
})
