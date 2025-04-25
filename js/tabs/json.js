// JSONパースタブの機能
document.addEventListener('DOMContentLoaded', function() {
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
  
  copyJsonButton.addEventListener('click', () => {
    copyToClipboard(jsonOutput.value);
  });
});
