<template>
  <el-dialog v-model="dialogFormVisible" title="产品入库" width="600px" align-center draggable>
    <div class="dialog-content">
      <el-form
        ref="ruleFormRef"
        :model="formDataInfo"
        :label-position="labelPosition"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="产品编号" prop="product_id">
          <el-input v-model="formDataInfo.product_id" />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="formDataInfo.product_name" />
        </el-form-item>
        <el-form-item label="产品分类" prop="product_category">
          <el-select v-model="formDataInfo.product_category" placeholder="请选择产品分类">
            <el-option v-for="item in categoryData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="product_unit">
          <el-select v-model="formDataInfo.product_unit" placeholder="请选择单位">
            <el-option label="个" value="个" />
            <el-option label="箱" value="箱" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="product_in_warehouse_number">
          <el-input v-model="formDataInfo.product_in_warehouse_number" />
        </el-form-item>
        <el-form-item label="单价" prop="product_single_price">
          <el-input v-model="formDataInfo.product_single_price" />
        </el-form-item>
        <el-form-item label="创建人" prop="product_create_person">
          <el-input v-model="formDataInfo.product_create_person" />
        </el-form-item>
        <el-form-item label="备注" prop="in_memo">
          <el-input v-model="formDataInfo.in_memo" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="add">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createProduct } from '@/api/product'
import { getProduct } from '@/api/setting'

// 记录当前状态，方便后续逻辑统一读取和更新。
const labelPosition = ref('left')
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
// 记录数据，方便后续逻辑统一读取和更新。
const categoryData = ref([])

// 记录表单数据信息，方便后续逻辑统一读取和更新。
const formDataInfo = reactive({
  product_id: null,
  product_name: '',
  product_category: '',
  product_unit: '',
  product_in_warehouse_number: null,
  product_single_price: null,
  product_create_person: '',
  in_memo: '',
})

// 记录校验规则，方便后续逻辑统一读取和更新。
const rules = reactive({
  product_id: [{ required: true, message: '请输入产品编号', trigger: 'blur' }],
  product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  product_category: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
  product_unit: [{ required: true, message: '请选择单位', trigger: 'blur' }],
  product_in_warehouse_number: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  product_single_price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  product_create_person: [{ required: true, message: '请输入创建人', trigger: 'blur' }],
})

// 加载列表，让后续逻辑直接复用准备好的数据。
const loadCategoryList = async () => {
  // 产品分类来自系统设置，保持和字典维护中的产品分类完全一致。
  const res = await getProduct()
  categoryData.value = res.data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = () => {
  dialogFormVisible.value = true
}

// 把新结果并入当前状态，避免调用方手动维护同一份数据。
const add = async () => {
  // 入库成功后只通知父页面刷新列表，弹窗本身不接管库存表格状态。
  const res = await createProduct(formDataInfo)
  if (res.status == 0) {
    ElMessage.success('产品入库成功')
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('产品入库失败')
    dialogFormVisible.value = false
  }
}

loadCategoryList()

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  padding: 20px 30px;
}

:deep(.el-form-item) {
  margin: 30px;
}
</style>
