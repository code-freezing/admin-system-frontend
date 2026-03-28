<!--
  组件说明：
  1. 消息管理员列表页。
  2. 面向超级管理员维护消息管理员账号，包括创建、编辑和删除。
  3. 这类页面会复用同一套表格 hook 与弹窗模式。
-->
<template>
  <adminManagePage identity="消息管理员" title="消息管理员" :create-type="3" />
</template>

<script lang="ts" setup>
import adminManagePage from '../components/admin_manage_page.vue'
</script>
