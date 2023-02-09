/** 初始化设定 开始 */
// 引入CSS
GM_addStyle(GM_getResourceText('IMPORTED_CSS_1'))
GM_addStyle(GM_getResourceText('IMPORTED_CSS_2'))

// 默认值
var taobaorate = {
	autorate: false,
	rateMsgListText:
		'很满意的一次购物。真的很喜欢。完全超出期望值。质量非常好。掌柜好人，一生平安。非常满意。与卖家描述的完全一致。发货速度非常快。包装非常仔细、严实。物流公司服务态度很好。运送速度很快。下次有需求还来买。服务周到，态度热情。发货及时，物流很快。各方面都满意。给你全五星好评。',
	autoSort: true,
	autoDel: 3,
	autoPraiseAll: false,
}

alertify.set('notifier', 'position', 'top-center')

// 判断是否存在设定
// if (GM_getValue('taobaorate') === undefined) {
// 	GM_setValue('taobaorate', taobaorate)
// } else {
// 	let store = GM_getValue('taobaorate')
// 	$.each(taobaorate, function (i) {
// 		if (store[i] === undefined) {
// 			store[i] = taobaorate[i]
// 		}
// 	})
// 	GM_setValue('taobaorate', store)
// }
/** 初始化设定 结束 */

// 置入Style
// GM_addStyle(GM_getResourceText('style'))

// 置入DOM
function domAvatar() {
	$('.content-scroll.rightPinned .home-content .row:nth-child(2) .col-4 .btn-group-vertical').append(
		GM_getResourceText('html-avatar-btn')
	)

	tippy('#transmit', {
		content: 'Transfer to native Favorites \n Then click in the game to switch',
	})
	tippy('#use', {
		content: 'Switch now, but you need to switch the world to display correctly in the game',
	})
	tippy('#collect', {
		content: 'Add to Unlimited Favorites',
	})

	// $('.tm-btn.star').click(() => {
	// 	tmallStar()
	// })
	// $('.tm-btn.msg').click(() => {
	// 	tmallMsg()
	// })
	// $('.tm-btn.starmsg').click(() => {
	// 	tmallMsg()
	// 	tmallStar()
	// })
	// $('.tm-btn.haoping').click(() => {
	// 	tmallMsg()
	// 	tmallStar()
	// 	setTimeout(() => {
	// 		$('.compose-btn [type="submit"]').click()
	// 	}, 500)
	// })
}

var timer = setInterval(detection, 300)
detection()

function detection() {
	var neko0 = document.querySelector('.neko0')
	if (!neko0) {
		domAvatar()
	} else {
		clearInterval(timer)
		alertify.success("Success log message");
	}
}

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
})
window.addEventListener('replaceState', function (e) {
	console.log('change replaceState')
	detection()
})

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

let test = window.location.origin + '/api/1/avatars/avtr_d69c06ad-dda1-40c0-be11-c92042ff1074/select'

// axios
//     .put(test)
//     .then(function (response) {
//         console.log(response)
//     })
//     .catch(function (error) {
//         console.log(error)
//     })
//     .finally(function () {
//         // always executed
//     })

console.log('无限收藏夹加载完毕')
