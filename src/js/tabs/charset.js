// 文字コード変換タブの機能
document.addEventListener('DOMContentLoaded', function() {
  // 文字コード変換機能
  const charsetInput = document.getElementById('charset-input');
  const charsetFrom = document.getElementById('charset-from');
  const charsetTo = document.getElementById('charset-to');
  const convertCharsetButton = document.getElementById('convert-charset');
  const charsetOutput = document.getElementById('charset-output');
  const charsetHex = document.getElementById('charset-hex');
  const copyCharsetButton = document.getElementById('copy-charset');
  
  // 文字コード変換
  convertCharsetButton.addEventListener('click', async () => {
    const text = charsetInput.value;
    const fromCharset = charsetFrom.value;
    const toCharset = charsetTo.value;
    
    if (!text) {
      charsetOutput.value = '入力テキストを入力してください';
      charsetHex.value = '';
      return;
    }
    
    try {
      // 文字コード変換はbackground.jsで行う
      chrome.runtime.sendMessage(
        { 
          action: 'convertCharset', 
          data: { 
            text: text, 
            fromCharset: fromCharset, 
            toCharset: toCharset 
          } 
        },
        response => {
          if (response && response.success) {
            // 成功時
            charsetOutput.value = response.data.text;
            
            // 16進数表示
            const bytes = response.data.bytes;
            let hexString = '';
            for (let i = 0; i < bytes.length; i++) {
              hexString += bytes[i].toString(16).padStart(2, '0') + ' ';
              if ((i + 1) % 16 === 0) {
                hexString += '\n';
              }
            }
            charsetHex.value = hexString;
          } else {
            // エラー時
            charsetOutput.value = `エラー: ${response ? response.error : '不明なエラー'}`;
            charsetHex.value = '';
          }
        }
      );
    } catch (error) {
      charsetOutput.value = `エラー: ${error.message}`;
      charsetHex.value = '';
    }
  });
  
  copyCharsetButton.addEventListener('click', () => {
    copyToClipboard(charsetOutput.value);
  });
});
