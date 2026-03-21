// plugins/built-in/thinking-bubble/index.js
const { Plugin } = require('../../../js/core/plugin-base.js');
const { eventBus } = require('../../../js/core/event-bus.js');
const { Events } = require('../../../js/core/events.js');

const DEFAULT_TEXTS = [
    '正在思考...',
    '嗯...让我想想~',
    '脑子转转中~',
    '思考中...>.<',
    '正在绞尽脑汁!',
    '灵感快来吧~',
    '处理中喵~',
    '让我琢磨一下...',
    '认真想想看~',
    '思绪飘飘中~',
    '好问题...嗯嗯',
    '让脑细胞活动一下!',
    '正在全力运转~',
    '稍等一下下哦~',
    '容我三思...♡',
    '小脑袋瓜嗡嗡嗡~',
    '答案马上就来!',
    '正在翻阅脑内图书馆~',
    '灵感小精灵快来!',
    '思考回路启动中~',
    '唔姆...这个嘛~',
    '等一下下喵~',
    '脑内小仓鼠跑起来了!',
    '正在疯狂动脑!',
    '想啊想啊想~',
    '嘿咻嘿咻思考中!',
    '请给我一点点时间~',
    '脑细胞们集合啦!',
    '正在努力想呢...!',
    '这个问题好有趣~',
    '让思绪飞一会儿~',
    '答案在路上了哦~',
    '认真思考.jpg',
    '头顶冒烟思考中~',
    '正在召唤灵感之神!',
    '嗯嗯嗯...有了!等等没有...',
    '思维风暴进行中~',
    '小齿轮咔咔转动中~',
    '正在组织语言~',
    '马上就好啦!',
    '思考力全开!',
    '脑袋里开小会呢~',
    '灵光一闪的前奏~',
    '正在编织答案中~',
    '再想想...差一点点!',
    '智慧结晶生成中~',
    '叮咚~思考中请稍候',
    '专注模式已开启!',
    '答案酝酿中...♪',
    '正在连接智慧星球~',
];

const THINKING_CSS = `
/* ===== 思考气泡容器 ===== */
#thinking-bubble-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
    display: none;
    pointer-events: none;
    transition: none;
}

/* 思考气泡主体 */
#thinking-bubble-inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 120px;
    max-width: 260px;
    padding: 14px 20px;

    background: linear-gradient(145deg, #fff0f5 0%, #ffe4f0 40%, #ffd6ec 100%);
    border: 2.5px solid #ffb6d3;
    border-radius: 22px;
    box-shadow:
        0 8px 24px rgba(255, 105, 180, 0.22),
        0 2px 8px rgba(255, 105, 180, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #d63384;
    line-height: 1.5;
    text-align: left;
    word-wrap: break-word;
    white-space: nowrap;

    pointer-events: none;
    animation: thinking-float 3s ease-in-out infinite;
    opacity: 0;
    transition: opacity 0.35s ease;
}

#thinking-bubble-inner.visible {
    opacity: 1;
}

/* 气泡尾巴 */
#thinking-bubble-inner::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 24px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 0;
    border-color: #ffb6d3 transparent transparent transparent;
    filter: drop-shadow(1px 2px 3px rgba(255, 105, 180, 0.15));
}

#thinking-bubble-inner::before {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 26px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 0 0;
    border-color: #ffe4f0 transparent transparent transparent;
    z-index: 1;
}

/* 思考文字 */
#thinking-bubble-text {
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 三个跳动小圆点 */
.thinking-dots {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.thinking-dots .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ff85b3;
    animation: dot-bounce 1.4s ease-in-out infinite;
}

.thinking-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
    background: #ff6ca0;
}

.thinking-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
    background: #ff528d;
}

/* 小装饰星星/心心 */
.thinking-deco {
    position: absolute;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    animation: deco-sparkle 2s ease-in-out infinite;
}

.thinking-deco:nth-child(1) {
    top: -8px;
    right: 15px;
    animation-delay: 0s;
}

.thinking-deco:nth-child(2) {
    top: -5px;
    right: 45px;
    animation-delay: 0.7s;
}

.thinking-deco:nth-child(3) {
    top: -10px;
    right: 30px;
    animation-delay: 1.4s;
}

/* ===== 动画 ===== */

@keyframes thinking-float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    25% {
        transform: translateY(-5px) rotate(-0.5deg);
    }
    50% {
        transform: translateY(-9px) rotate(0deg);
    }
    75% {
        transform: translateY(-5px) rotate(0.5deg);
    }
}

@keyframes dot-bounce {
    0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.5;
    }
    40% {
        transform: translateY(-8px);
        opacity: 1;
    }
}

@keyframes deco-sparkle {
    0%, 100% {
        opacity: 0;
        transform: scale(0.5) translateY(0);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.1) translateY(-4px);
    }
}

/* 文字切换淡入效果 */
@keyframes text-fade-in {
    0% {
        opacity: 0;
        transform: translateY(4px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.thinking-text-fade {
    animation: text-fade-in 0.3s ease-out;
}
`;

class ThinkingBubblePlugin extends Plugin {
    constructor(metadata, context) {
        super(metadata, context);
        this._container = null;
        this._inner = null;
        this._textEl = null;
        this._isShowing = false;
        this._showTimer = null;
        this._textRotateTimer = null;
        this._positionTimer = null;
        this._currentX = 0;
        this._currentY = 0;
        this._posInitialized = false;
        this._texts = DEFAULT_TEXTS;
        this._cfg = {};
        this._ready = false;

        this._boundEvents = [];
    }

    async onInit() {
        this._cfg = this.context.getPluginFileConfig();
        this._loadCustomTexts();
    }

    async onStart() {
        this._injectCSS();
        this._createDOM();
        this._bindEvents();
        this._ready = true;
    }

    async onStop() {
        this._ready = false;
        this._hide(true);
        this._unbindEvents();
        this._removeDOM();
        this._removeCSS();
    }

    async onDestroy() {
        await this.onStop();
    }

    // ===== 插件钩子 =====

    async onUserInput(_event) {
        this._scheduleShow();
    }

    async onTTSStart(_text) {
        this._hide();
    }

    async onTTSEnd() {
        this._hide();
    }

    async onLLMResponse(_response) {
        this._hide();
    }

    // ===== 内部方法 =====

    _loadCustomTexts() {
        const raw = this._cfg.custom_texts;
        if (raw && typeof raw === 'string' && raw.trim()) {
            try {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr) && arr.length > 0) {
                    this._texts = arr;
                }
            } catch {
                // ignore
            }
        }
    }

    _injectCSS() {
        if (document.getElementById('thinking-bubble-style')) return;
        const style = document.createElement('style');
        style.id = 'thinking-bubble-style';
        style.textContent = THINKING_CSS;
        document.head.appendChild(style);
    }

    _removeCSS() {
        const el = document.getElementById('thinking-bubble-style');
        if (el) el.remove();
    }

    _createDOM() {
        if (document.getElementById('thinking-bubble-container')) return;

        const container = document.createElement('div');
        container.id = 'thinking-bubble-container';

        const decos = ['\u2726', '\u2661', '\u2727'];
        const inner = document.createElement('div');
        inner.id = 'thinking-bubble-inner';

        decos.forEach(symbol => {
            const span = document.createElement('span');
            span.className = 'thinking-deco';
            span.textContent = symbol;
            inner.appendChild(span);
        });

        const textEl = document.createElement('span');
        textEl.id = 'thinking-bubble-text';
        textEl.textContent = this._pickRandom();
        inner.appendChild(textEl);

        const dots = document.createElement('span');
        dots.className = 'thinking-dots';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dots.appendChild(dot);
        }
        inner.appendChild(dots);

        container.appendChild(inner);
        document.body.appendChild(container);

        this._container = container;
        this._inner = inner;
        this._textEl = textEl;
    }

    _removeDOM() {
        if (this._container && this._container.parentNode) {
            this._container.parentNode.removeChild(this._container);
        }
        this._container = null;
        this._inner = null;
        this._textEl = null;
    }

    _on(event, handler) {
        eventBus.on(event, handler);
        this._boundEvents.push({ event, handler });
    }

    _bindEvents() {
        // LLM_ERROR: LLM 出错时隐藏
        this._on(Events.LLM_ERROR, () => this._hide());

        // USER_INPUT_END: 整个请求处理完毕的最终安全兜底
        this._on(Events.USER_INPUT_END, () => this._hide());

        // 不监听 TTS_START ！
        // 工具调用链中间的"说话"也会触发 TTS_START，会误杀思考气泡
        // 隐藏时机由插件钩子 onTTSStart / onLLMResponse 负责（只在最终回复时调用）
        //
        // 不监听 TTS_INTERRUPTED ！
        // 新请求开始时会中断旧TTS，TTS_INTERRUPTED 会清除刚设置的定时器
    }

    _unbindEvents() {
        for (const { event, handler } of this._boundEvents) {
            eventBus.off(event, handler);
        }
        this._boundEvents = [];
    }

    _scheduleShow() {
        if (!this._ready) return;

        if (this._isShowing) {
            this._textEl.textContent = this._pickRandom();
            return;
        }

        clearTimeout(this._showTimer);
        const delay = Number(this._cfg.show_delay_ms) || 300;
        this._showTimer = setTimeout(() => this._show(), delay);
    }

    _show() {
        if (!this._container || !this._inner) return;
        if (this._isShowing) return;
        if (this._isOtherBubbleActive()) return;

        this._isShowing = true;
        this._textEl.textContent = this._pickRandom();
        this._container.style.display = 'block';

        requestAnimationFrame(() => {
            if (this._inner) {
                this._inner.classList.add('visible');
            }
        });

        this._posInitialized = false;
        this._startPositionTracking();
        this._startTextRotation();
    }

    /**
     * @param {boolean} immediate - 是否跳过动画直接隐藏
     */
    _hide(immediate) {
        clearTimeout(this._showTimer);
        this._showTimer = null;

        if (!this._isShowing) return;
        this._isShowing = false;

        if (this._inner) {
            this._inner.classList.remove('visible');
        }

        const hideDelay = immediate ? 0 : 400;
        setTimeout(() => {
            if (!this._isShowing && this._container) {
                this._container.style.display = 'none';
            }
        }, hideDelay);

        this._stopPositionTracking();
        this._stopTextRotation();
    }

    _isOtherBubbleActive() {
        const lyricsBubble = document.getElementById('lyrics-bubble-container');
        if (lyricsBubble) {
            const computed = window.getComputedStyle(lyricsBubble).display;
            if (computed !== 'none') return true;
        }
        return false;
    }

    _pickRandom() {
        return this._texts[Math.floor(Math.random() * this._texts.length)];
    }

    _startTextRotation() {
        this._stopTextRotation();
        const interval = Number(this._cfg.text_change_interval_ms) || 2500;
        this._textRotateTimer = setInterval(() => {
            if (!this._textEl) return;
            this._textEl.classList.remove('thinking-text-fade');
            void this._textEl.offsetWidth;
            this._textEl.textContent = this._pickRandom();
            this._textEl.classList.add('thinking-text-fade');
        }, interval);
    }

    _stopTextRotation() {
        clearInterval(this._textRotateTimer);
        this._textRotateTimer = null;
    }

    _startPositionTracking() {
        this._stopPositionTracking();
        this._positionTimer = setInterval(() => this._updatePosition(), 16);
    }

    _stopPositionTracking() {
        clearInterval(this._positionTimer);
        this._positionTimer = null;
    }

    _updatePosition() {
        if (!this._container || !this._isShowing) return;

        try {
            if (!global.currentModel || !global.pixiApp) return;

            const canvas = document.getElementById('canvas');
            if (!canvas) return;
            const canvasRect = canvas.getBoundingClientRect();

            const modelGlobalPos = global.currentModel.toGlobal({ x: 0, y: 0 });
            const scaleX = canvasRect.width / canvas.width;
            const scaleY = canvasRect.height / canvas.height;

            const screenX = canvasRect.left + modelGlobalPos.x * scaleX;
            const screenY = canvasRect.top + modelGlobalPos.y * scaleY;

            if (isNaN(screenX) || isNaN(screenY)) return;

            const rawX = Number(this._cfg.offset_x);
            const rawY = Number(this._cfg.offset_y);
            const offsetX = isNaN(rawX) ? -160 : rawX;
            const offsetY = isNaN(rawY) ? -180 : rawY;
            const targetX = screenX + offsetX;
            const targetY = screenY + offsetY;

            const smooth = 0.18;
            if (!this._posInitialized) {
                this._currentX = targetX;
                this._currentY = targetY;
                this._posInitialized = true;
            } else {
                this._currentX += (targetX - this._currentX) * smooth;
                this._currentY += (targetY - this._currentY) * smooth;
            }

            this._container.style.left = `${this._currentX}px`;
            this._container.style.top = `${this._currentY}px`;
        } catch {
            // silently ignore
        }
    }
}

module.exports = ThinkingBubblePlugin;
