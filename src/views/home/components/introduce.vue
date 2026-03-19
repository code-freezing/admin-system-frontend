<template>
  <el-dialog v-model="state.dialogFormVisible" :title="title" width="800px" destroy-on-close center>
    <el-container>
      <el-main>
        <div class="content" v-html="valueHtml"></div>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getCompanyIntroduce } from '@/api/setting'

const title = ref('')
const valueHtml = ref('')
const state = reactive({
  dialogFormVisible: false,
})

const open = async (id: number) => {
  if (id == 1) {
    title.value = '公司介绍'
    const res = (await getCompanyIntroduce('公司介绍')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 2) {
    title.value = '公司架构'
    const res = (await getCompanyIntroduce('公司架构')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 3) {
    title.value = '公司战略'
    const res = (await getCompanyIntroduce('公司战略')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 4) {
    title.value = '公司高层'
    const res = (await getCompanyIntroduce('公司高层')) as any
    valueHtml.value = res?.results ?? res
  }
  state.dialogFormVisible = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
}

:deep(.el-main) {
  min-height: 500px;
}
</style>

