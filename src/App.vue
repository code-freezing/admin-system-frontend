<!--
  组件说明：
  1. 根组件。
  2. 只负责提供应用的顶层挂载点和路由出口，本身不保存业务状态。
  3. 真正的后台布局、菜单和页面切换逻辑都在 menu 视图下完成。
-->
<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>
