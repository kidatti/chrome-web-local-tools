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

// クリップボードへのコピー
function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}
