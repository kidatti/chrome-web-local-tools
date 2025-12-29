// JWTデコード/エンコードタブの機能
document.addEventListener('DOMContentLoaded', function() {
  // タブ切り替え機能
  const jwtTabButtons = document.querySelectorAll('[data-jwt-tab]');
  const jwtDecodeTab = document.getElementById('jwt-decode-tab');
  const jwtEncodeTab = document.getElementById('jwt-encode-tab');

  jwtTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-jwt-tab');

      // すべてのタブボタンから active クラスを削除
      jwtTabButtons.forEach(btn => btn.classList.remove('active'));
      // クリックされたボタンに active クラスを追加
      button.classList.add('active');

      // すべてのタブコンテンツを非表示
      jwtDecodeTab.classList.remove('active');
      jwtEncodeTab.classList.remove('active');

      // 選択されたタブを表示
      if (targetTab === 'decode') {
        jwtDecodeTab.classList.add('active');
      } else if (targetTab === 'encode') {
        jwtEncodeTab.classList.add('active');
      }
    });
  });

  // JWT機能
  const jwtInput = document.getElementById('jwt-input');
  const jwtDecodeButton = document.getElementById('jwt-decode');
  const jwtHeaderOutput = document.getElementById('jwt-header-output');
  const jwtPayloadOutput = document.getElementById('jwt-payload-output');
  const jwtSignatureOutput = document.getElementById('jwt-signature-output');
  const jwtInfoOutput = document.getElementById('jwt-info-output');
  const copyJwtHeaderButton = document.getElementById('copy-jwt-header');
  const copyJwtPayloadButton = document.getElementById('copy-jwt-payload');

  // 署名検証用
  const jwtVerifySecret = document.getElementById('jwt-verify-secret');
  const jwtVerifyButton = document.getElementById('jwt-verify');
  const jwtVerifyResult = document.getElementById('jwt-verify-result');

  // エンコード用
  const jwtTypInput = document.getElementById('jwt-typ-input');
  const jwtAlgorithm = document.getElementById('jwt-algorithm');
  const jwtPayloadInput = document.getElementById('jwt-payload-input');
  const jwtSecretInput = document.getElementById('jwt-secret-input');
  const jwtEncodeButton = document.getElementById('jwt-encode');
  const jwtEncodedOutput = document.getElementById('jwt-encoded-output');
  const copyJwtEncodedButton = document.getElementById('copy-jwt-encoded');

  // Base64URL デコード
  function base64UrlDecode(str) {
    // Base64URL を Base64 に変換
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // パディングを追加
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    try {
      // Base64デコード後、UTF-8として解釈
      return decodeURIComponent(escape(atob(base64)));
    } catch (e) {
      throw new Error('Base64URLデコードに失敗しました');
    }
  }

  // Base64URL エンコード
  function base64UrlEncode(str) {
    try {
      // UTF-8エンコード後、Base64エンコード
      const base64 = btoa(unescape(encodeURIComponent(str)));
      // Base64 を Base64URL に変換（パディング削除、文字置換）
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (e) {
      throw new Error('Base64URLエンコードに失敗しました');
    }
  }

  // JWTデコード
  jwtDecodeButton.addEventListener('click', () => {
    const token = jwtInput.value.trim();

    if (!token) {
      jwtHeaderOutput.value = 'JWTトークンを入力してください';
      jwtPayloadOutput.value = '';
      jwtSignatureOutput.value = '';
      jwtInfoOutput.value = '';
      return;
    }

    try {
      // JWTを3つのパートに分割
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('無効なJWT形式です。JWTは3つのパート（header.payload.signature）で構成されている必要があります。');
      }

      // ヘッダーとペイロードをデコード
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      // 結果を整形して表示
      jwtHeaderOutput.value = JSON.stringify(header, null, 2);
      jwtPayloadOutput.value = JSON.stringify(payload, null, 2);
      jwtSignatureOutput.value = signature;

      // ペイロード情報の解析
      let info = [];

      // 発行者
      if (payload.iss) {
        info.push(`発行者 (iss): ${payload.iss}`);
      }

      // サブジェクト
      if (payload.sub) {
        info.push(`サブジェクト (sub): ${payload.sub}`);
      }

      // オーディエンス
      if (payload.aud) {
        info.push(`オーディエンス (aud): ${payload.aud}`);
      }

      // 発行時刻
      if (payload.iat) {
        const iatDate = new Date(payload.iat * 1000);
        info.push(`発行時刻 (iat): ${iatDate.toLocaleString('ja-JP')} (${payload.iat})`);
      }

      // 有効期限
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expDate < now;
        info.push(`有効期限 (exp): ${expDate.toLocaleString('ja-JP')} (${payload.exp}) ${isExpired ? '【期限切れ】' : '【有効】'}`);
      }

      // Not Before
      if (payload.nbf) {
        const nbfDate = new Date(payload.nbf * 1000);
        info.push(`Not Before (nbf): ${nbfDate.toLocaleString('ja-JP')} (${payload.nbf})`);
      }

      // JWT ID
      if (payload.jti) {
        info.push(`JWT ID (jti): ${payload.jti}`);
      }

      // アルゴリズム
      if (header.alg) {
        info.push(`\nアルゴリズム: ${header.alg}`);
      }

      // トークンタイプ
      if (header.typ) {
        info.push(`トークンタイプ: ${header.typ}`);
      }

      jwtInfoOutput.value = info.length > 0 ? info.join('\n') : 'ペイロード情報を解析できませんでした';

    } catch (error) {
      jwtHeaderOutput.value = `エラー: ${error.message}`;
      jwtPayloadOutput.value = '';
      jwtSignatureOutput.value = '';
      jwtInfoOutput.value = '';
    }
  });

  // JWTエンコード
  jwtEncodeButton.addEventListener('click', async () => {
    const typ = jwtTypInput.value.trim() || 'JWT';
    const algorithm = jwtAlgorithm.value;
    const payloadText = jwtPayloadInput.value.trim();
    const secret = jwtSecretInput.value;

    if (!payloadText) {
      jwtEncodedOutput.value = 'ペイロードを入力してください';
      return;
    }

    try {
      // ペイロードをJSONとしてパース
      const payload = JSON.parse(payloadText);

      // ヘッダーを自動生成
      const header = {
        alg: algorithm,
        typ: typ
      };

      // Base64URLエンコード
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(payload));

      let signature = '';

      if (algorithm === 'none' || !secret) {
        // 署名なし
        signature = '';
      } else {
        // 署名を生成
        const message = `${encodedHeader}.${encodedPayload}`;

        if (algorithm.startsWith('HS')) {
          // HMAC署名
          const encoder = new TextEncoder();
          const keyData = encoder.encode(secret);
          const messageData = encoder.encode(message);

          let hashAlgorithm;
          switch (algorithm) {
            case 'HS256':
              hashAlgorithm = 'SHA-256';
              break;
            case 'HS384':
              hashAlgorithm = 'SHA-384';
              break;
            case 'HS512':
              hashAlgorithm = 'SHA-512';
              break;
            default:
              throw new Error(`サポートされていないアルゴリズム: ${algorithm}`);
          }

          // Web Crypto APIを使用して署名
          const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: hashAlgorithm },
            false,
            ['sign']
          );

          const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            messageData
          );

          // ArrayBufferをBase64URLに変換
          const signatureArray = Array.from(new Uint8Array(signatureBuffer));
          const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
          signature = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        } else {
          throw new Error(`${algorithm}アルゴリズムは現在サポートされていません。HS256, HS384, HS512, またはnoneを使用してください。`);
        }
      }

      // JWTを組み立て
      const jwt = signature ?
        `${encodedHeader}.${encodedPayload}.${signature}` :
        `${encodedHeader}.${encodedPayload}.`;

      jwtEncodedOutput.value = jwt;

    } catch (error) {
      jwtEncodedOutput.value = `エラー: ${error.message}`;
    }
  });

  // コピーボタン
  copyJwtHeaderButton.addEventListener('click', (e) => {
    copyToClipboard(jwtHeaderOutput.value, e.currentTarget);
  });

  copyJwtPayloadButton.addEventListener('click', (e) => {
    copyToClipboard(jwtPayloadOutput.value, e.currentTarget);
  });

  copyJwtEncodedButton.addEventListener('click', (e) => {
    copyToClipboard(jwtEncodedOutput.value, e.currentTarget);
  });

  // 署名検証
  jwtVerifyButton.addEventListener('click', async () => {
    const token = jwtInput.value.trim();
    const secret = jwtVerifySecret.value;

    if (!token) {
      jwtVerifyResult.value = 'JWTトークンを入力してください';
      return;
    }

    if (!secret) {
      jwtVerifyResult.value = 'シークレットキーを入力してください';
      return;
    }

    try {
      // JWTを3つのパートに分割
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('無効なJWT形式です');
      }

      const encodedHeader = parts[0];
      const encodedPayload = parts[1];
      const originalSignature = parts[2];

      // ヘッダーをデコードしてアルゴリズムを取得
      const header = JSON.parse(base64UrlDecode(encodedHeader));
      const algorithm = header.alg;

      if (algorithm === 'none') {
        jwtVerifyResult.value = '署名なし（none）のトークンです。検証は不要です。';
        return;
      }

      if (!algorithm.startsWith('HS')) {
        jwtVerifyResult.value = `${algorithm}アルゴリズムはサポートされていません。\n現在サポートされているのは HS256, HS384, HS512 のみです。`;
        return;
      }

      // 署名を再生成
      const message = `${encodedHeader}.${encodedPayload}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      let hashAlgorithm;
      switch (algorithm) {
        case 'HS256':
          hashAlgorithm = 'SHA-256';
          break;
        case 'HS384':
          hashAlgorithm = 'SHA-384';
          break;
        case 'HS512':
          hashAlgorithm = 'SHA-512';
          break;
        default:
          throw new Error(`サポートされていないアルゴリズム: ${algorithm}`);
      }

      // Web Crypto APIを使用して署名生成
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: hashAlgorithm },
        false,
        ['sign']
      );

      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        messageData
      );

      // ArrayBufferをBase64URLに変換
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
      const calculatedSignature = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      // 署名を比較
      if (calculatedSignature === originalSignature) {
        jwtVerifyResult.value = '✓ 署名は有効です\n\n署名の検証に成功しました。このJWTは改ざんされていません。';
      } else {
        jwtVerifyResult.value = '✗ 署名は無効です\n\n署名の検証に失敗しました。\n- シークレットキーが間違っている\n- トークンが改ざんされている\nのいずれかの可能性があります。';
      }

    } catch (error) {
      jwtVerifyResult.value = `エラー: ${error.message}`;
    }
  });
});
