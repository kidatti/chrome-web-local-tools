/**
 * ランダム値生成機能
 */
function initRandomTab() {
  const contentElement = document.getElementById('random-content');
  if (!contentElement) {
    console.error('Random content element not found');
    return;
  }
  // タブのHTMLを設定
  contentElement.innerHTML = `
    <h2>ランダム値生成</h2>
    
    <div class="section">
      <h3>ランダム文字列</h3>
      <div class="form-group">
        <label for="random-length">長さ:</label>
        <input type="number" id="random-length" min="1" max="1024" value="16">
      </div>
      
      <div class="form-group">
        <label>使用する文字:</label>
        <div class="checkbox-group">
          <label><input type="checkbox" id="use-uppercase" checked> 大文字 (A-Z)</label>
          <label><input type="checkbox" id="use-lowercase" checked> 小文字 (a-z)</label>
          <label><input type="checkbox" id="use-numbers" checked> 数字 (0-9)</label>
          <label><input type="checkbox" id="use-symbols"> 記号 (!@#$%^&*)</label>
        </div>
      </div>
      
      <button id="generate-random-string">文字列生成</button>
      
      <div class="form-group">
        <label for="random-string-result">生成結果:</label>
        <textarea id="random-string-result" rows="5" readonly></textarea>
      </div>
      
      <button id="copy-random-string" class="copy-button">結果をコピー</button>
    </div>
    
    <div class="section">
      <h3>ランダム数値</h3>
      <div class="form-group">
        <label for="random-min">最小値:</label>
        <input type="number" id="random-min" value="0">
      </div>
      
      <div class="form-group">
        <label for="random-max">最大値:</label>
        <input type="number" id="random-max" value="100">
      </div>
      
      <button id="generate-random-number">数値生成</button>
      
      <div class="form-group">
        <label for="random-number-result">生成結果:</label>
        <input type="text" id="random-number-result" readonly>
      </div>
      
      <button id="copy-random-number" class="copy-button">結果をコピー</button>
    </div>
  `;
  
  // 要素の取得
  const randomLength = document.getElementById('random-length');
  const useUppercase = document.getElementById('use-uppercase');
  const useLowercase = document.getElementById('use-lowercase');
  const useNumbers = document.getElementById('use-numbers');
  const useSymbols = document.getElementById('use-symbols');
  const generateRandomStringButton = document.getElementById('generate-random-string');
  const randomStringResult = document.getElementById('random-string-result');
  const copyRandomStringButton = document.getElementById('copy-random-string');
  
  const randomMin = document.getElementById('random-min');
  const randomMax = document.getElementById('random-max');
  const generateRandomNumberButton = document.getElementById('generate-random-number');
  const randomNumberResult = document.getElementById('random-number-result');
  const copyRandomNumberButton = document.getElementById('copy-random-number');
  
  // ランダム文字列生成
  generateRandomStringButton.addEventListener('click', () => {
    const length = parseInt(randomLength.value);
    if (isNaN(length) || length <= 0) {
      alert('有効な長さを入力してください');
      return;
    }
    
    let charset = '';
    if (useUppercase.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers.checked) charset += '0123456789';
    if (useSymbols.checked) charset += '!@#$%^&*';
    
    if (charset.length === 0) {
      alert('少なくとも1種類の文字を選択してください');
      return;
    }
    
    let result = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    
    randomStringResult.value = result;
  });
  
  // ランダム数値生成
  generateRandomNumberButton.addEventListener('click', () => {
    const min = parseInt(randomMin.value);
    const max = parseInt(randomMax.value);
    
    if (isNaN(min) || isNaN(max)) {
      alert('有効な最小値と最大値を入力してください');
      return;
    }
    
    if (min > max) {
      alert('最小値は最大値以下である必要があります');
      return;
    }
    
    // crypto.getRandomValues() を使用して安全な乱数を生成
    const range = max - min + 1;
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const randomNumber = min + (randomValues[0] % range);
    
    randomNumberResult.value = randomNumber;
  });
  
  // コピーボタンのイベント
  copyRandomStringButton.addEventListener('click', () => {
    copyToClipboard(randomStringResult.value);
  });
  
  copyRandomNumberButton.addEventListener('click', () => {
    copyToClipboard(randomNumberResult.value);
  });
}

// DOMContentLoaded時に初期化を実行
document.addEventListener('DOMContentLoaded', initRandomTab);
