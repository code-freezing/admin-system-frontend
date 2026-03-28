<!--
  组件说明：
  1. 产品管理员列表页。
  2. 面向超级管理员维护产品管理员账号。
  3. 它和其他管理员列表页结构接近，但身份参数不同。
-->
<template>
  <adminManagePage identity="产品管理员" title="产品管理员" :create-type="2" />
</template>

<script lang="ts" setup>
import adminManagePage from '../components/admin_manage_page.vue'
</script>
