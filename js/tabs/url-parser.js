// URLパーサータブの機能
document.addEventListener('DOMContentLoaded', function() {
  // URLパーサー機能
  const urlInput = document.getElementById('url-input');
  const parseUrlButton = document.getElementById('parse-url');
  const urlProtocol = document.getElementById('url-protocol');
  const urlHostname = document.getElementById('url-hostname');
  const urlPort = document.getElementById('url-port');
  const urlPathname = document.getElementById('url-pathname');
  const urlHash = document.getElementById('url-hash');
  const urlParams = document.getElementById('url-params');
  const decodedUrl = document.getElementById('decoded-url');
  const copyDecodedUrlButton = document.getElementById('copy-decoded-url');
  
  parseUrlButton.addEventListener('click', () => {
    const url = urlInput.value;
    
    if (!url) {
      urlParams.innerHTML = 'URLを入力してください';
      return;
    }
    
    try {
      // URLをパース
      const parsedUrl = new URL(url);
      
      // URL構成要素を表示
      // プロトコルからコロンを削除
      urlProtocol.value = parsedUrl.protocol.replace(/[:]/g, '');
      urlHostname.value = parsedUrl.hostname;
      urlPort.value = parsedUrl.port || '(デフォルト)';
      urlPathname.value = parsedUrl.pathname;
      urlHash.value = parsedUrl.hash;
      
      // クエリパラメータを解析
      const params = new URLSearchParams(parsedUrl.search);
      let paramsHtml = '';
      
      if (params.toString()) {
        paramsHtml += '<div class="params-table">';
        for (const [key, value] of params.entries()) {
          paramsHtml += `
            <div class="param-row">
              <div class="param-name">${escapeHTML(key)}</div>
              <div class="param-value">${escapeHTML(value)}</div>
            </div>
          `;
        }
        paramsHtml += '</div>';
      } else {
        paramsHtml = '<div>クエリパラメータはありません</div>';
      }
      
      urlParams.innerHTML = paramsHtml;
      
      // デコード済みURLを表示
      decodedUrl.value = decodeURIComponent(url);
    } catch (error) {
      urlProtocol.value = '';
      urlHostname.value = '';
      urlPort.value = '';
      urlPathname.value = '';
      urlHash.value = '';
      urlParams.innerHTML = `エラー: ${error.message}`;
      decodedUrl.value = '';
    }
  });
  
  copyDecodedUrlButton.addEventListener('click', () => {
    copyToClipboard(decodedUrl.value);
  });
  
  // HTML特殊文字のエスケープ
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
