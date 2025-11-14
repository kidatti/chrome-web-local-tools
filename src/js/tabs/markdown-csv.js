function initMarkdownCsv() {
    const container = document.getElementById('tab-content');
    container.innerHTML = `
        <div class="tool-section">
            <h2>Markdown ⇔ CSV/TSV 変換</h2>

            <div class="conversion-direction" style="display: flex; gap: 20px; margin-bottom: 30px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 16px; font-weight: 500;">
                    <input type="radio" name="conversion-type" value="csv-to-markdown" checked style="width: auto; margin: 0;">
                    CSV/TSV → Markdown表
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 16px; font-weight: 500;">
                    <input type="radio" name="conversion-type" value="markdown-to-csv" style="width: auto; margin: 0;">
                    Markdown表 → CSV/TSV
                </label>
            </div>

            <div id="csv-to-markdown-section">
                <h3>CSV/TSV → Markdown表</h3>
                <div class="input-section" style="margin-bottom: 20px;">
                    <label for="csv-input" style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 16px;">CSV/TSV データ:</label>
                    <textarea id="csv-input" placeholder="例) CSV形式:
名前,年齢,職業
田中,30,エンジニア
佐藤,25,デザイナー

例) TSV形式:
名前	年齢	職業
田中	30	エンジニア
佐藤	25	デザイナー" style="min-height: 200px; font-family: monospace; font-size: 14px;">名前,年齢,職業
田中,30,エンジニア
佐藤,25,デザイナー</textarea>
                </div>
                
                <div class="options-section" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; margin-bottom: 15px; color: #2c3e50;">オプション</h4>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="has-header" checked style="width: auto; margin: 0;">
                            最初の行をヘッダーとして扱う
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="auto-detect-delimiter" checked style="width: auto; margin: 0;">
                            区切り文字を自動検出
                        </label>
                        <div id="manual-delimiter" style="display: none; margin-left: 26px; margin-top: 8px;">
                            <label for="delimiter-select" style="display: block; margin-bottom: 8px;">区切り文字:</label>
                            <select id="delimiter-select" style="padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                                <option value=",">カンマ (,) - CSV</option>
                                <option value="\t">タブ - TSV</option>
                                <option value=";">セミコロン (;)</option>
                                <option value="|">パイプ (|)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button id="convert-csv-to-markdown" class="convert-btn">変換</button>
                
                <div class="output-section" style="margin-top: 20px;">
                    <label for="markdown-output" style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 16px;">Markdown表:</label>
                    <textarea id="markdown-output" readonly style="min-height: 200px; font-family: monospace; font-size: 14px; background-color: #f8f9fa;"></textarea>
                    <button id="copy-markdown-output" class="copy-btn">結果をコピー</button>
                </div>
            </div>

            <div id="markdown-to-csv-section" style="display: none;">
                <h3>Markdown表 → CSV/TSV</h3>
                <div class="input-section" style="margin-bottom: 20px;">
                    <label for="markdown-input" style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 16px;">Markdown表:</label>
                    <textarea id="markdown-input" placeholder="例)
| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 30 | エンジニア |
| 佐藤 | 25 | デザイナー |" style="min-height: 200px; font-family: monospace; font-size: 14px;">| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 30 | エンジニア |
| 佐藤 | 25 | デザイナー |</textarea>
                </div>
                
                <div class="options-section" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; margin-bottom: 15px; color: #2c3e50;">出力オプション</h4>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <label for="output-delimiter-select" style="display: block; margin-bottom: 8px; font-weight: 500;">区切り文字:</label>
                            <select id="output-delimiter-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                                <option value=",">カンマ (,) - CSV形式</option>
                                <option value="\t">タブ - TSV形式</option>
                                <option value=";">セミコロン (;)</option>
                                <option value="|">パイプ (|)</option>
                            </select>
                        </div>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="include-header-in-csv" checked style="width: auto; margin: 0;">
                            ヘッダー行を含める
                        </label>
                    </div>
                </div>

                <button id="convert-markdown-to-csv" class="convert-btn">変換</button>

                <div class="output-section" style="margin-top: 20px;">
                    <label for="csv-output" style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 16px;">CSV/TSV データ:</label>
                    <textarea id="csv-output" readonly style="min-height: 200px; font-family: monospace; font-size: 14px; background-color: #f8f9fa;"></textarea>
                    <button id="copy-csv-output" class="copy-btn">結果をコピー</button>
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
    document.getElementById('copy-markdown-output').addEventListener('click', function(e) {
        const element = document.getElementById('markdown-output');
        copyToClipboard(element.value, e.currentTarget);
    });
    document.getElementById('copy-csv-output').addEventListener('click', function(e) {
        const element = document.getElementById('csv-output');
        copyToClipboard(element.value, e.currentTarget);
    });
}

function detectDelimiter(text) {
    // タブ、カンマ、セミコロン、パイプの順に優先度を付ける
    const delimiters = ['\t', ',', ';', '|'];
    const lines = text.trim().split('\n').filter(line => line.trim());

    if (lines.length < 2) return ',';

    let bestDelimiter = ',';
    let maxScore = 0;

    const parseRowForDetection = (line, delimiter) => {
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
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result.length;
    };

    for (const delimiter of delimiters) {
        const columnCounts = lines.map(line => parseRowForDetection(line, delimiter));

        // 各行の列数が一致しているかチェック
        const firstColumnCount = columnCounts[0];
        const consistency = columnCounts.filter(count => count === firstColumnCount).length / columnCounts.length;

        // スコアは一貫性 + 優先度ボーナス
        // タブ区切りの場合は優先度を高くする（+0.1のボーナス）
        let score = consistency;
        if (delimiter === '\t' && consistency >= 0.8) {
            score += 0.15; // タブの場合は高い優先度
        } else if (delimiter === ',' && consistency >= 0.8) {
            score += 0.1; // カンマも一般的なので優先
        }

        if (score > maxScore && firstColumnCount > 1) {
            maxScore = score;
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
        alert('CSV/TSV データを入力してください。');
        return;
    }
    
    let delimiter;
    if (autoDetect) {
        delimiter = detectDelimiter(csvInput);
    } else {
        delimiter = document.getElementById('delimiter-select').value;
        // エスケープシーケンスを実際の文字に変換
        if (delimiter === '\\t') {
            delimiter = '\t';
        }
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
    let outputDelimiter = document.getElementById('output-delimiter-select').value;
    const includeHeader = document.getElementById('include-header-in-csv').checked;

    // エスケープシーケンスを実際の文字に変換
    if (outputDelimiter === '\\t') {
        outputDelimiter = '\t';
    }

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

// このファイルではcommon.jsのcopyToClipboard関数を使用します