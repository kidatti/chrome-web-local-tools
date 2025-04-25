// クリップボードにコピーする関数
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // コピー成功時の処理
    const originalText = event.target.textContent;
    event.target.textContent = 'コピーしました！';
    
    setTimeout(() => {
      event.target.textContent = originalText;
    }, 1500);
  }).catch(err => {
    console.error('クリップボードへのコピーに失敗しました', err);
  });
}

// DOMが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', function() {
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
    });
  });
});
