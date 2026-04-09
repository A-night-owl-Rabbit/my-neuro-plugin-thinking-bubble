# 思考气泡插件（my-neuro）

在 Live2D 桌宠上显示「正在思考」类萌系气泡：从用户发出对话到 LLM 开始通过 TTS 播报之前，提供轻量视觉反馈，并与工具调用气泡、歌词气泡错开显示。

## 功能概要

- **出现时机**：语音识别 / 文本发送后，即将请求 LLM 时（`onUserInput` + 短延迟）。
- **消失时机**：LLM 返回并进入 TTS 前（`onLLMResponse` / `onTTSStart` / 事件总线兜底），避免打断工具链与语音。
- **文案**：内置约 50 条随机萌系短句，可按配置替换为自定义列表。
- **样式**：独立 DOM 与样式注入，跟随模型位置；与歌词气泡同时存在时会自动让路（避免重叠）。
- **大小可调**：支持通过 `bubble_scale` 配置项整体缩放气泡，适配不同屏幕尺寸。

## 安装方式

1. 将本仓库内 **`metadata.json`、`index.js`、`plugin_config.json`** 复制到 my-neuro 的插件目录，例如：
   - `live-2d/plugins/community/thinking-bubble/`
2. 在 `live-2d/plugins/enabled_plugins.json` 中增加一行（路径按你放置的位置调整）：
   ```json
   "community/thinking-bubble"
   ```
3. 重启桌宠应用或等待插件热加载生效。

> 插件内 `require` 路径相对于 `live-2d/plugins/<类型>/thinking-bubble/index.js`，需与官方插件目录结构一致（与内置插件相同的 `../../../js/core/...` 相对路径）。

## 配置说明（plugin_config.json）

在插件配置界面或编辑 `plugin_config.json` 后可调整：

| 配置项 | 字段名 | 类型 | 默认值 | 说明 |
|--------|--------|------|--------|------|
| 水平偏移 | `offset_x` | number | -160 | 气泡相对模型锚点的水平像素偏移，负值偏左，正值偏右 |
| 垂直偏移 | `offset_y` | number | -180 | 气泡相对模型锚点的垂直像素偏移，负值偏上 |
| 显示延迟 | `show_delay_ms` | number | 300 | 发出消息后延迟多久（毫秒）再显示气泡，减轻闪烁 |
| 文案切换间隔 | `text_change_interval_ms` | number | 2500 | 气泡显示期间随机轮换文案的间隔（毫秒） |
| **气泡缩放** | `bubble_scale` | number | 1.0 | 控制气泡整体缩放比例。`1.0` 为原始大小，`0.5` 缩小一半。**屏幕较小或模型缩小后觉得气泡过大时，推荐设为 `0.5`~`0.8`**。建议范围 `0.4`~`1.5` |
| 自定义文案 | `custom_texts` | string | `""` | JSON 数组字符串，例如 `["正在想~","稍等喵"]`，非空则覆盖默认文案列表 |

### 配置示例

如果觉得气泡太大，可以在 `plugin_config.json` 中将 `bubble_scale` 的 `value` 改为较小的值：

```json
"bubble_scale": {
    "title": "气泡缩放",
    "description": "控制思考气泡的整体缩放比例，1.0为原始大小，0.5为缩小一半，建议范围0.4~1.5",
    "type": "number",
    "default": 1.0,
    "value": "0.6"
}
```

## 技术说明

- 依赖 my-neuro 插件基类与事件总线（`plugin-base.js`、`event-bus.js`、`events.js`）。
- 不监听 `TTS_INTERRUPTED` 作为隐藏条件，避免新对话打断旧 TTS 时误清「待显示」定时器。
- 歌词气泡可见性通过 `getComputedStyle` 判断，避免与仅写在 CSS 里的 `display:none` 误判冲突。
- 气泡缩放通过 CSS `transform: scale()` 实现，`transformOrigin` 设为 `bottom left`，确保缩放后气泡仍锚定在模型附近。

## 更新日志

### v1.1.0

- **新增** `bubble_scale` 配置项，支持自定义气泡大小，解决小屏幕下气泡过大的问题

## 想邀请你，做这只小牛的“云饲养员”

做这个桌宠的初衷，其实是因为自己一个人工作学习的时候，总觉得屏幕里空落落的。看到大家都在使用，我就觉得熬夜写代码、调教AI的日子都亮闪闪的。🌟

不过，肥牛现在还在长身体（其实是我想给它做更多有趣的插件），养一只数字小牛其实也挺“费草”的哈哈。🌱

如果你在这只小肥牛这里获得过哪怕一秒钟的治愈，或者觉得它算个合格的桌面搭子，要不要考虑成为它的“云饲养员”呀？

你的每一次充电，都不是在打赏我，而是在给这只肥牛注入一点点魔法值。让它能变得更聪明、更通人性、能听懂你更多的碎碎念。

不用有压力哦！你愿意打开它，就是对我最大的鼓励啦。如果刚好有余力，就请肥牛喝瓶快乐水叭，它会记住你的味道的！🥤❤️

爱发电 https://ifdian.net/a/0923A

## 许可证

MIT License（见 `LICENSE` 文件）
