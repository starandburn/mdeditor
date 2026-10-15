// 要素の取得
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const editorWrapper = document.getElementById('editor-wrapper');
const whitespaceOverlay = document.getElementById('whitespace-overlay');
const showWhitespace = document.getElementById('showWhitespace');
const syncScroll = document.getElementById('syncScroll');
const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
const clearMarkdownBtn = document.getElementById('clearMarkdownBtn');
const filenameInput = document.getElementById('filename');
const downloadBtn = document.getElementById('downloadBtn');
const loadBtn = document.getElementById('loadBtn');

// カスタムレンダラーの作成
const renderer = new marked.Renderer();

// コードブロックのレンダリングをカスタマイズ
renderer.code = function(code, language) {
    // シンタックスハイライトを適用
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(validLanguage, code).value;

    // コードブロックのHTMLを返す
    return `<pre><code class="hljs ${validLanguage}">${highlighted}</code></pre>`;
};

// プレビューの更新
function updatePreview() {
    const rawMarkdown = editor.value;
    updateWhitespaceOverlay();
    const htmlContent = marked(rawMarkdown, {
        renderer: renderer,
        breaks: false, // CommonMark準拠の改行処理
        gfm: true
    });
    preview.innerHTML = htmlContent;

    // MathJaxで数式をレンダリング
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([preview]).then(() => {
            // 数式のレンダリングが完了した後の処理が必要ならここに記述
        }).catch((err) => console.error('MathJaxレンダリングエラー:', err));
    }
}

// エディタの入力イベント
editor.addEventListener('input', updatePreview);

copyMarkdownBtn.addEventListener('click', async function() {
    if (!editor.value) {
        alert('コピーするMarkdownの内容がありません。');
        return;
    }

    try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            throw new Error('Clipboard API is unavailable');
        }

        await navigator.clipboard.writeText(editor.value);
        const originalLabel = copyMarkdownBtn.textContent;
        copyMarkdownBtn.textContent = 'コピー済み';
        setTimeout(function() {
            copyMarkdownBtn.textContent = originalLabel;
        }, 1500);
    } catch (error) {
        alert('Markdownのコピーに失敗しました。');
    }
});

clearMarkdownBtn.addEventListener('click', function() {
    if (!confirm('Markdownの内容をすべて削除しますか？')) return;

    editor.focus();
    editor.setSelectionRange(0, editor.value.length);
    const cleared = document.execCommand('insertText', false, '');

    if (!cleared) {
        editor.value = '';
        editor.dispatchEvent(new Event('input', {bubbles: true}));
    }

    editor.setSelectionRange(0, 0);
    editor.scrollTop = 0;
    editor.scrollLeft = 0;
    preview.scrollTop = 0;
    preview.scrollLeft = 0;
    whitespaceOverlay.scrollTop = 0;
    whitespaceOverlay.scrollLeft = 0;
});

// 空白文字可視化の表示を更新（入力値自体は変更しない）
function escapeOverlayText(text) {
    return Array.from(text, function(char) {
        if (char === ' ') return '<span class="whitespace-space"> </span>';
        if (char === '　') return '<span class="whitespace-wide-space">　</span>';
        return char
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }).join('');
}

function updateWhitespaceOverlay() {
    if (!showWhitespace.checked) return;
    whitespaceOverlay.textContent = '';
    whitespaceOverlay.innerHTML = escapeOverlayText(editor.value);
    syncWhitespaceScroll();
}

showWhitespace.addEventListener('change', function() {
    editorWrapper.classList.toggle('whitespace-visible', showWhitespace.checked);
    updateWhitespaceOverlay();
});

editor.addEventListener('input', updateWhitespaceOverlay);

// Markdown入力欄ではTabを半角スペース4個の入力として扱う
editor.addEventListener('keydown', function(event) {
    if (
        event.key !== 'Tab' ||
        event.isComposing ||
        editorWrapper.classList.contains('ime-composing')
    ) {
        return;
    }

    if (event.shiftKey) {
        event.preventDefault();

        const value = editor.value;
        const selectionStart = editor.selectionStart;
        const selectionEnd = editor.selectionEnd;
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        let spacesToRemove = 0;

        while (
            spacesToRemove < 4 &&
            value.charAt(lineStart + spacesToRemove) === ' '
        ) {
            spacesToRemove++;
        }

        if (spacesToRemove === 0) return;

        const removalEnd = lineStart + spacesToRemove;
        const adjustedStart = Math.max(lineStart, selectionStart - spacesToRemove);
        const adjustedEnd = Math.max(lineStart, selectionEnd - spacesToRemove);

        editor.focus();
        editor.setSelectionRange(lineStart, removalEnd);
        const removed = document.execCommand('insertText', false, '');

        if (!removed) {
            editor.setRangeText('', lineStart, removalEnd, 'end');
            editor.dispatchEvent(new Event('input', {bubbles: true}));
        }

        editor.setSelectionRange(adjustedStart, adjustedEnd);
        return;
    }

    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.focus();

    // execCommandはtextareaの標準Undo履歴へ登録されるため、まずこちらを試す
    const inserted = document.execCommand('insertText', false, '    ');
    if (!inserted) {
        // 対応しない環境でも入力文字を失わないためのフォールバック。
        // この場合、ブラウザー標準のUndo登録は保証されない。
        editor.setRangeText('    ', start, end, 'end');
        editor.dispatchEvent(new Event('input', {bubbles: true}));
    }
});

function syncWhitespaceScroll() {
    if (!showWhitespace.checked) return;

    whitespaceOverlay.scrollTop = editor.scrollTop;
    whitespaceOverlay.scrollLeft = editor.scrollLeft;
}

let scrollSyncSource = null;

function syncScrollPosition(source, target) {
    if (!syncScroll.checked) return;
    if (scrollSyncSource === source) {
        scrollSyncSource = null;
        return;
    }

    const sourceMax = Math.max(0, source.scrollHeight - source.clientHeight);
    const targetMax = Math.max(0, target.scrollHeight - target.clientHeight);
    const ratio = sourceMax > 0 ? source.scrollTop / sourceMax : 0;
    const targetScrollTop = Math.min(targetMax, Math.max(0, ratio * targetMax));

    if (Math.abs(target.scrollTop - targetScrollTop) < 1) return;

    scrollSyncSource = target;
    target.scrollTop = targetScrollTop;
}

editor.addEventListener('scroll', function() {
    syncWhitespaceScroll();
    syncScrollPosition(editor, preview);
});

preview.addEventListener('scroll', function() {
    syncScrollPosition(preview, editor);
});

syncScroll.addEventListener('change', function() {
    if (syncScroll.checked) syncScrollPosition(editor, preview);
});

editor.addEventListener('compositionstart', function() {
    editorWrapper.classList.add('ime-composing');
});

editor.addEventListener('compositionend', function() {
    editorWrapper.classList.remove('ime-composing');
    updateWhitespaceOverlay();
});

// ページ離脱時の警告
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

function downloadAsMarkdown(fileName) {
    let mdFileName = fileName;
    if (!/\.md$/i.test(mdFileName)) {
        mdFileName += '.md';
    }
    const text = editor.value;
    const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = mdFileName;
    a.click();
}

// ダウンロードボタンのイベント（Markdown形式で直接保存）
downloadBtn.addEventListener('click', function() {
    let fileName = filenameInput.value.trim() || 'document';
    fileName = fileName.replace(/[/\\?%*:|"<>]/g, '');
    fileName = fileName.trim() || 'document';
    downloadAsMarkdown(fileName);
});

// Ctrl + S ショートカットキーの設定
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        downloadBtn.click();
    }
});

// ファイルの読み込み機能
function loadMarkdown(event) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md, .markdown, .txt';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            filenameInput.value = file.name.replace(/\.[^/.]+$/, "");
            const reader = new FileReader();
            reader.onload = function(e) {
                editor.value = e.target.result;
                updatePreview();
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
}

// ファイルを開くボタンのイベント
loadBtn.addEventListener('click', loadMarkdown);

// 初期プレビューの表示
editorWrapper.classList.toggle('whitespace-visible', showWhitespace.checked);
updatePreview();
