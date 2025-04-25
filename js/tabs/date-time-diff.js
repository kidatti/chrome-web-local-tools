/**
 * 日時比較機能
 */
function initDateTimeDiffTab() {
  const contentElement = document.getElementById('datetime-diff-content');
   if (!contentElement) {
    console.error('Date Time Diff content element not found');
    return;
  }
  // タブのHTMLを設定
  contentElement.innerHTML = `
    <h2>日時比較</h2>
    
    <div class="section">
      <h3>比較する日時</h3>
      <div class="form-group">
        <label for="date1">日時1:</label>
        <input type="datetime-local" id="date1">
      </div>
      
      <div class="form-group">
        <label for="date2">日時2:</label>
        <input type="datetime-local" id="date2">
      </div>
      
      <button id="calculate-diff">差を計算</button>
    </div>
    
    <div class="section">
      <h3>計算結果</h3>
      <div class="form-group">
        <label>差 (ミリ秒):</label>
        <input type="text" id="diff-milliseconds" readonly>
      </div>
      
      <div class="form-group">
        <label>差 (秒):</label>
        <input type="text" id="diff-seconds" readonly>
      </div>
      
      <div class="form-group">
        <label>差 (分):</label>
        <input type="text" id="diff-minutes" readonly>
      </div>
      
      <div class="form-group">
        <label>差 (時間):</label>
        <input type="text" id="diff-hours" readonly>
      </div>
      
      <div class="form-group">
        <label>差 (日):</label>
        <input type="text" id="diff-days" readonly>
      </div>
      
      <div class="form-group">
        <label>差 (詳細):</label>
        <input type="text" id="diff-detailed" readonly>
      </div>
      
      <button id="copy-diff-milliseconds" class="copy-button">ミリ秒をコピー</button>
      <button id="copy-diff-detailed" class="copy-button">詳細をコピー</button>
    </div>
  `;
  
  // 要素の取得
  const date1Input = document.getElementById('date1');
  const date2Input = document.getElementById('date2');
  const calculateDiffButton = document.getElementById('calculate-diff');
  
  const diffMilliseconds = document.getElementById('diff-milliseconds');
  const diffSeconds = document.getElementById('diff-seconds');
  const diffMinutes = document.getElementById('diff-minutes');
  const diffHours = document.getElementById('diff-hours');
  const diffDays = document.getElementById('diff-days');
  const diffDetailed = document.getElementById('diff-detailed');
  
  const copyDiffMillisecondsButton = document.getElementById('copy-diff-milliseconds');
  const copyDiffDetailedButton = document.getElementById('copy-diff-detailed');
  
  // 現在の日時を設定
  function setCurrentDateTime(inputElement) {
    const now = new Date();
    // ローカルタイムゾーンのオフセットを考慮
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    inputElement.value = localISOTime;
  }
  
  // 初期表示時に現在の日時を設定
  setCurrentDateTime(date1Input);
  setCurrentDateTime(date2Input);
  
  // 差を計算する関数
  function calculateDifference() {
    const date1Value = date1Input.value;
    const date2Value = date2Input.value;
    
    if (!date1Value || !date2Value) {
      alert('両方の日時を入力してください');
      return;
    }
    
    try {
      const date1 = new Date(date1Value);
      const date2 = new Date(date2Value);
      
      // 差をミリ秒で計算
      const diffMs = Math.abs(date1.getTime() - date2.getTime());
      
      // 各単位での差を計算
      const diffSec = diffMs / 1000;
      const diffMin = diffSec / 60;
      const diffHr = diffMin / 60;
      const diffDay = diffHr / 24;
      
      // 詳細な差を計算
      let remainingMs = diffMs;
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      remainingMs %= (1000 * 60 * 60 * 24);
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      remainingMs %= (1000 * 60 * 60);
      const minutes = Math.floor(remainingMs / (1000 * 60));
      remainingMs %= (1000 * 60);
      const seconds = Math.floor(remainingMs / 1000);
      remainingMs %= 1000;
      
      const detailedString = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 ${remainingMs}ミリ秒`;
      
      // 結果を表示
      diffMilliseconds.value = diffMs;
      diffSeconds.value = diffSec.toFixed(3);
      diffMinutes.value = diffMin.toFixed(3);
      diffHours.value = diffHr.toFixed(3);
      diffDays.value = diffDay.toFixed(3);
      diffDetailed.value = detailedString;
      
    } catch (error) {
      alert(`エラー: ${error.message}`);
    }
  }
  
  // 計算ボタンのイベント
  calculateDiffButton.addEventListener('click', calculateDifference);
  
  // コピーボタンのイベント
  copyDiffMillisecondsButton.addEventListener('click', () => {
    copyToClipboard(diffMilliseconds.value);
  });
  
  copyDiffDetailedButton.addEventListener('click', () => {
    copyToClipboard(diffDetailed.value);
  });
}

// DOMContentLoaded時に初期化を実行
document.addEventListener('DOMContentLoaded', initDateTimeDiffTab);
