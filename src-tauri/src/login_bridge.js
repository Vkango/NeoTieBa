(function () {
    let lastUrl = '';
    let checkCount = 0;
    const MAX_CHECKS = 600; // 5分钟超时
    let isLogined = false;
    const checkLogin = setInterval(async () => {
        checkCount++;
        const currentUrl = window.location.href;

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
        }

        if (currentUrl.includes('passport.baidu.com/v6/ucenter') || currentUrl.startsWith('https://tieba.baidu.com') || currentUrl.startsWith('http://tieba.baidu.com')) {
            console.log('检测到登录成功！');

            setTimeout(async () => {
                try {
                    if (window.__TAURI_INTERNALS__ && !isLogined) {
                        isLogined = true;
                        await window.__TAURI_INTERNALS__.invoke('handle_browser_login');
                        console.log('登录凭证获取请求已发送');
                        clearInterval(checkLogin);
                    } else {
                        console.error('Tauri API 不可用');
                    }
                } catch (err) {
                    console.error('获取登录凭证失败:', err);
                }
            }, 1000);
        }

        // 超时处理
        if (checkCount > MAX_CHECKS) {
            console.log('登录超时');
            clearInterval(checkLogin);
        }
    }, 500);

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        clearInterval(checkLogin);
    });
})();


