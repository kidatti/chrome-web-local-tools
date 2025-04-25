// エンコード/デコードタブの機能
document.addEventListener('DOMContentLoaded', function() {
  // エンコード/デコード機能
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const encodingType = document.getElementById('encoding-type');
  const encodeButton = document.getElementById('encode-button');
  const decodeButton = document.getElementById('decode-button');
  const copyEncodingButton = document.getElementById('copy-encoding');
  
  encodeButton.addEventListener('click', () => {
    const text = inputText.value;
    const type = encodingType.value;
    
    if (!text) {
      outputText.value = '入力テキストを入力してください';
      return;
    }
    
    try {
      switch (type) {
        case 'url':
          outputText.value = encodeURIComponent(text);
          break;
        case 'base64':
          outputText.value = btoa(unescape(encodeURIComponent(text)));
          break;
        case 'html':
          outputText.value = escapeHTML(text);
          break;
      }
    } catch (error) {
      outputText.value = `エラー: ${error.message}`;
    }
  });
  
  decodeButton.addEventListener('click', () => {
    const text = inputText.value;
    const type = encodingType.value;
    
    if (!text) {
      outputText.value = '入力テキストを入力してください';
      return;
    }
    
    try {
      switch (type) {
        case 'url':
          outputText.value = decodeURIComponent(text);
          break;
        case 'base64':
          outputText.value = decodeURIComponent(escape(atob(text)));
          break;
        case 'html':
          outputText.value = unescapeHTML(text);
          break;
      }
    } catch (error) {
      outputText.value = `エラー: ${error.message}`;
    }
  });
  
  // HTML特殊文字のエスケープ/アンエスケープ
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function unescapeHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
  }
  
  copyEncodingButton.addEventListener('click', () => {
    copyToClipboard(outputText.value);
  });
});
