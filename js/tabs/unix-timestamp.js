/**
 * UNIXタイムスタンプ変換機能
 */
function initUnixTimestampTab() {
  const contentElement = document.getElementById('datetime-content');
  if (!contentElement) {
    console.error('UNIX Timestamp content element not found');
    return;
  }
  // タブのHTMLを設定
  contentElement.innerHTML = `
    <h2>UNIXタイムスタンプ</h2>
    
    <div class="section">
      <h3>現在のタイムスタンプ</h3>
      <div class="form-group">
        <label>現在のUNIXタイムスタンプ (秒):</label>
        <div class="input-with-button">
          <input type="text" id="current-timestamp-seconds" readonly>
          <button id="copy-timestamp-seconds" class="copy-button">コピー</button>
        </div>
      </div>
      
      <div class="form-group">
        <label>現在のUNIXタイムスタンプ (ミリ秒):</label>
        <div class="input-with-button">
          <input type="text" id="current-timestamp-milliseconds" readonly>
          <button id="copy-timestamp-milliseconds" class="copy-button">コピー</button>
        </div>
      </div>
      
      <button id="refresh-timestamp">更新</button>
    </div>
    
    <div class="section">
      <h3>タイムスタンプ → 日時</h3>
      <div class="form-group">
        <label for="timestamp-input">UNIXタイムスタンプ入力:</label>
        <input type="text" id="timestamp-input" placeholder="UNIXタイムスタンプを入力してください">
      </div>
      
      <div class="form-group">
        <label for="timestamp-unit">単位:</label>
        <select id="timestamp-unit">
          <option value="seconds">秒</option>
          <option value="milliseconds">ミリ秒</option>
        </select>
      </div>
      
      <button id="convert-timestamp">変換</button>
      
      <div class="form-group">
        <label for="timestamp-result">日時結果:</label>
        <input type="text" id="timestamp-result" readonly>
      </div>
      
      <div class="form-group">
        <label for="timestamp-iso">ISO 8601形式:</label>
        <input type="text" id="timestamp-iso" readonly>
      </div>
      
      <div class="form-group">
        <label for="timestamp-locale">ローカル形式:</label>
        <input type="text" id="timestamp-locale" readonly>
      </div>
      
      <button id="copy-timestamp-result" class="copy-button">結果をコピー</button>
    </div>
    
    <div class="section">
      <h3>日時 → タイムスタンプ</h3>
      <div class="form-group">
        <label for="date-input">日付入力:</label>
        <input type="date" id="date-input">
      </div>
      
      <div class="form-group">
        <label for="time-input">時間入力:</label>
        <input type="time" id="time-input" step="1">
      </div>
      
      <button id="convert-date">変換</button>
      
      <div class="form-group">
        <label for="date-timestamp-seconds">UNIXタイムスタンプ (秒):</label>
        <div class="input-with-button">
          <input type="text" id="date-timestamp-seconds" readonly>
          <button id="copy-date-timestamp-seconds" class="copy-button">コピー</button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="date-timestamp-milliseconds">UNIXタイムスタンプ (ミリ秒):</label>
        <div class="input-with-button">
          <input type="text" id="date-timestamp-milliseconds" readonly>
          <button id="copy-date-timestamp-milliseconds" class="copy-button">コピー</button>
        </div>
      </div>
    </div>
  `;
  
  // 要素の取得
  const currentTimestampSeconds = document.getElementById('current-timestamp-seconds');
  const currentTimestampMilliseconds = document.getElementById('current-timestamp-milliseconds');
  const refreshTimestampButton = document.getElementById('refresh-timestamp');
  const copyTimestampSecondsButton = document.getElementById('copy-timestamp-seconds');
  const copyTimestampMillisecondsButton = document.getElementById('copy-timestamp-milliseconds');
  
  const timestampInput = document.getElementById('timestamp-input');
  const timestampUnit = document.getElementById('timestamp-unit');
  const convertTimestampButton = document.getElementById('convert-timestamp');
  const timestampResult = document.getElementById('timestamp-result');
  const timestampIso = document.getElementById('timestamp-iso');
  const timestampLocale = document.getElementById('timestamp-locale');
  const copyTimestampResultButton = document.getElementById('copy-timestamp-result');
  
  const dateInput = document.getElementById('date-input');
  const timeInput = document.getElementById('time-input');
  const convertDateButton = document.getElementById('convert-date');
  const dateTimestampSeconds = document.getElementById('date-timestamp-seconds');
  const dateTimestampMilliseconds = document.getElementById('date-timestamp-milliseconds');
  const copyDateTimestampSecondsButton = document.getElementById('copy-date-timestamp-seconds');
  const copyDateTimestampMillisecondsButton = document.getElementById('copy-date-timestamp-milliseconds');
  
  // 現在のタイムスタンプを更新
  function updateCurrentTimestamp() {
    const now = new Date();
    currentTimestampSeconds.value = Math.floor(now.getTime() / 1000);
    currentTimestampMilliseconds.value = now.getTime();
  }
  
  // 初期表示時に現在のタイムスタンプを設定
  updateCurrentTimestamp();
  
  // 更新ボタンのイベント
  refreshTimestampButton.addEventListener('click', updateCurrentTimestamp);
  
  // タイムスタンプから日時への変換
  convertTimestampButton.addEventListener('click', () => {
    const timestamp = timestampInput.value.trim();
    const unit = timestampUnit.value;
    
    if (!timestamp) {
      alert('タイムスタンプを入力してください');
      return;
    }
    
    try {
      // 数値に変換
      const timestampValue = parseInt(timestamp, 10);
      if (isNaN(timestampValue)) {
        throw new Error('無効なタイムスタンプです');
      }
      
      // 単位に応じて日時オブジェクトを作成
      const date = new Date(unit === 'seconds' ? timestampValue * 1000 : timestampValue);
      
      // 結果を表示
      timestampResult.value = date.toString();
      timestampIso.value = date.toISOString();
      timestampLocale.value = date.toLocaleString();
    } catch (error) {
      alert(`エラー: ${error.message}`);
    }
  });
  
  // 日時からタイムスタンプへの変換
  convertDateButton.addEventListener('click', () => {
    const dateValue = dateInput.value;
    const timeValue = timeInput.value || '00:00:00';
    
    if (!dateValue) {
      alert('日付を入力してください');
      return;
    }
    
    try {
      // 日時文字列を作成
      const dateTimeString = `${dateValue}T${timeValue}`;
      
      // 日時オブジェクトを作成
      const date = new Date(dateTimeString);
      
      // タイムスタンプを計算
      const timestampMilliseconds = date.getTime();
      const timestampSeconds = Math.floor(timestampMilliseconds / 1000);
      
      // 結果を表示
      dateTimestampSeconds.value = timestampSeconds;
      dateTimestampMilliseconds.value = timestampMilliseconds;
    } catch (error) {
      alert(`エラー: ${error.message}`);
    }
  });
  
  // コピーボタンのイベント
  copyTimestampSecondsButton.addEventListener('click', () => {
    copyToClipboard(currentTimestampSeconds.value);
  });
  
  copyTimestampMillisecondsButton.addEventListener('click', () => {
    copyToClipboard(currentTimestampMilliseconds.value);
  });
  
  copyTimestampResultButton.addEventListener('click', () => {
    copyToClipboard(timestampResult.value);
  });
  
  copyDateTimestampSecondsButton.addEventListener('click', () => {
    copyToClipboard(dateTimestampSeconds.value);
  });
  
  copyDateTimestampMillisecondsButton.addEventListener('click', () => {
    copyToClipboard(dateTimestampMilliseconds.value);
  });
  
  // 現在の日時を設定
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');
  
  dateInput.value = `${year}-${month}-${day}`;
  timeInput.value = `${hours}:${minutes}:${seconds}`;
}

// DOMContentLoaded時に初期化を実行
document.addEventListener('DOMContentLoaded', initUnixTimestampTab);
