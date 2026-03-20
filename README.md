# 思考气泡插件（my-neuro）

在 Live2D 桌宠上显示「正在思考」类萌系气泡：从用户发出对话到 LLM 开始通过 TTS 播报之前，提供轻量视觉反馈，并与工具调用气泡、歌词气泡错开显示。

## 功能概要

- **出现时机**：语音识别 / 文本发送后，即将请求 LLM 时（`onUserInput` + 短延迟）。
- **消失时机**：LLM 返回并进入 TTS 前（`onLLMResponse` / `onTTSStart` / 事件总线兜底），避免打断工具链与语音。
- **文案**：内置约 50 条随机萌系短句，可按配置替换为自定义列表。
- **样式**：独立 DOM 与样式注入，跟随模型位置；与歌词气泡同时存在时会自动让路（避免重叠）。

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

| 配置项 | 说明 |
|--------|------|
| 水平 / 垂直偏移 | 气泡相对模型锚点的像素偏移，便于不同模型对齐 |
| 显示延迟 | 发出消息后延迟多久再显示气泡，减轻闪烁 |
| 文案切换间隔 | 气泡显示期间随机轮换文案的间隔 |
| 自定义文案 | JSON 数组字符串，例如 `["正在想~","稍等喵"]`，非空则覆盖默认列表 |

## 技术说明

- 依赖 my-neuro 插件基类与事件总线（`plugin-base.js`、`event-bus.js`、`events.js`）。
- 不监听 `TTS_INTERRUPTED` 作为隐藏条件，避免新对话打断旧 TTS 时误清「待显示」定时器。
- 歌词气泡可见性通过 `getComputedStyle` 判断，避免与仅写在 CSS 里的 `display:none` 误判冲突。

## 版本与兼容

- **metadata** 中 `framework_version`: `>=1.0.0`
- 见仓库内 `metadata.json` 的 `version` 字段

## 许可证

MIT License（见 `LICENSE` 文件）

## 致谢

适用于 [my-neuro](https://github.com/) 系 Live2D 语音桌宠项目；发布形态参考社区插件仓库的组织方式。
