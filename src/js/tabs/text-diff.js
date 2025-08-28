// Text Diffタブの機能
document.addEventListener('DOMContentLoaded', function() {
  // Text Diff機能
  const textLeft = document.getElementById('text-left');
  const textRight = document.getElementById('text-right');
  const diffResult = document.getElementById('diff-result');
  const diffButton = document.getElementById('diff-execute');
  const copyDiffButton = document.getElementById('copy-diff');

  // 差分計算を実行するメイン関数
  function calculateDiff() {
    const leftText = textLeft.value;
    const rightText = textRight.value;
    
    if (!leftText && !rightText) {
      diffResult.innerHTML = '<p class="diff-message">テキストを入力してください</p>';
      return;
    }

    // 行単位で分割
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    
    // 差分を計算
    const diff = computeDiff(leftLines, rightLines);
    
    // 結果をHTMLで表示
    displayDiff(diff);
  }

  // シンプルなdiffアルゴリズム（LCS based）
  function computeDiff(leftLines, rightLines) {
    const leftLen = leftLines.length;
    const rightLen = rightLines.length;
    
    // LCS計算用のテーブル
    const lcs = Array(leftLen + 1).fill().map(() => Array(rightLen + 1).fill(0));
    
    // LCSを計算
    for (let i = 1; i <= leftLen; i++) {
      for (let j = 1; j <= rightLen; j++) {
        if (leftLines[i - 1] === rightLines[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }

    // 差分を逆算して構築
    const diff = [];
    let i = leftLen, j = rightLen;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
        diff.unshift({ type: 'equal', left: i - 1, right: j - 1, text: leftLines[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        diff.unshift({ type: 'added', right: j - 1, text: rightLines[j - 1] });
        j--;
      } else if (i > 0) {
        diff.unshift({ type: 'removed', left: i - 1, text: leftLines[i - 1] });
        i--;
      }
    }
    
    return diff;
  }

  // 差分結果をHTMLで表示
  function displayDiff(diff) {
    let html = '<div class="diff-container">';
    let leftLineNum = 1;
    let rightLineNum = 1;
    
    for (const item of diff) {
      switch (item.type) {
        case 'equal':
          html += `<div class="diff-line diff-equal">
            <span class="line-number left-line-num">${leftLineNum}</span>
            <span class="line-number right-line-num">${rightLineNum}</span>
            <span class="diff-content">${escapeHtml(item.text)}</span>
          </div>`;
          leftLineNum++;
          rightLineNum++;
          break;
          
        case 'removed':
          html += `<div class="diff-line diff-removed">
            <span class="line-number left-line-num">${leftLineNum}</span>
            <span class="line-number right-line-num">-</span>
            <span class="diff-content">- ${escapeHtml(item.text)}</span>
          </div>`;
          leftLineNum++;
          break;
          
        case 'added':
          html += `<div class="diff-line diff-added">
            <span class="line-number left-line-num">-</span>
            <span class="line-number right-line-num">${rightLineNum}</span>
            <span class="diff-content">+ ${escapeHtml(item.text)}</span>
          </div>`;
          rightLineNum++;
          break;
      }
    }
    
    html += '</div>';
    diffResult.innerHTML = html;
  }

  // HTMLエスケープ関数
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 差分結果をプレーンテキストとして取得
  function getDiffAsText() {
    const leftText = textLeft ? textLeft.value : '';
    const rightText = textRight ? textRight.value : '';
    
    if (!leftText && !rightText) {
      return '差分結果がありません';
    }

    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const diff = computeDiff(leftLines, rightLines);
    
    let result = '';
    for (const item of diff) {
      switch (item.type) {
        case 'equal':
          result += `  ${item.text}\n`;
          break;
        case 'removed':
          result += `- ${item.text}\n`;
          break;
        case 'added':
          result += `+ ${item.text}\n`;
          break;
      }
    }
    
    return result.trim();
  }

  // イベントリスナー
  if (diffButton) {
    diffButton.addEventListener('click', calculateDiff);
  }

  if (copyDiffButton) {
    copyDiffButton.addEventListener('click', (event) => {
      const diffText = getDiffAsText();
      if (diffText && diffText !== '差分結果がありません') {
        navigator.clipboard.writeText(diffText).then(() => {
          const originalText = event.target.textContent;
          event.target.textContent = 'コピーしました！';
          
          setTimeout(() => {
            event.target.textContent = originalText;
          }, 1500);
        }).catch(err => {
          console.error('クリップボードへのコピーに失敗しました', err);
          alert('コピーに失敗しました');
        });
      } else {
        alert('差分結果がありません');
      }
    });
  }

  // リアルタイム差分計算（オプション）
  let diffTimeout;
  function scheduleUpdate() {
    clearTimeout(diffTimeout);
    diffTimeout = setTimeout(calculateDiff, 500);
  }

  if (textLeft) {
    textLeft.addEventListener('input', scheduleUpdate);
  }
  
  if (textRight) {
    textRight.addEventListener('input', scheduleUpdate);
  }
});