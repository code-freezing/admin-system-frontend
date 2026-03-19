import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 持久化插件负责把指定 store 状态写入本地存储。
pinia.use(piniaPluginPersistedstate)

export default pinia
