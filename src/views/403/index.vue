<template>
  <div class="forbidden-page">
    <div class="content">
      <h1>403</h1>
      <p>当前账号无权限访问该页面。</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.forbidden-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f4f7fb 0%, #eef2f8 100%);
}

.content {
  padding: 48px 56px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(19, 33, 68, 0.12);
  text-align: center;

  h1 {
    margin: 0 0 12px;
    font-size: 64px;
    color: #1f2d3d;
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #606266;
  }
}
</style>
