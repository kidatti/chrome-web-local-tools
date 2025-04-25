// encoding.jsを読み込む
importScripts('./encoding/encoding.js');

// 拡張機能のアイコンがクリックされたときの処理
chrome.action.onClicked.addListener(() => {
  // 拡張機能内のindex.htmlを新しいタブで開く
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 文字コード変換処理
  if (request.action === 'convertCharset') {
    // 文字コード変換を実行
    try {
      const result = convertCharset(request.data);
      sendResponse({ success: true, data: result });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    
    // 非同期レスポンスを許可
    return true;
  }
});

// 文字コード変換関数
function convertCharset(data) {
  try {
    const { text, fromCharset, toCharset } = data;
    
    // 入力テキストを処理
    let unicodeArray;
    
    // 入力テキストをUNICODE配列に変換
    if (fromCharset === 'SJIS' || fromCharset === 'EUCJP' || fromCharset === 'JIS') {
      // 日本語文字コードの場合は、encoding.jsを使用してUNICODEに変換
      const textArray = Encoding.stringToCode(text);
      unicodeArray = Encoding.convert(textArray, {
        to: 'UNICODE',
        from: fromCharset
      });
    } else {
      // UTF系の場合は、そのままUNICODEとして扱う
      unicodeArray = Encoding.stringToCode(text);
    }
    
    // 変換処理
    let resultArray;
    let resultText = "";
    
    if (toCharset === 'SJIS' || toCharset === 'EUCJP' || toCharset === 'JIS') {
      // 日本語文字コードへの変換
      resultArray = Encoding.convert(unicodeArray, {
        to: toCharset,
        from: 'UNICODE'
      });
      
      // 日本語文字コードの場合は、テキスト表示用に16進数文字列を生成
      let hexString = '';
      for (let i = 0; i < resultArray.length; i++) {
        hexString += String.fromCharCode(resultArray[i]);
      }
      resultText = hexString;
    } else {
      // UTF系への変換
      if (toCharset === 'UTF-8') {
        // UNICODEからUTF-8に変換
        const encoder = new TextEncoder();
        const bytes = encoder.encode(Encoding.codeToString(unicodeArray));
        resultArray = Array.from(bytes);
        const decoder = new TextDecoder('utf-8');
        resultText = decoder.decode(new Uint8Array(resultArray));
      } else if (toCharset === 'UTF-16') {
        // UNICODEからUTF-16に変換
        const str = Encoding.codeToString(unicodeArray);
        const encoder = new TextEncoder();
        const utf8Bytes = encoder.encode(str);
        const utf16Bytes = new Uint8Array(utf8Bytes.length * 2);
        for (let i = 0; i < utf8Bytes.length; i++) {
          utf16Bytes[i * 2 + 1] = utf8Bytes[i];
          utf16Bytes[i * 2] = 0;
        }
        resultArray = Array.from(utf16Bytes);
        const decoder = new TextDecoder('utf-16');
        resultText = decoder.decode(new Uint8Array(resultArray));
      } else if (toCharset === 'UTF-16BE') {
        // UNICODEからUTF-16BEに変換
        const str = Encoding.codeToString(unicodeArray);
        const encoder = new TextEncoder();
        const utf8Bytes = encoder.encode(str);
        const utf16Bytes = new Uint8Array(utf8Bytes.length * 2);
        for (let i = 0; i < utf8Bytes.length; i++) {
          utf16Bytes[i * 2] = 0;
          utf16Bytes[i * 2 + 1] = utf8Bytes[i];
        }
        resultArray = Array.from(utf16Bytes);
        const decoder = new TextDecoder('utf-16be');
        resultText = decoder.decode(new Uint8Array(resultArray));
      } else if (toCharset === 'UTF-16LE') {
        // UNICODEからUTF-16LEに変換
        const str = Encoding.codeToString(unicodeArray);
        const encoder = new TextEncoder();
        const utf8Bytes = encoder.encode(str);
        const utf16Bytes = new Uint8Array(utf8Bytes.length * 2);
        for (let i = 0; i < utf8Bytes.length; i++) {
          utf16Bytes[i * 2] = utf8Bytes[i];
          utf16Bytes[i * 2 + 1] = 0;
        }
        resultArray = Array.from(utf16Bytes);
        const decoder = new TextDecoder('utf-16le');
        resultText = decoder.decode(new Uint8Array(resultArray));
      }
    }
    
    return {
      text: resultText,
      bytes: resultArray
    };
  } catch (error) {
    throw new Error(`文字コード変換エラー: ${error.message}`);
  }
}

// UIイベント処理
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
  
  // 文字コード変換機能 - エンコード/デコード
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const encodingType = document.getElementById('encoding-type');
  const encodeButton = document.getElementById('encode-button');
  const decodeButton = document.getElementById('decode-button');
  const copyEncodingButton = document.getElementById('copy-encoding');
  
  // 文字コード変換機能 - 文字コード変換
  const charsetInput = document.getElementById('charset-input');
  const charsetFrom = document.getElementById('charset-from');
  const charsetTo = document.getElementById('charset-to');
  const convertCharsetButton = document.getElementById('convert-charset');
  const charsetOutput = document.getElementById('charset-output');
  const charsetHex = document.getElementById('charset-hex');
  const copyCharsetButton = document.getElementById('copy-charset');
  
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
  
  // JSONパース機能
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const jsonAction = document.getElementById('json-action');
  const jsonProcessButton = document.getElementById('json-process');
  const copyJsonButton = document.getElementById('copy-json');
  
  jsonProcessButton.addEventListener('click', () => {
    const text = jsonInput.value;
    const action = jsonAction.value;
    
    if (!text) {
      jsonOutput.value = '入力JSONを入力してください';
      return;
    }
    
    try {
      switch (action) {
        case 'parse':
          // JSON文字列をオブジェクトに変換し、文字列として表示
          const parsedObj = JSON.parse(text);
          jsonOutput.value = typeof parsedObj === 'object' ? 
            'パース成功: オブジェクトに変換されました\n\n' + JSON.stringify(parsedObj, null, 2) :
            'パース成功: ' + parsedObj;
          break;
          
        case 'stringify':
          // 入力をオブジェクトとして評価し、JSON文字列に変換
          let inputObj;
          try {
            // 入力がJSON形式でない場合、JavaScriptオブジェクトとして評価
            inputObj = (text.trim().startsWith('{') || text.trim().startsWith('[')) ? 
              JSON.parse(text) : eval('(' + text + ')');
          } catch (e) {
            // 評価できない場合は文字列として扱う
            inputObj = text;
          }
          jsonOutput.value = JSON.stringify(inputObj);
          break;
          
        case 'format':
          // JSONを整形（インデントを追加）
          const formattedJson = JSON.stringify(JSON.parse(text), null, 2);
          jsonOutput.value = formattedJson;
          break;
          
        case 'minify':
          // JSONを最小化（スペースなし）
          const minifiedJson = JSON.stringify(JSON.parse(text));
          jsonOutput.value = minifiedJson;
          break;
      }
    } catch (error) {
      jsonOutput.value = `エラー: ${error.message}`;
    }
  });
  
  
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
  
  // カラーコード変換機能
  const colorPicker = document.getElementById('color-picker');
  const colorPreview = document.getElementById('color-preview');
  const hexColor = document.getElementById('hex-color');
  const rgbColor = document.getElementById('rgb-color');
  const hslColor = document.getElementById('hsl-color');
  const redSlider = document.getElementById('red-slider');
  const greenSlider = document.getElementById('green-slider');
  const blueSlider = document.getElementById('blue-slider');
  const redValue = document.getElementById('red-value');
  const greenValue = document.getElementById('green-value');
  const blueValue = document.getElementById('blue-value');
  const updateFromHexButton = document.getElementById('update-from-hex');
  const updateFromRgbButton = document.getElementById('update-from-rgb');
  const updateFromHslButton = document.getElementById('update-from-hsl');
  const copyHexColorButton = document.getElementById('copy-hex-color');
  const copyRgbColorButton = document.getElementById('copy-rgb-color');
  const copyHslColorButton = document.getElementById('copy-hsl-color');
  
  // カラーピッカーの変更イベント
  colorPicker.addEventListener('input', () => {
    updateColorFromHex(colorPicker.value);
  });
  
  // HEXからの更新
  updateFromHexButton.addEventListener('click', () => {
    updateColorFromHex(hexColor.value);
  });
  
  // RGBからの更新
  updateFromRgbButton.addEventListener('click', () => {
    updateColorFromRgb(rgbColor.value);
  });
  
  // HSLからの更新
  updateFromHslButton.addEventListener('click', () => {
    updateColorFromHsl(hslColor.value);
  });
  
  // スライダーの変更イベント
  redSlider.addEventListener('input', updateColorFromSliders);
  greenSlider.addEventListener('input', updateColorFromSliders);
  blueSlider.addEventListener('input', updateColorFromSliders);
  
  // HEXから色を更新
  function updateColorFromHex(hex) {
    try {
      // HEXの形式を正規化
      if (!hex.startsWith('#')) {
        hex = '#' + hex;
      }
      
      // 短縮形の場合は展開
      if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      
      // 正規表現でHEXの形式をチェック
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        throw new Error('無効なHEX形式です');
      }
      
      // RGB値を計算
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      
      // 各フォーマットを更新
      updateColorValues(r, g, b);
    } catch (error) {
      console.error('HEXからの更新エラー:', error);
    }
  }
  
  // RGBから色を更新
  function updateColorFromRgb(rgb) {
    try {
      // RGB形式を解析
      const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (!match) {
        throw new Error('無効なRGB形式です');
      }
      
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      // 各フォーマットを更新
      updateColorValues(r, g, b);
    } catch (error) {
      console.error('RGBからの更新エラー:', error);
    }
  }
  
  // HSLから色を更新
  function updateColorFromHsl(hsl) {
    try {
      // HSL形式を解析
      const match = hsl.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
      if (!match) {
        throw new Error('無効なHSL形式です');
      }
      
      const h = parseInt(match[1]);
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      
      // HSLからRGBに変換
      const rgb = hslToRgb(h, s, l);
      
      // 各フォーマットを更新
      updateColorValues(rgb.r, rgb.g, rgb.b);
    } catch (error) {
      console.error('HSLからの更新エラー:', error);
    }
  }
  
  // スライダーから色を更新
  function updateColorFromSliders() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    
    // 各フォーマットを更新
    updateColorValues(r, g, b);
  }
  
  // 色の値を更新
  function updateColorValues(r, g, b) {
    // 値の範囲をチェック
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // HEX形式
    const hex = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
    
    // RGB形式
    const rgb = `rgb(${r}, ${g}, ${b})`;
    
    // HSL形式
    const hsl = rgbToHsl(r, g, b);
    const hslString = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
    
    // 各要素を更新
    colorPicker.value = hex;
    colorPreview.style.backgroundColor = hex;
    hexColor.value = hex;
    rgbColor.value = rgb;
    hslColor.value = hslString;
    
    // スライダーを更新
    redSlider.value = r;
    greenSlider.value = g;
    blueSlider.value = b;
    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;
  }
  
  // RGBからHSLに変換
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // 無彩色
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return { h: h * 360, s: s, l: l };
  }
  
  // HSLからRGBに変換
  function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // 無彩色
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    return { 
      r: Math.round(r * 255), 
      g: Math.round(g * 255), 
      b: Math.round(b * 255) 
    };
  }
  
  // コピーボタン
  copyHexColorButton.addEventListener('click', () => {
    copyToClipboard(hexColor.value);
  });
  
  copyRgbColorButton.addEventListener('click', () => {
    copyToClipboard(rgbColor.value);
  });
  
  copyHslColorButton.addEventListener('click', () => {
    copyToClipboard(hslColor.value);
  });
  
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
      urlProtocol.value = parsedUrl.protocol;
      urlHostname.value = parsedUrl.hostname;
      urlPort.value = parsedUrl.port || '(デフォルト)';
      urlPathname.value = parsedUrl.pathname;
      urlHash.value = parsedUrl.hash;
      
      // クエリパラメータを解析
      const params = new URLSearchParams(parsedUrl.search);
      let paramsHtml = '';
      
      if (params.toString()) {
        for (const [key, value] of params.entries()) {
          paramsHtml
