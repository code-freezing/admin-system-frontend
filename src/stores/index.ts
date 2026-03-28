/**
 * 模块说明：
 * 1. Pinia 根实例。
 * 2. 负责创建并导出全局状态容器，供 main.ts 安装到应用中。
 * 3. 持久化插件也在这里统一接入。
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 这个插件会把声明了 persist 的 store 自动同步到本地存储。
pinia.use(piniaPluginPersistedstate)

export default pinia
