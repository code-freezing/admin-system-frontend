<!--
  组件说明：
  1. 用户管理员列表页。
  2. 面向超级管理员维护用户管理员账号。
  3. 与其他管理员列表页共享同一套表格与弹窗模式。
-->
<template>
  <adminManagePage identity="用户管理员" title="用户管理员" :create-type="1" />
</template>

<script lang="ts" setup>
import adminManagePage from '../components/admin_manage_page.vue'
</script>
