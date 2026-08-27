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

    async onConfigChanged(newPluginConfig) {
        this._cfg = newPluginConfig || this.context.getPluginFileConfig();
        this._loadCustomTexts();
        if (this._isShowing && this._container) {
            this._applyScale();
            this._posInitialized = false;
            this._updatePosition();
        }
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
        // The plugin hook runs before audio playback starts. Actual playback is
        // reported by Events.TTS_START, which is bound below.
    }

    // ===== 内部方法 =====

    _loadCustomTexts() {
        this._texts = DEFAULT_TEXTS;
        const raw = this._cfg.custom_texts;
        if (raw && typeof raw === 'string' && raw.trim()) {
            try {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr) && arr.length > 0) {
                    const validTexts = arr
                        .map(text => String(text || '').trim())
                        .filter(Boolean);
                    if (validTexts.length > 0) this._texts = validTexts;
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
        // Successful audio hides at the real playback start. Terminal paths
        // also hide so text-only and failed-audio turns cannot leave it stuck.
        this._on(Events.TTS_START, () => this._hide());
        this._on(Events.TTS_END, () => this._hide());
        this._on(Events.TTS_INTERRUPTED, () => this._hide());
        this._on(Events.USER_INPUT_END, () => {
            const ttsProcessor = global.ttsProcessor;
            if (!ttsProcessor?.isPlaying?.()) {
                this._hide();
            }
        });
    }

    _unbindEvents() {
        for (const { event, handler } of this._boundEvents) {
            eventBus.off(event, handler);
        }
        this._boundEvents = [];
    }

    _scheduleShow() {
        if (!this._ready) return;
        if (global.bubbleLayout?.isEditing()) return;

        if (this._isShowing) {
            this._textEl.textContent = this._pickRandom();
            return;
        }

        clearTimeout(this._showTimer);
        const rawDelay = Number(this._cfg.show_delay_ms);
        const delay = Number.isFinite(rawDelay) && rawDelay >= 0 ? rawDelay : 300;
        this._showTimer = setTimeout(() => this._show(), delay);
    }

    _show() {
        if (global.bubbleLayout?.isEditing()) return;
        if (!this._container || !this._inner) return;
        if (this._isShowing) return;
        if (this._isOtherBubbleActive()) return;

        this._isShowing = true;
        this._textEl.textContent = this._pickRandom();
        this._container.style.display = 'block';

        this._applyScale();

        this._posInitialized = false;
        if (!this._updatePosition()) {
            this._isShowing = false;
            this._container.style.display = 'none';
            return;
        }

        requestAnimationFrame(() => {
            if (this._inner) {
                this._inner.classList.add('visible');
            }
        });

        this._startPositionTracking();
        this._startTextRotation();
    }

    /**
     * @param {boolean} immediate - 是否跳过动画直接隐藏
     */
    _hide(immediate) {
        if (global.bubbleLayout?.isEditing()) return;
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
        const checkIds = ['lyrics-bubble-container', 'dream-bubble-container'];
        for (const id of checkIds) {
            const el = document.getElementById(id);
            if (el && window.getComputedStyle(el).display !== 'none') return true;
        }
        return false;
    }

    _pickRandom() {
        return this._texts[Math.floor(Math.random() * this._texts.length)];
    }

    _applyScale() {
        if (!this._container) return;
        if (global.bubbleLayout) {
            global.bubbleLayout.applyStatic('thinking', this._container);
            return;
        }
        const rawScale = Number(this._cfg.bubble_scale);
        const scale = (Number.isFinite(rawScale) && rawScale > 0) ? rawScale : 1;
        this._container.style.transform = `scale(${scale})`;
        this._container.style.transformOrigin = 'bottom left';
    }

    _startTextRotation() {
        this._stopTextRotation();
        const rawInterval = Number(this._cfg.text_change_interval_ms);
        // 间隔 0 会导致疯狂刷新，这里严格要求 > 0，非法值回退默认
        const interval = Number.isFinite(rawInterval) && rawInterval > 0 ? rawInterval : 2500;
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

    _getActiveAvatarState() {
        const facade = global.avatarFacade || (typeof window !== 'undefined' ? window.avatar : null);
        const type = facade?.getActiveType?.() || global.currentModel?.modelType || 'live2d';
        const model = facade?.getModel?.() || global.currentModel;
        const canvas = facade?.getActiveCanvas?.()
            || document.getElementById('live2d-canvas')
            || document.getElementById('canvas');
        return { type, model, canvas };
    }

    _getModelScreenPosition() {
        const { type, model, canvas } = this._getActiveAvatarState();
        if (!model || typeof model.toGlobal !== 'function') return null;

        const modelGlobalPos = model.toGlobal({ x: 0, y: 0 });
        if (!modelGlobalPos) return null;

        const modelX = Number(modelGlobalPos.x);
        const modelY = Number(modelGlobalPos.y);
        if (!Number.isFinite(modelX) || !Number.isFinite(modelY)) return null;

        if (type === 'live2d' && canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const canvasWidth = Number(canvas.width) || canvasRect.width || 1;
            const canvasHeight = Number(canvas.height) || canvasRect.height || 1;
            const scaleX = canvasRect.width / canvasWidth;
            const scaleY = canvasRect.height / canvasHeight;
            return {
                x: canvasRect.left + modelX * scaleX,
                y: canvasRect.top + modelY * scaleY
            };
        }

        return { x: modelX, y: modelY };
    }

    _updatePosition() {
        if (!this._container || !this._isShowing) return false;
        if (global.bubbleLayout?.isEditing()) return false;

        try {
            const modelPos = global.bubbleLayout?.getModelScreenPosition?.() || this._getModelScreenPosition();
            if (!modelPos) return false;

            let offsetX;
            let offsetY;
            if (global.bubbleLayout) {
                const layout = global.bubbleLayout.get('thinking');
                offsetX = layout.offsetX;
                offsetY = layout.offsetY;
                global.bubbleLayout.applyStatic('thinking', this._container);
            } else {
                const rawX = Number(this._cfg.offset_x);
                const rawY = Number(this._cfg.offset_y);
                offsetX = Number.isFinite(rawX) ? rawX : -160;
                offsetY = Number.isFinite(rawY) ? rawY : -180;
            }
            const targetX = modelPos.x + offsetX;
            const targetY = modelPos.y + offsetY;

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
            return true;
        } catch {
            // silently ignore
            return false;
        }
    }
}

module.exports = ThinkingBubblePlugin;
