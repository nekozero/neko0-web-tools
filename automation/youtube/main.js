// ==UserScript==
// @name         [Neko0] Youtube增强
// @version      1.8
// @description  YouTube视频一键点赞收藏到多个播放列表、一键复制名字（已适配新版UI，性能优化，稳定性改进）
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://t.me/+URovzRdPTyHlWtQd
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @run-at       document-end
// @license      AGPL-3.0-or-later
// @include      *://www.youtube.com/watch?v=*
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_PLAYLISTS = 'Watch later';
    const DEFAULT_AUTO_SUBSCRIBE = false;
    const DEFAULT_AUTO_CLOSE_DIALOG = true;

    // 获取配置
    function getPlaylists() {
        return GM_getValue('playlists', DEFAULT_PLAYLISTS);
    }

    // 保存配置
    function savePlaylists(playlists) {
        GM_setValue('playlists', playlists);
    }

    // 获取自动订阅配置
    function getAutoSubscribe() {
        return GM_getValue('autoSubscribe', DEFAULT_AUTO_SUBSCRIBE);
    }

    // 保存自动订阅配置
    function saveAutoSubscribe(autoSubscribe) {
        GM_setValue('autoSubscribe', autoSubscribe);
    }

    // 获取自动关闭对话框配置
    function getAutoCloseDialog() {
        return GM_getValue('autoCloseDialog', DEFAULT_AUTO_CLOSE_DIALOG);
    }

    // 保存自动关闭对话框配置
    function saveAutoCloseDialog(autoCloseDialog) {
        GM_setValue('autoCloseDialog', autoCloseDialog);
    }

    // 等待元素出现的辅助函数
    async function waitForElement(selector, condition, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const elements = document.querySelectorAll(selector);

            for (let element of elements) {
                if (condition(element)) {
                    return true;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return false;
    }

    // 点赞功能
    async function likeVideo() {
        try {
            console.log('检查点赞状态...');

            // 先找到点赞按钮的父容器
            const likeButtonHost = document.querySelector('.ytLikeButtonViewModelHost');
            
            if (!likeButtonHost) {
                console.log('⚠️ 未找到点赞按钮容器 (.ytLikeButtonViewModelHost)');
                return false;
            }

            console.log('✓ 找到点赞按钮容器');

            // 在父容器内查找点赞按钮
            const likeButton = likeButtonHost.querySelector('button.yt-spec-button-shape-next');

            if (!likeButton) {
                console.log('⚠️ 在容器内未找到点赞按钮 (button.yt-spec-button-shape-next)');
                return false;
            }

            // 检查点赞状态
            const ariaPressed = likeButton.getAttribute('aria-pressed');

            if (ariaPressed === null) {
                console.log('⚠️ 点赞按钮没有 aria-pressed 属性');
                return false;
            }

            if (ariaPressed === 'true') {
                console.log('✓ 视频已经点赞过了');
                return true;
            }

            // 执行点赞
            console.log('点击点赞按钮...');
            likeButton.click();
            console.log('✓ 点赞成功');
            
            // 等待一下让点赞生效
            await new Promise(resolve => setTimeout(resolve, 300));
            return true;

        } catch (error) {
            console.error('✗ 点赞失败:', error.message);
            return false;
        }
    }

    // 订阅功能
    async function subscribeChannel() {
        try {
            console.log('检查订阅状态...');

            // 查找订阅按钮容器
            const subscribeButtonShape = document.querySelector('#subscribe-button-shape');
            
            if (!subscribeButtonShape) {
                console.log('⚠️ 未找到订阅按钮容器 (#subscribe-button-shape)');
                return false;
            }

            console.log('✓ 找到订阅按钮容器');

            // 在容器内查找按钮
            const subscribeButton = subscribeButtonShape.querySelector('button');

            if (!subscribeButton) {
                console.log('⚠️ 在容器内未找到订阅按钮');
                return false;
            }

            // 检查按钮文本，判断是否已订阅
            const buttonText = subscribeButton.textContent.trim();
            
            if (buttonText === '已订阅' || buttonText === 'Subscribed') {
                console.log('✓ 已经订阅过该频道了');
                return true;
            }

            // 执行订阅
            console.log('点击订阅按钮...');
            subscribeButton.click();
            console.log('✓ 订阅成功');
            
            // 等待一下让订阅生效
            await new Promise(resolve => setTimeout(resolve, 300));
            return true;

        } catch (error) {
            console.error('✗ 订阅失败:', error.message);
            return false;
        }
    }

    // 打开保存对话框
    async function openSaveDialog() {
        try {
            console.log('步骤1: 查找并点击"保存"按钮...');
            
            // 查找所有div元素
            const allDivs = document.querySelectorAll('div');
            let clicked = false;

            for (let div of allDivs) {
                // 检查div文本内容是否为"保存"
                if (div.textContent.trim() === '保存') {
                    // 检查父元素是否为 button.yt-spec-button-shape-next
                    const parentButton = div.parentElement;
                    if (parentButton && 
                        parentButton.tagName === 'BUTTON' && 
                        parentButton.classList.contains('yt-spec-button-shape-next')) {
                        console.log('✓ 找到保存按钮（div父元素为button.yt-spec-button-shape-next）');
                        parentButton.click();
                        console.log('✓ 已点击"保存"按钮');
                        clicked = true;
                        break;
                    }
                }
            }

            // 如果找不到保存按钮,先点击按钮打开菜单
            if (!clicked) {
                console.log('未找到"保存"按钮,尝试先点击按钮打开菜单...');
                const menuButton = document.querySelector('#button-shape > button');

                if (!menuButton) {
                    throw new Error('未找到菜单按钮');
                }

                menuButton.click();
                console.log('✓ 已点击菜单按钮');

                // 等待菜单出现
                await new Promise(resolve => setTimeout(resolve, 500));

                // 再次查找"保存"按钮
                console.log('再次查找"保存"按钮...');
                let formattedStrings = document.querySelectorAll('yt-formatted-string.ytd-menu-service-item-renderer');

                for (let element of formattedStrings) {
                    if (element.textContent.trim() === '保存') {
                        const paperItem = element.closest('tp-yt-paper-item');
                        if (paperItem) {
                            paperItem.click();
                            console.log('✓ 已点击"保存"按钮');
                            clicked = true;
                            break;
                        }
                    }
                }

                if (!clicked) {
                    throw new Error('仍然未找到"保存"按钮');
                }
            }

            // 等待"保存到…"出现
            console.log('步骤2: 等待"保存到…"出现...');
            const dialogAppeared = await waitForElement(
                'span[role="text"]',
                (el) => el.textContent.trim() === '保存到…',
                5000
            );

            if (!dialogAppeared) {
                throw new Error('超时：未找到"保存到…"');
            }
            console.log('✓ "保存到…"已出现');

            // 额外等待一下确保DOM完全加载
            await new Promise(resolve => setTimeout(resolve, 300));

            return true;
        } catch (error) {
            console.error('✗ 打开对话框失败:', error.message);
            return false;
        }
    }

    // 点击单个播放列表项
    async function clickPlaylistItem(playlistName) {
        try {
            console.log(`查找并点击"${playlistName}"列表项...`);
            
            // 查找所有包含播放列表名称的元素
            const allElements = document.querySelectorAll('*');
            
            for (let element of allElements) {
                // 检查元素的直接文本内容是否为播放列表名称
                if (element.textContent.trim() === playlistName) {
                    // 向上查找父元素，找到 class="yt-list-item-view-model"
                    let parent = element;
                    while (parent && parent !== document.body) {
                        if (parent.classList && parent.classList.contains('yt-list-item-view-model')) {
                            console.log(`✓ 找到"${playlistName}"的父元素 .yt-list-item-view-model`);
                            
                            // 检查是否已经收藏过了
                            // 通过 aria-label 属性判断，如果包含"已选中"则表示已收藏
                            const ariaLabel = parent.getAttribute('aria-label');
                            if (ariaLabel && ariaLabel.includes('已选中')) {
                                console.log(`ℹ️ "${playlistName}"已经收藏过了（aria-label 包含"已选中"），跳过点击`);
                                // 等待一下再返回，保持与点击操作相同的时间
                                await new Promise(resolve => setTimeout(resolve, 500));
                                return true;
                            }
                            
                            parent.click();
                            console.log(`✓ 已点击"${playlistName}"列表项`);
                            // 等待点击生效和窗口自动关闭
                            await new Promise(resolve => setTimeout(resolve, 500));
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                }
            }

            console.error(`✗ 未找到"${playlistName}"的 .yt-list-item-view-model 父元素`);
            return false;

        } catch (error) {
            console.error(`✗ 点击"${playlistName}"列表项失败:`, error.message);
            return false;
        }
    }

    // 关闭保存对话框
    async function closeSaveDialog() {
        try {
            console.log('等待1秒后关闭对话框...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 在 ytd-popup-container 中查找 close-button
            const popupContainers = document.querySelectorAll('.style-scope.ytd-popup-container');

            for (let container of popupContainers) {
                const closeButton = container.querySelector('#close-button');
                if (closeButton) {
                    closeButton.click();
                    console.log('✓ 已点击关闭按钮');
                    return true;
                }
            }

            console.log('⚠️ 未找到关闭按钮');
            return false;

        } catch (error) {
            console.error('✗ 关闭对话框失败:', error.message);
            return false;
        }
    }

    // 一键点赞收藏
    async function likeAndSaveVideo() {
        console.log('=== 开始执行一键点赞收藏 ===\n');

        // 第一步：点赞
        await likeVideo();

        // 第二步：检查是否需要订阅
        const autoSubscribe = getAutoSubscribe();
        if (autoSubscribe) {
            console.log('\n自动订阅已启用，开始订阅频道...');
            await subscribeChannel();
        } else {
            console.log('\n自动订阅未启用，跳过订阅');
        }

        const playlistsStr = getPlaylists();
        const playlists = playlistsStr.split(',').map(p => p.trim()).filter(p => p);

        if (playlists.length === 0) {
            alert('请先在设置中配置播放列表！');
            return;
        }

        console.log(`\n准备保存到 ${playlists.length} 个播放列表:`, playlists);

        // 第三步：打开一次保存对话框
        console.log('\n打开保存对话框...');
        const dialogOpened = await openSaveDialog();
        if (!dialogOpened) {
            console.error('✗ 无法打开保存对话框');
            return;
        }

        // 等待 500ms 让 DOM 完全加载和状态更新
        console.log('等待 500ms 让状态刷新...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 第四步：批量处理所有播放列表
        // 虽然窗口显示为关闭（display: none），但 DOM 仍然存在，可以继续操作
        console.log('\n开始批量检测和收藏播放列表...\n');
        
        let successCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        for (let i = 0; i < playlists.length; i++) {
            const playlistName = playlists[i];
            console.log(`[${i + 1}/${playlists.length}] 处理播放列表: ${playlistName}`);

            try {
                // 在 DOM 中查找播放列表项（即使窗口被隐藏了）
                const allElements = document.querySelectorAll('*');
                let found = false;

                for (let element of allElements) {
                    if (element.textContent.trim() === playlistName) {
                        let parent = element;
                        while (parent && parent !== document.body) {
                            if (parent.classList && parent.classList.contains('yt-list-item-view-model')) {
                                // 检查是否已经收藏
                                // 通过 aria-label 属性判断，如果包含"已选中"则表示已收藏
                                const ariaLabel = parent.getAttribute('aria-label');
                                if (ariaLabel && ariaLabel.includes('已选中')) {
                                    console.log(`  ✓ "${playlistName}" 已收藏，跳过`);
                                    skippedCount++;
                                    found = true;
                                    break;
                                }

                                // 未收藏，直接点击
                                parent.click();
                                console.log(`  ✓ "${playlistName}" 收藏成功`);
                                successCount++;
                                found = true;
                                
                                // 等待一下让点击生效
                                await new Promise(resolve => setTimeout(resolve, 200));
                                break;
                            }
                            parent = parent.parentElement;
                        }
                        if (found) break;
                    }
                }

                if (!found) {
                    console.log(`  ✗ "${playlistName}" 未找到`);
                    failedCount++;
                }

            } catch (error) {
                console.error(`  ✗ "${playlistName}" 处理失败:`, error.message);
                failedCount++;
            }
        }

        // 第五步：等待后关闭对话框
        console.log('\n等待 1 秒后关闭保存对话框...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const titleElement = document.querySelector('#title');
            if (titleElement) {
                titleElement.click();
                console.log('✓ 已点击 #title 关闭对话框');
            } else {
                console.log('⚠️ 未找到 #title 元素，对话框可能仍然可见');
            }
        } catch (error) {
            console.error('✗ 关闭对话框失败:', error.message);
        }

        // 总结
        console.log('\n=== ✓ 一键点赞收藏完成！===');
        console.log(`成功: ${successCount} | 跳过: ${skippedCount} | 失败: ${failedCount}`);
    }

    // 一键复制名称功能
    function copyVideoInfo() {
        try {
            // 获取上传者名字
            const channelNameEl = document.querySelector('#text.ytd-channel-name');
            const uploaderName = channelNameEl ? channelNameEl.getAttribute('title') : '';
            
            // 获取视频标题
            const videoTitleEl = document.querySelector('#title.style-scope.ytd-watch-metadata > h1 > yt-formatted-string');
            const videoTitle = videoTitleEl ? videoTitleEl.getAttribute('title') : '';
            
            if (!uploaderName || !videoTitle) {
                alert('⚠️ 无法获取视频信息');
                console.error('上传者:', uploaderName, '标题:', videoTitle);
                return;
            }
            
            // 组合文本：【上传者】视频标题
            const textToCopy = `${uploaderName} - ${videoTitle}`;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('✓ 已复制:', textToCopy);
                
                // 临时提示
                const toast = document.createElement('div');
                toast.textContent = '✓ 已复制到剪贴板';
                toast.style.cssText = `
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 14px;
                    font-family: "Roboto","Arial",sans-serif;
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }).catch(err => {
                console.error('✗ 复制失败:', err);
                alert('✗ 复制失败');
            });
            
        } catch (error) {
            console.error('✗ 复制视频信息失败:', error);
            alert('✗ 复制失败');
        }
    }

    // 创建按钮UI
    function createUI() {
        // 等待 above-the-fold 元素出现
        const checkAndInsert = () => {
            const aboveTheFold = document.querySelector('#above-the-fold');
            const topRow = aboveTheFold ? aboveTheFold.querySelector('#top-row') : null;
            
            if (!topRow) {
                // 如果还没找到，等待一下再试
                setTimeout(checkAndInsert, 500);
                return;
            }

            // 检查是否已经插入过了
            if (document.querySelector('#yt-optimizer-container')) {
                return;
            }

            // 创建主容器
            const container = document.createElement('div');
            container.id = 'yt-optimizer-container';
            container.style.cssText = `
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
            `;

            // 基础按钮样式
            const baseButtonStyle = `
                padding: 0 16px;
                background: rgba(0,0,0,0.05);
                border: none;
                height: 36px;
                font-size: 14px;
                line-height: 36px;
                border-radius: 18px;
                white-space: nowrap;
                text-transform: none;
                font-family: "Roboto","Arial",sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            `;

            // 左侧按钮组
            const leftGroup = document.createElement('div');
            leftGroup.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // 一键复制名称按钮
            const copyNameBtn = document.createElement('button');
            copyNameBtn.textContent = '一键复制名称';
            copyNameBtn.style.cssText = baseButtonStyle + 'color: #0d7d00;';
            copyNameBtn.onmouseover = () => copyNameBtn.style.background = 'rgba(0,0,0,0.1)';
            copyNameBtn.onmouseout = () => copyNameBtn.style.background = 'rgba(0,0,0,0.05)';
            copyNameBtn.onclick = copyVideoInfo;

            leftGroup.appendChild(copyNameBtn);

            // 右侧按钮组
            const rightGroup = document.createElement('div');
            rightGroup.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // 一键点赞收藏按钮
            const quickSaveBtn = document.createElement('button');
            quickSaveBtn.textContent = '一键点赞收藏';
            quickSaveBtn.style.cssText = baseButtonStyle + 'color: #ff0000;';
            quickSaveBtn.onmouseover = () => quickSaveBtn.style.background = 'rgba(0,0,0,0.1)';
            quickSaveBtn.onmouseout = () => quickSaveBtn.style.background = 'rgba(0,0,0,0.05)';
            quickSaveBtn.onclick = likeAndSaveVideo;

            // 其他按钮
            const otherBtn = document.createElement('button');
            otherBtn.textContent = '其他';
            otherBtn.style.cssText = baseButtonStyle + 'color: #606060;';
            otherBtn.onmouseover = () => otherBtn.style.background = 'rgba(0,0,0,0.1)';
            otherBtn.onmouseout = () => otherBtn.style.background = 'rgba(0,0,0,0.05)';
            otherBtn.onclick = () => alert('功能开发中...');

            // 设置按钮
            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '设置';
            settingsBtn.style.cssText = baseButtonStyle + 'color: #065fd4;';
            settingsBtn.onmouseover = () => settingsBtn.style.background = 'rgba(0,0,0,0.1)';
            settingsBtn.onmouseout = () => settingsBtn.style.background = 'rgba(0,0,0,0.05)';
            settingsBtn.onclick = showSettings;

            rightGroup.appendChild(quickSaveBtn);
            rightGroup.appendChild(otherBtn);
            rightGroup.appendChild(settingsBtn);

            container.appendChild(leftGroup);
            container.appendChild(rightGroup);

            // 插入到 top-row 之后
            topRow.parentNode.insertBefore(container, topRow.nextSibling);
        };

        checkAndInsert();
    }

    // 显示设置对话框
    function showSettings() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建设置对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            min-width: 400px;
        `;

        dialog.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #030303;">一键点赞收藏设置</h2>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #030303; font-weight: bold;">
                    播放列表名称（多个用逗号分隔）:
                </label>
                <input type="text" id="yt-opt-playlists" value="${getPlaylists()}"
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
                <p style="margin: 8px 0 0 0; color: #606060; font-size: 12px;">
                    例如: MMD2,舞蹈,收藏
                </p>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; color: #030303; cursor: pointer;">
                    <input type="checkbox" id="yt-opt-auto-subscribe" ${getAutoSubscribe() ? 'checked' : ''}
                        style="width: 18px; height: 18px; margin-right: 8px; cursor: pointer;">
                    <span style="font-weight: bold;">是否同时订阅该作者</span>
                </label>
                <p style="margin: 8px 0 0 0; padding-left: 26px; color: #606060; font-size: 12px;">
                    启用后，点击"一键点赞收藏"时会自动订阅视频作者
                </p>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; color: #030303; cursor: pointer; opacity: 0.5;">
                    <input type="checkbox" id="yt-opt-auto-close-dialog" ${getAutoCloseDialog() ? 'checked' : ''}
                        style="width: 18px; height: 18px; margin-right: 8px; cursor: pointer;" disabled>
                    <span style="font-weight: bold;">收藏完毕后自动关闭窗口</span>
                </label>
                <p style="margin: 8px 0 0 0; padding-left: 26px; color: #ff6b00; font-size: 12px;">
                    ⚠️ 此选项暂时无效：YouTube 新版 UI 已改为点击后自动关闭窗口
                </p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px;">
                <button id="yt-opt-cancel" style="padding: 10px 20px; background: #f1f1f1; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    取消
                </button>
                <button id="yt-opt-save" style="padding: 10px 20px; background: #065fd4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
                    保存
                </button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('yt-opt-cancel').onclick = () => overlay.remove();
        document.getElementById('yt-opt-save').onclick = () => {
            const playlists = document.getElementById('yt-opt-playlists').value.trim();
            const autoSubscribe = document.getElementById('yt-opt-auto-subscribe').checked;
            const autoCloseDialog = document.getElementById('yt-opt-auto-close-dialog').checked;
            savePlaylists(playlists);
            saveAutoSubscribe(autoSubscribe);
            saveAutoCloseDialog(autoCloseDialog);
            alert('设置已保存！');
            overlay.remove();
        };

        // 点击遮罩层关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };
    }

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // 按S键触发一键点赞收藏
        if (e.key === 's' || e.key === 'S') {
            // 排除在输入框中按S的情况
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            
            // 只在没有修饰键的情况下触发（排除 Ctrl+S, Cmd+S, Alt+S, Shift+S）
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
                return;
            }
            
            e.preventDefault();
            likeAndSaveVideo();
        }
    });

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    }

    init();
})();
