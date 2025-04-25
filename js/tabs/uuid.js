// UUID生成タブの機能
document.addEventListener('DOMContentLoaded', function() {
  // UUID生成機能
  const uuidVersion = document.getElementById('uuid-version');
  const uuidFormat = document.getElementById('uuid-format');
  const uuidCount = document.getElementById('uuid-count');
  const generateUuidButton = document.getElementById('generate-uuid');
  const uuidResult = document.getElementById('uuid-result');
  const copyUuidButton = document.getElementById('copy-uuid');
  
  generateUuidButton.addEventListener('click', () => {
    const version = uuidVersion.value;
    const format = uuidFormat.value;
    const count = parseInt(uuidCount.value) || 1;
    
    let uuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1();
      
      // フォーマット適用
      switch (format) {
        case 'no-dash':
          uuid = uuid.replace(/-/g, '');
          break;
        case 'braces':
          uuid = `{${uuid}}`;
          break;
      }
      
      uuids.push(uuid);
    }
    
    uuidResult.value = uuids.join('\n');
  });
  
  // UUIDv4生成（ランダム）
  function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // UUIDv1生成（タイムベース）
  function generateUUIDv1() {
    const now = new Date();
    const timestamp = now.getTime();
    
    // タイムスタンプを16進数に変換して使用
    const timeHex = timestamp.toString(16).padStart(12, '0');
    
    // ノード部分はランダムに生成
    const node = Math.random().toString(16).slice(2, 14).padStart(12, '0');
    
    // UUIDv1形式に組み立て
    const uuid = `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(12, 15)}-${Math.floor(Math.random() * 4 + 8).toString(16)}${Math.random().toString(16).slice(2, 5)}-${node}`;
    
    return uuid;
  }
  
  copyUuidButton.addEventListener('click', () => {
    copyToClipboard(uuidResult.value);
  });
});
