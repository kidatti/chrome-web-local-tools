// HEX/Binary変換タブの機能
document.addEventListener('DOMContentLoaded', function() {
  // HEX/Binary変換機能
  const stringInput = document.getElementById('string-input');
  const stringToHexButton = document.getElementById('string-to-hex');
  const stringToBinaryButton = document.getElementById('string-to-binary');
  const hexResult = document.getElementById('hex-result');
  const binaryResult = document.getElementById('binary-result');
  const copyHexButton = document.getElementById('copy-hex');
  const copyBinaryButton = document.getElementById('copy-binary');
  
  const hexInput = document.getElementById('hex-input');
  const binaryInput = document.getElementById('binary-input');
  const hexToStringButton = document.getElementById('hex-to-string');
  const binaryToStringButton = document.getElementById('binary-to-string');
  const stringResult = document.getElementById('string-result');
  const copyStringButton = document.getElementById('copy-string');
  
  // 文字列→HEX変換
  stringToHexButton.addEventListener('click', () => {
    const text = stringInput.value;
    
    if (!text) {
      hexResult.value = '文字列を入力してください';
      return;
    }
    
    try {
      // 文字列をUTF-8エンコードしてArrayBufferに変換
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // ArrayBufferを16進数文字列に変換
      const hexArray = Array.from(data);
      const hexString = hexArray.map(b => b.toString(16).padStart(2, '0')).join(' ');
      
      hexResult.value = hexString;
    } catch (error) {
      hexResult.value = `エラー: ${error.message}`;
    }
  });
  
  // 文字列→Binary変換
  stringToBinaryButton.addEventListener('click', () => {
    const text = stringInput.value;
    
    if (!text) {
      binaryResult.value = '文字列を入力してください';
      return;
    }
    
    try {
      // 文字列をUTF-8エンコードしてArrayBufferに変換
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // ArrayBufferを2進数文字列に変換
      const binaryArray = Array.from(data);
      const binaryString = binaryArray.map(b => b.toString(2).padStart(8, '0')).join(' ');
      
      binaryResult.value = binaryString;
    } catch (error) {
      binaryResult.value = `エラー: ${error.message}`;
    }
  });
  
  // HEX→文字列変換
  hexToStringButton.addEventListener('click', () => {
    const hex = hexInput.value;
    
    if (!hex) {
      stringResult.value = 'HEXを入力してください';
      return;
    }
    
    try {
      // 16進数文字列をArrayBufferに変換
      const hexArray = hex.trim().split(/\s+/);
      const data = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
      
      // ArrayBufferを文字列に変換
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(data);
      
      stringResult.value = text;
    } catch (error) {
      stringResult.value = `エラー: ${error.message}`;
    }
  });
  
  // Binary→文字列変換
  binaryToStringButton.addEventListener('click', () => {
    const binary = binaryInput.value;
    
    if (!binary) {
      stringResult.value = 'Binaryを入力してください';
      return;
    }
    
    try {
      // 2進数文字列をArrayBufferに変換
      const binaryArray = binary.trim().split(/\s+/);
      const data = new Uint8Array(binaryArray.map(b => parseInt(b, 2)));
      
      // ArrayBufferを文字列に変換
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(data);
      
      stringResult.value = text;
    } catch (error) {
      stringResult.value = `エラー: ${error.message}`;
    }
  });
  
  copyHexButton.addEventListener('click', () => {
    copyToClipboard(hexResult.value);
  });
  
  copyBinaryButton.addEventListener('click', () => {
    copyToClipboard(binaryResult.value);
  });
  
  copyStringButton.addEventListener('click', () => {
    copyToClipboard(stringResult.value);
  });
});
