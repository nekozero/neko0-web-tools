// ==UserScript==
// @name         Steam库存一键出售功能
// @description  Steam库存页面添加一键出售按钮
// @version      1.0.2
// @author       JoJunIori
// @namespace    neko0-web-tools
// @homepageURL  https://github.com/jojuniori/neko0-web-tools
// @grant        none
// @run-at       document-end
// @license      AGPLv3
// @include      *://steamcommunity.com/*
// @include      *://ratewrite.tmall.com/*
// ==/UserScript==

// 选取标识
let sp = '.item_market_actions > div > div:nth-child(2)'; // 文本-起价
let protocol = '#market_sell_dialog_accept_ssa'; // 多选框-协议
let currency = '#market_sell_currency_input'; // 输入框-价格
let currency_ok = '#market_sell_dialog_accept'; // 按钮-确认价格
let currency_dialog_ok = '#market_sell_dialog_ok'; // 按钮-确认出售
let modal_ok = '.newmodal_buttons .btn_grey_white_innerfade.btn_medium'; // 按钮-确认出售成功
let sell_button = '.item_market_action_button.item_market_action_button_green'; // 按钮-出售
let inventory_page = '.inventory_ctn > .inventory_page:not(.missing_item_holders)'; // 库存页面

// 选择方式简写
let select = (val) => {
	return document.querySelector(val);
};
let selectAll = (val) => {
	return document.querySelectorAll(val);
};

// 一键出售
window.quickSell = () => {
	// 获取起价
	for (let item of selectAll(sp)) {
		if (item.offsetParent && item.offsetParent.className !== null && item.offsetParent.className === 'inventory_page_right') {
			$$ = parseFloat(item.innerText.split('¥ ')[1].split('个')[0]);
		}
	}
	// 加价
	$$ += 0.02;
	// 位数修正
	$$ = $$.toFixed(2);
	// 出售
	SellCurrentSelection();
	// 判断是否同意协议
	if (!select(protocol).checked) {
		select(protocol).click();
	}
	// 输入价格
	select(currency).value = $$;
	// 确认出售
	setTimeout(() => {
		select(currency_ok).click();
		select(currency_ok).click();
	}, 500);
	setTimeout(() => {
		select(currency_dialog_ok).click();
	}, 1000);
	// 成功出售后的确认按钮检测
	let s = setInterval(() => {
		if (select(modal_ok)) {
			select(modal_ok).click();
			clearInterval(s);
		}
	}, 100);
};

// 创建一键出售按钮
let NewDir = document.createElement('a');
NewDir.innerHTML = '<span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">一键出售</span><span class="item_market_action_button_edge item_market_action_button_right"></span><span class="item_market_action_button_preload"></span>';
NewDir.className = 'item_market_action_button item_market_action_button_green';
NewDir.style.marginLeft = '10px';
NewDir.href = 'javascript:quickSell()';

// 添加一键出售按钮
let addButton = () => {
	let b = setInterval(() => {
		if (select(sell_button)) {
			for (let item of selectAll(sell_button)) {
				if (item.offsetParent && item.offsetParent.className !== null && item.offsetParent.className === 'inventory_page_right') {
					item.parentNode.appendChild(NewDir);
				}
			}
			clearInterval(b);
		}
	}, 100);
};

// 添加事件
let checkItems = () => {
	itemHolder = selectAll('.itemHolder');
	for (let item of itemHolder) {
		item.onclick = function() {
			addButton();
		};
	}
};

window.onload = function() {
	checkItems();
	addButton();
	// 检测新加载页添加事件
	let page = selectAll(inventory_page).length;
	setInterval(() => {
		if (selectAll(inventory_page).length !== page) {
			checkItems();
			page = selectAll(inventory_page).length;
		}
	}, 500);
};