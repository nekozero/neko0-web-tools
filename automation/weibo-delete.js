// ==UserScript==
// @name         [Neko0] 批量删除新浪微博
// @description  批量删除新浪微博
// @version      1.0.0
// @author       JoJunIori
// @namespace    neko0-web-tools
// @run-at       document-idle
// @grant        none
// @license      AGPL-3.0-or-later
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        *://weibo.com/*/profile?*
// ==/UserScript==

console.log('delete start')
// 尝试加载次数
let loadtime = 0
// 是否翻页
let flip = false
function del() {
    // 每5分钟刷新页面
    setTimeout(() => {
        $('a.gn_name')[0].click()
    }, 300000);
    // 开始循环任务
	window.setInterval(function () {
		// 判断URL
		if (window.location.href.indexOf('/profile') === -1) {
			return false
		}

		// 跳过无法删除的微博
		let cantdel = $('.W_tips.tips_rederror.clearfix').length
		if (cantdel > 3) {
			$("a:contains('下一页')")[0].click()
			return false
		} else {
			$('.W_tips.tips_rederror.clearfix').parent().parent().remove()
		}
		// 关闭"系统繁忙，请稍后再试"的弹窗提示
		if ($('.W_layer_close .W_ficon.ficon_close.S_ficon').length > 0) {
			$('.W_layer_close .W_ficon.ficon_close.S_ficon')[0].click()
		}
		// 数量少于6条时加载更多
		if ($('a[action-type="fl_menu"]').length < 6 - cantdel && ($("a:contains('上一页')").length > 0 || $("a:contains('下一页')").length > 0)) {
			// 判断动态加载次数，及是否能够翻页
			if (loadtime > 3) {
				flip && $("a:contains('上一页')").length > 0
					? $("a:contains('上一页')")[0].click()
					: $("a:contains('下一页')")[0].click()
				loadtime = 0
			} else {
				$(document).scrollTop(0)
				$(document).scrollTop(999999999)
				setTimeout(() => {
					$(document).scrollTop(0)
				}, 1000)
				loadtime += 1
			}
			return false
		}
		// 删除微博
		if ($('a[action-type="fl_menu"]').length > 0) {
			$('a[title="删除此条微博"]')[0].click()
			$('a[action-type="ok"]')[0].click()
			return false
		}else{
            $('a.gn_name')[0].click()
        }
	}, 1800)
}
// 判断如果有cookie 就不再弹窗，直接进行删除微薄
if (document.cookie.indexOf('delWeibo=1') !== -1) {
	del()
} else {
	var r = confirm('确定好要删除所有微薄了吗，确定好了就点确定吧!')
	if (r === true) {
		document.cookie = 'delWeibo=1'
		del()
	}
}
