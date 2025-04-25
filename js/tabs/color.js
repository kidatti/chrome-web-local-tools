// カラーコード変換タブの機能
document.addEventListener('DOMContentLoaded', function() {
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
});
