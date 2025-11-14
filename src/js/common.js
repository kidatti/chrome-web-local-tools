// クリップボードにコピーする関数
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    // コピー成功時の処理
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'コピーしました！';

      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    }
  }).catch(err => {
    console.error('クリップボードへのコピーに失敗しました', err);
    alert('クリップボードへのコピーに失敗しました');
  });
}

// 開発者モード判定とバナー表示
function checkDevMode() {
  const devBanner = document.querySelector('.dev-banner');
  if (!devBanner) return;

  // chrome.runtime.getManifest()で拡張機能のマニフェストを取得
  // update_urlが存在しない場合は開発者モードと判定
  // Chrome Web Storeからインストールされた拡張機能にはupdate_urlが自動的に追加される
  const manifest = chrome.runtime.getManifest();
  const isDevelopment = !manifest.update_url;

  if (isDevelopment) {
    devBanner.style.display = 'block';
  } else {
    devBanner.style.display = 'none';
  }
}

// DOMが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', function() {
  // 開発者モードチェック
  checkDevMode();

  // メニュー切り替え機能
  const menuItems = document.querySelectorAll('.menu-item');
  const contents = document.querySelectorAll('.content');
  
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // アクティブなメニューを非アクティブにする
      menuItems.forEach(mi => mi.classList.remove('active'));
      contents.forEach(content => content.classList.remove('active'));
      
      // クリックされたメニューをアクティブにする
      item.classList.add('active');
      const contentId = `${item.dataset.content}-content`;
      document.getElementById(contentId).classList.add('active');
      
      // 特定のコンテンツの初期化関数を呼び出し
      if (item.dataset.content === 'markdown-csv') {
        initMarkdownCsv();
      }
    });
  });
});
