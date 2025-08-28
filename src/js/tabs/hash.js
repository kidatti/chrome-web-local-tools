/**
 * ハッシュ生成機能
 */
function initHashTab() {
  const contentElement = document.getElementById('hash-content');
  if (!contentElement) {
    console.error('Hash content element not found');
    return;
  }
  // タブのHTMLを設定
  contentElement.innerHTML = `
    <h2>ハッシュ生成</h2>
    
    <div class="form-group">
      <label for="hash-input">入力テキスト:</label>
      <textarea id="hash-input" rows="10" placeholder="ハッシュ化したいテキストを入力してください"></textarea>
    </div>
    
    <div class="form-group">
      <label for="hash-algorithm">アルゴリズム:</label>
      <select id="hash-algorithm">
        <option value="SHA-1">SHA-1</option>
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-384">SHA-384</option>
        <option value="SHA-512">SHA-512</option>
      </select>
    </div>
    
    <button id="generate-hash">ハッシュ生成</button>
    
    <div class="form-group">
      <label for="hash-result">ハッシュ結果 (Hex):</label>
      <textarea id="hash-result" rows="5" readonly></textarea>
    </div>
    
    <button id="copy-hash" class="copy-button">結果をコピー</button>
  `;
  
  // 要素の取得
  const hashInput = document.getElementById('hash-input');
  const hashAlgorithm = document.getElementById('hash-algorithm');
  const generateHashButton = document.getElementById('generate-hash');
  const hashResult = document.getElementById('hash-result');
  const copyHashButton = document.getElementById('copy-hash');
  
  // ハッシュ生成ボタンのイベント
  generateHashButton.addEventListener('click', async () => {
    const text = hashInput.value;
    const algorithm = hashAlgorithm.value;
    
    if (!text) {
      alert('入力テキストを入力してください');
      return;
    }
    
    try {
      // テキストをUTF-8エンコード
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Web Crypto APIを使用してハッシュを計算
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      
      // ArrayBufferを16進数文字列に変換
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // 結果を表示
      hashResult.value = hashHex;
      
    } catch (error) {
      alert(`ハッシュ生成エラー: ${error.message}`);
    }
  });
  
  // コピーボタンのイベント
  copyHashButton.addEventListener('click', () => {
    copyToClipboard(hashResult.value);
  });
}

// DOMContentLoaded時に初期化を実行
document.addEventListener('DOMContentLoaded', initHashTab);
