import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 pinia 实例，后续全局状态和持久化能力都从这里注册。
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export default pinia
