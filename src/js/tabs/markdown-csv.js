function initMarkdownCsv() {
    const container = document.getElementById('tab-content');
    container.innerHTML = `
        <div class="tool-section">
            <h2>Markdown ⇔ CSV 変換</h2>
            
            <div class="conversion-direction">
                <label>
                    <input type="radio" name="conversion-type" value="csv-to-markdown" checked>
                    CSV → Markdown表
                </label>
                <label>
                    <input type="radio" name="conversion-type" value="markdown-to-csv">
                    Markdown表 → CSV
                </label>
            </div>

            <div id="csv-to-markdown-section">
                <h3>CSV → Markdown表</h3>
                <div class="input-section">
                    <label for="csv-input">CSV データ:</label>
                    <textarea id="csv-input" placeholder="名前,年齢,職業
田中,30,エンジニア
佐藤,25,デザイナー

または

名前	年齢	職業
田中	30	エンジニア
佐藤	25	デザイナー">名前,年齢,職業
田中,30,エンジニア
佐藤,25,デザイナー</textarea>
                </div>
                
                <div class="options-section">
                    <h4>オプション:</h4>
                    <label>
                        <input type="checkbox" id="has-header" checked>
                        最初の行をヘッダーとして扱う
                    </label>
                    <label>
                        <input type="checkbox" id="auto-detect-delimiter" checked>
                        区切り文字を自動検出
                    </label>
                    <div id="manual-delimiter" style="display: none;">
                        <label for="delimiter-select">区切り文字:</label>
                        <select id="delimiter-select">
                            <option value=",">カンマ (,)</option>
                            <option value="\t">タブ</option>
                            <option value=";">セミコロン (;)</option>
                            <option value="|">パイプ (|)</option>
                        </select>
                    </div>
                </div>

                <button id="convert-csv-to-markdown" class="convert-btn">変換</button>
                
                <div class="output-section">
                    <label for="markdown-output">Markdown表:</label>
                    <textarea id="markdown-output" readonly></textarea>
                    <button id="copy-markdown-output" class="copy-btn">コピー</button>
                </div>
            </div>

            <div id="markdown-to-csv-section" style="display: none;">
                <h3>Markdown表 → CSV</h3>
                <div class="input-section">
                    <label for="markdown-input">Markdown表:</label>
                    <textarea id="markdown-input" placeholder="| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 30 | エンジニア |
| 佐藤 | 25 | デザイナー |">| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 30 | エンジニア |
| 佐藤 | 25 | デザイナー |</textarea>
                </div>
                
                <div class="options-section">
                    <h4>出力オプション:</h4>
                    <label for="output-delimiter-select">区切り文字:</label>
                    <select id="output-delimiter-select">
                        <option value=",">カンマ (,)</option>
                        <option value="\t">タブ</option>
                        <option value=";">セミコロン (;)</option>
                        <option value="|">パイプ (|)</option>
                    </select>
                    <label>
                        <input type="checkbox" id="include-header-in-csv" checked>
                        ヘッダー行を含める
                    </label>
                </div>

                <button id="convert-markdown-to-csv" class="convert-btn">変換</button>
                
                <div class="output-section">
                    <label for="csv-output">CSV データ:</label>
                    <textarea id="csv-output" readonly></textarea>
                    <button id="copy-csv-output" class="copy-btn">コピー</button>
                </div>
            </div>
        </div>
    `;

    // ラジオボタンのイベントリスナー
    document.querySelectorAll('input[name="conversion-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const csvToMarkdownSection = document.getElementById('csv-to-markdown-section');
            const markdownToCsvSection = document.getElementById('markdown-to-csv-section');
            
            if (this.value === 'csv-to-markdown') {
                csvToMarkdownSection.style.display = 'block';
                markdownToCsvSection.style.display = 'none';
            } else {
                csvToMarkdownSection.style.display = 'none';
                markdownToCsvSection.style.display = 'block';
            }
        });
    });

    // 自動検出チェックボックスのイベントリスナー
    document.getElementById('auto-detect-delimiter').addEventListener('change', function() {
        const manualDelimiter = document.getElementById('manual-delimiter');
        manualDelimiter.style.display = this.checked ? 'none' : 'block';
    });

    // 変換ボタンのイベントリスナー
    document.getElementById('convert-csv-to-markdown').addEventListener('click', convertCsvToMarkdown);
    document.getElementById('convert-markdown-to-csv').addEventListener('click', convertMarkdownToCsv);
    
    // コピーボタンのイベントリスナー
    document.getElementById('copy-markdown-output').addEventListener('click', function() {
        copyToClipboard('markdown-output');
    });
    document.getElementById('copy-csv-output').addEventListener('click', function() {
        copyToClipboard('csv-output');
    });
}

function detectDelimiter(text) {
    const delimiters = [',', '\t', ';', '|'];
    const lines = text.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return ',';
    
    let bestDelimiter = ',';
    let maxConsistency = 0;
    
    for (const delimiter of delimiters) {
        const columnCounts = lines.map(line => line.split(delimiter).length);
        
        // 各行の列数が一致しているかチェック
        const firstColumnCount = columnCounts[0];
        const consistency = columnCounts.filter(count => count === firstColumnCount).length / columnCounts.length;
        
        if (consistency > maxConsistency && firstColumnCount > 1) {
            maxConsistency = consistency;
            bestDelimiter = delimiter;
        }
    }
    
    return bestDelimiter;
}

function parseCsv(text, delimiter, hasHeader) {
    const lines = text.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const parseRow = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    };
    
    const headers = hasHeader ? parseRow(lines[0]) : [];
    const rows = hasHeader ? lines.slice(1).map(parseRow) : lines.map(parseRow);
    
    return { headers, rows };
}

function convertCsvToMarkdown() {
    const csvInput = document.getElementById('csv-input').value;
    const hasHeader = document.getElementById('has-header').checked;
    const autoDetect = document.getElementById('auto-detect-delimiter').checked;
    
    if (!csvInput.trim()) {
        alert('CSV データを入力してください。');
        return;
    }
    
    let delimiter;
    if (autoDetect) {
        delimiter = detectDelimiter(csvInput);
    } else {
        delimiter = document.getElementById('delimiter-select').value;
    }
    
    try {
        const { headers, rows } = parseCsv(csvInput, delimiter, hasHeader);
        
        if (rows.length === 0) {
            alert('有効なデータが見つかりません。');
            return;
        }
        
        let markdown = '';
        
        // ヘッダー行
        if (hasHeader && headers.length > 0) {
            markdown += '| ' + headers.join(' | ') + ' |\n';
            markdown += '|' + headers.map(() => '------').join('|') + '|\n';
        } else if (rows.length > 0) {
            // ヘッダーがない場合は最初の行から列数を決定
            const columnCount = rows[0].length;
            const defaultHeaders = Array.from({ length: columnCount }, (_, i) => `列${i + 1}`);
            markdown += '| ' + defaultHeaders.join(' | ') + ' |\n';
            markdown += '|' + defaultHeaders.map(() => '------').join('|') + '|\n';
        }
        
        // データ行
        rows.forEach(row => {
            markdown += '| ' + row.join(' | ') + ' |\n';
        });
        
        document.getElementById('markdown-output').value = markdown;
    } catch (error) {
        alert('変換エラー: ' + error.message);
    }
}

function parseMarkdownTable(markdown) {
    const lines = markdown.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('有効なMarkdown表が見つかりません。');
    }
    
    const parseMarkdownRow = (line) => {
        return line.split('|')
            .map(cell => cell.trim())
            .filter((cell, index, array) => index !== 0 && index !== array.length - 1); // 最初と最後の空要素を除去
    };
    
    const headers = parseMarkdownRow(lines[0]);
    
    // セパレーター行をスキップ
    let dataStartIndex = 1;
    if (lines[1].includes('---') || lines[1].includes('===')) {
        dataStartIndex = 2;
    }
    
    const rows = lines.slice(dataStartIndex).map(parseMarkdownRow);
    
    return { headers, rows };
}

function convertMarkdownToCsv() {
    const markdownInput = document.getElementById('markdown-input').value;
    const outputDelimiter = document.getElementById('output-delimiter-select').value;
    const includeHeader = document.getElementById('include-header-in-csv').checked;
    
    if (!markdownInput.trim()) {
        alert('Markdown表を入力してください。');
        return;
    }
    
    try {
        const { headers, rows } = parseMarkdownTable(markdownInput);
        
        let csv = '';
        
        // ヘッダー行
        if (includeHeader && headers.length > 0) {
            csv += headers.map(cell => escapeCSVCell(cell, outputDelimiter)).join(outputDelimiter) + '\n';
        }
        
        // データ行
        rows.forEach(row => {
            csv += row.map(cell => escapeCSVCell(cell, outputDelimiter)).join(outputDelimiter) + '\n';
        });
        
        document.getElementById('csv-output').value = csv;
    } catch (error) {
        alert('変換エラー: ' + error.message);
    }
}

function escapeCSVCell(cell, delimiter) {
    // セルにデリミタ、改行、ダブルクォートが含まれている場合はダブルクォートで囲む
    if (cell.includes(delimiter) || cell.includes('\n') || cell.includes('"')) {
        return '"' + cell.replace(/"/g, '""') + '"';
    }
    return cell;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        
        // コピー成功の視覚的フィードバック
        const copyBtn = element.nextElementSibling;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'コピーしました！';
        copyBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    } catch (err) {
        alert('コピーに失敗しました。手動でコピーしてください。');
    }
}