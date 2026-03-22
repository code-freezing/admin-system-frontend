import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 这个插件会把声明了 persist 的 store 自动同步到本地存储。
pinia.use(piniaPluginPersistedstate)

export default pinia
