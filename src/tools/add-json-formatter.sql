-- 添加JSON格式化工具到数据库
INSERT INTO tools (
    name, 
    description, 
    category, 
    required_role, 
    is_active,
    html_code,
    css_code,
    js_code
) VALUES (
    'JSON格式化工具',
    '专业的JSON数据格式化、验证和压缩工具。支持语法高亮、错误定位、数据统计和示例数据。',
    '文本处理',
    'user',
    true,
    -- HTML 代码
    '<div class="container">
    <div class="header">
        <h1>🔧 JSON格式化工具</h1>
        <p>格式化、验证、压缩JSON数据，支持语法高亮和错误定位</p>
    </div>

    <div class="main-content">
        <div class="controls">
            <button class="btn btn-primary" onclick="formatJSON()">
                📐 格式化
            </button>
            <button class="btn btn-secondary" onclick="minifyJSON()">
                📦 压缩
            </button>
            <button class="btn btn-success" onclick="validateJSON()">
                ✓ 验证
            </button>
            <button class="btn btn-warning" onclick="clearAll()">
                🗑️ 清空
            </button>
            <button class="btn btn-secondary" onclick="copyOutput()">
                📋 复制结果
            </button>
        </div>

        <div id="error-container"></div>

        <div class="editor-section">
            <div class="editor-panel">
                <div class="panel-header">
                    输入JSON
                    <span id="input-status" class="status status-empty">等待输入</span>
                </div>
                <textarea 
                    id="input-json" 
                    class="editor" 
                    placeholder="在此粘贴或输入您的JSON数据..."
                    oninput="onInputChange()"
                ></textarea>
            </div>

            <div class="editor-panel">
                <div class="panel-header">
                    格式化结果
                    <span id="output-status" class="status status-empty">等待处理</span>
                </div>
                <div id="output-json" class="output"></div>
            </div>
        </div>

        <div class="info-section">
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">字符数</div>
                    <div id="char-count" class="info-value">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">行数</div>
                    <div id="line-count" class="info-value">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">对象数</div>
                    <div id="object-count" class="info-value">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">数组数</div>
                    <div id="array-count" class="info-value">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label">文件大小</div>
                    <div id="file-size" class="info-value">0 B</div>
                </div>
            </div>
        </div>

        <div class="examples">
            <h3>📚 示例数据</h3>
            <div class="example-buttons">
                <button class="example-btn" onclick="loadExample(''simple'')">简单对象</button>
                <button class="example-btn" onclick="loadExample(''array'')">数组数据</button>
                <button class="example-btn" onclick="loadExample(''nested'')">嵌套结构</button>
                <button class="example-btn" onclick="loadExample(''complex'')">复杂数据</button>
                <button class="example-btn" onclick="loadExample(''invalid'')">错误示例</button>
            </div>
        </div>
    </div>
</div>

<div id="copy-notification" class="copy-success">
    📋 已复制到剪贴板！
</div>',

    -- CSS 代码
    '* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.header {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    padding: 25px 30px;
    text-align: center;
}

.header h1 {
    font-size: 28px;
    margin-bottom: 8px;
}

.header p {
    opacity: 0.9;
    font-size: 16px;
}

.main-content {
    padding: 30px;
}

.controls {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: #4f46e5;
    color: white;
}

.btn-primary:hover {
    background: #4338ca;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
    transform: translateY(-2px);
}

.btn-success {
    background: #10b981;
    color: white;
}

.btn-success:hover {
    background: #059669;
    transform: translateY(-2px);
}

.btn-warning {
    background: #f59e0b;
    color: white;
}

.btn-warning:hover {
    background: #d97706;
    transform: translateY(-2px);
}

.editor-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.editor-panel {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.panel-header {
    background: #f9fafb;
    padding: 15px 20px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header .status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 20px;
    font-weight: 500;
}

.status-valid {
    background: #d1fae5;
    color: #065f46;
}

.status-invalid {
    background: #fee2e2;
    color: #991b1b;
}

.status-empty {
    background: #f3f4f6;
    color: #6b7280;
}

.editor {
    width: 100%;
    height: 400px;
    padding: 20px;
    border: none;
    font-family: ''Monaco'', ''Menlo'', ''Ubuntu Mono'', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    background: #fafafa;
}

.editor:focus {
    background: white;
}

.output {
    background: #f8fafc;
    padding: 20px;
    font-family: ''Monaco'', ''Menlo'', ''Ubuntu Mono'', monospace;
    font-size: 14px;
    line-height: 1.5;
    height: 400px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: ''Monaco'', ''Menlo'', ''Ubuntu Mono'', monospace;
    font-size: 13px;
    line-height: 1.4;
}

.info-section {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.info-item {
    text-align: center;
}

.info-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 5px;
    font-weight: 500;
}

.info-value {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
}

.examples {
    background: #fffbeb;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
}

.examples h3 {
    color: #92400e;
    margin-bottom: 15px;
    font-size: 16px;
}

.example-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.example-btn {
    padding: 8px 16px;
    background: white;
    border: 1px solid #d97706;
    color: #d97706;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;
}

.example-btn:hover {
    background: #d97706;
    color: white;
}

/* JSON语法高亮 */
.json-key {
    color: #0066cc;
    font-weight: 500;
}

.json-string {
    color: #008000;
}

.json-number {
    color: #ff6600;
}

.json-boolean {
    color: #cc0000;
    font-weight: 500;
}

.json-null {
    color: #999999;
    font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .editor-section {
        grid-template-columns: 1fr;
    }
    
    .controls {
        justify-content: center;
    }
    
    .btn {
        flex: 1;
        min-width: 120px;
        justify-content: center;
    }
}

/* 复制成功提示 */
.copy-success {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100px);
    opacity: 0;
    transition: all 0.3s ease;
}

.copy-success.show {
    transform: translateX(0);
    opacity: 1;
}',

    -- JavaScript 代码
    'let jsonStats = {
    charCount: 0,
    lineCount: 0,
    objectCount: 0,
    arrayCount: 0,
    fileSize: 0
};

// 示例数据
const examples = {
    simple: {
        "name": "张三",
        "age": 25,
        "city": "北京",
        "email": "zhangsan@example.com"
    },
    array: [
        {"id": 1, "name": "苹果", "price": 3.5},
        {"id": 2, "name": "香蕉", "price": 2.8},
        {"id": 3, "name": "橙子", "price": 4.2}
    ],
    nested: {
        "user": {
            "id": 1001,
            "profile": {
                "name": "李四",
                "avatar": "https://example.com/avatar.jpg",
                "settings": {
                    "theme": "dark",
                    "notifications": true,
                    "language": "zh-CN"
                }
            },
            "posts": [
                {"title": "第一篇文章", "views": 128},
                {"title": "第二篇文章", "views": 256}
            ]
        }
    },
    complex: {
        "data": {
            "users": [
                {
                    "id": 1,
                    "name": "王五",
                    "tags": ["developer", "javascript", "react"],
                    "metadata": {
                        "lastLogin": "2023-12-01T10:30:00Z",
                        "permissions": ["read", "write", "admin"],
                        "stats": {
                            "projectsCount": 15,
                            "linesOfCode": 45239,
                            "commitsCount": 892
                        }
                    }
                }
            ],
            "config": {
                "version": "1.2.3",
                "features": {
                    "darkMode": true,
                    "autoSave": false,
                    "collaboration": true
                }
            }
        },
        "timestamp": 1701421800000,
        "success": true
    },
    invalid: ''{"name": "测试", "age": 25, "invalid": true,}''
};

// 输入变化处理
function onInputChange() {
    const input = document.getElementById(''input-json'').value;
    updateStats(input);
    updateInputStatus(input);
}

// 更新输入状态
function updateInputStatus(input) {
    const statusEl = document.getElementById(''input-status'');
    
    if (!input.trim()) {
        statusEl.textContent = ''等待输入'';
        statusEl.className = ''status status-empty'';
        return;
    }

    try {
        JSON.parse(input);
        statusEl.textContent = ''格式正确'';
        statusEl.className = ''status status-valid'';
    } catch (error) {
        statusEl.textContent = ''格式错误'';
        statusEl.className = ''status status-invalid'';
    }
}

// 格式化JSON
function formatJSON() {
    const input = document.getElementById(''input-json'').value;
    const outputEl = document.getElementById(''output-json'');
    
    clearError();
    
    if (!input.trim()) {
        showError(''请输入JSON数据'');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        outputEl.innerHTML = highlightJSON(formatted);
        updateOutputStatus(''格式化完成'', ''valid'');
        updateStats(formatted);
    } catch (error) {
        showError(`JSON格式错误: ${error.message}`);
        updateOutputStatus(''格式化失败'', ''invalid'');
    }
}

// 压缩JSON
function minifyJSON() {
    const input = document.getElementById(''input-json'').value;
    const outputEl = document.getElementById(''output-json'');
    
    clearError();
    
    if (!input.trim()) {
        showError(''请输入JSON数据'');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        outputEl.textContent = minified;
        updateOutputStatus(''压缩完成'', ''valid'');
        updateStats(minified);
    } catch (error) {
        showError(`JSON格式错误: ${error.message}`);
        updateOutputStatus(''压缩失败'', ''invalid'');
    }
}

// 验证JSON
function validateJSON() {
    const input = document.getElementById(''input-json'').value;
    
    clearError();
    
    if (!input.trim()) {
        showError(''请输入JSON数据'');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const type = Array.isArray(parsed) ? ''Array'' : typeof parsed;
        showSuccess(`✓ JSON格式正确！数据类型: ${type}`);
        updateOutputStatus(''验证通过'', ''valid'');
    } catch (error) {
        const errorMsg = parseJSONError(error.message);
        showError(`✗ JSON格式错误: ${errorMsg}`);
        updateOutputStatus(''验证失败'', ''invalid'');
    }
}

// 解析JSON错误信息
function parseJSONError(errorMsg) {
    const patterns = [
        { pattern: /Unexpected token (.*) in JSON at position (\\d+)/, 
          replacement: ''位置 $2 处发现意外的字符 "$1"'' },
        { pattern: /Expected property name or ''}'' in JSON at position (\\d+)/, 
          replacement: ''位置 $1 处应该是属性名或 "}"'' },
        { pattern: /Unexpected end of JSON input/, 
          replacement: ''JSON 数据不完整'' },
        { pattern: /Unexpected string in JSON at position (\\d+)/, 
          replacement: ''位置 $1 处字符串格式错误'' }
    ];

    for (const { pattern, replacement } of patterns) {
        if (pattern.test(errorMsg)) {
            return errorMsg.replace(pattern, replacement);
        }
    }
    return errorMsg;
}

// 清空所有内容
function clearAll() {
    document.getElementById(''input-json'').value = '''';
    document.getElementById(''output-json'').textContent = '''';
    clearError();
    updateInputStatus('''');
    updateOutputStatus(''等待处理'', ''empty'');
    resetStats();
}

// 复制输出结果
async function copyOutput() {
    const output = document.getElementById(''output-json'').textContent;
    
    if (!output.trim()) {
        showError(''没有可复制的内容'');
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        showCopySuccess();
    } catch (error) {
        // 降级到传统方法
        const textArea = document.createElement(''textarea'');
        textArea.value = output;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand(''copy'');
        document.body.removeChild(textArea);
        showCopySuccess();
    }
}

// 加载示例数据
function loadExample(type) {
    const example = examples[type];
    const input = typeof example === ''string'' ? example : JSON.stringify(example, null, 2);
    document.getElementById(''input-json'').value = input;
    onInputChange();
}

// JSON语法高亮
function highlightJSON(json) {
    return json
        .replace(/(\"([^\"\\\\]|\\\\.)*\")(\\s*:)/g, ''<span class="json-key">$1</span>$3'')
        .replace(/(\"([^\"\\\\]|\\\\.)*\")(?!\\s*:)/g, ''<span class="json-string">$1</span>'')
        .replace(/\\b(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b/g, ''<span class="json-number">$1</span>'')
        .replace(/\\b(true|false)\\b/g, ''<span class="json-boolean">$1</span>'')
        .replace(/\\bnull\\b/g, ''<span class="json-null">null</span>'');
}

// 更新统计信息
function updateStats(text) {
    if (!text) {
        resetStats();
        return;
    }

    const charCount = text.length;
    const lineCount = text.split(''\\n'').length;
    const fileSize = new Blob([text]).size;
    
    let objectCount = 0;
    let arrayCount = 0;
    
    try {
        const data = JSON.parse(text);
        countStructures(data);
    } catch (error) {
        // 如果解析失败，保持计数为0
    }

    function countStructures(obj) {
        if (Array.isArray(obj)) {
            arrayCount++;
            obj.forEach(item => countStructures(item));
        } else if (obj && typeof obj === ''object'') {
            objectCount++;
            Object.values(obj).forEach(value => countStructures(value));
        }
    }

    // 更新显示
    document.getElementById(''char-count'').textContent = charCount.toLocaleString();
    document.getElementById(''line-count'').textContent = lineCount.toLocaleString();
    document.getElementById(''object-count'').textContent = objectCount.toLocaleString();
    document.getElementById(''array-count'').textContent = arrayCount.toLocaleString();
    document.getElementById(''file-size'').textContent = formatFileSize(fileSize);
}

// 重置统计信息
function resetStats() {
    document.getElementById(''char-count'').textContent = ''0'';
    document.getElementById(''line-count'').textContent = ''0'';
    document.getElementById(''object-count'').textContent = ''0'';
    document.getElementById(''array-count'').textContent = ''0'';
    document.getElementById(''file-size'').textContent = ''0 B'';
}

// 格式化文件大小
function formatFileSize(bytes) {
    const units = [''B'', ''KB'', ''MB'', ''GB''];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
}

// 更新输出状态
function updateOutputStatus(text, status) {
    const statusEl = document.getElementById(''output-status'');
    statusEl.textContent = text;
    statusEl.className = `status status-${status}`;
}

// 显示错误信息
function showError(message) {
    const errorContainer = document.getElementById(''error-container'');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// 显示成功信息
function showSuccess(message) {
    const errorContainer = document.getElementById(''error-container'');
    errorContainer.innerHTML = `<div class="error-message" style="background: #f0fdf4; border-color: #bbf7d0; color: #166534;">${message}</div>`;
}

// 清除错误信息
function clearError() {
    document.getElementById(''error-container'').innerHTML = '''';
}

// 显示复制成功提示
function showCopySuccess() {
    const notification = document.getElementById(''copy-notification'');
    notification.classList.add(''show'');
    
    setTimeout(() => {
        notification.classList.remove(''show'');
    }, 2000);
}

// 页面加载完成后的初始化
document.addEventListener(''DOMContentLoaded'', function() {
    // 加载简单示例
    loadExample(''simple'');
});'
);