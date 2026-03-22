<template>
  <el-dialog v-model="dialogVisible" title="编辑商品" width="600px" align-center draggable>
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :model="formData"
        :label-position="labelPosition"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="商品编号" prop="product_id">
          <el-input v-model="formData.product_id" disabled />
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="formData.product_name" />
        </el-form-item>
        <el-form-item label="商品分类" prop="product_category">
          <el-select v-model="formData.product_category" placeholder="请选择商品分类">
            <el-option v-for="item in categoryData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品单位" prop="product_unit">
          <el-select v-model="formData.product_unit" placeholder="请选择商品单位">
            <el-option label="件" value="件" />
            <el-option label="盒" value="盒" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="product_in_warehouse_number">
          <el-input v-model="formData.product_in_warehouse_number" />
        </el-form-item>
        <el-form-item label="单价" prop="product_single_price">
          <el-input v-model="formData.product_single_price" />
        </el-form-item>
        <el-form-item label="创建人" prop="product_create_person">
          <el-input v-model="formData.product_create_person" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="in_memo">
          <el-input v-model="formData.in_memo" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleEdit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormProps, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { editProduct } from '@/api/product'
import { getProduct } from '@/api/setting'

// 编辑商品弹窗只处理已有产品，不允许修改产品编号和创建人。
interface ProductFormModel {
  id: number | null
  product_id: number | null
  product_name: string
  product_category: string
  product_unit: string
  product_in_warehouse_number: number | string | null
  product_single_price: number | string | null
  product_create_person: string
  in_memo: string
}

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const emit = defineEmits<{
  success: []
}>()

const labelPosition = ref<FormProps['labelPosition']>('left')
const categoryData = ref<string[]>([])

const formData = reactive<ProductFormModel>({
  id: null,
  product_id: null,
  product_name: '',
  product_category: '',
  product_unit: '',
  product_in_warehouse_number: null,
  product_single_price: null,
  product_create_person: '',
  in_memo: '',
})

const rules: FormRules<ProductFormModel> = {
  product_id: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
  product_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  product_category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  product_unit: [{ required: true, message: '请选择商品单位', trigger: 'change' }],
  product_in_warehouse_number: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  product_single_price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  product_create_person: [{ required: true, message: '创建人不能为空', trigger: 'blur' }],
}

// 分类选项来自系统设置，和入库弹窗共享同一份字典数据。
const loadCategoryData = async () => {
  categoryData.value = (await getProduct()) as string[]
}

loadCategoryData()

const fillForm = (row: Partial<ProductFormModel>) => {
  formData.id = row.id ?? null
  formData.product_id = row.product_id ?? null
  formData.product_name = row.product_name ?? ''
  formData.product_category = row.product_category ?? ''
  formData.product_unit = row.product_unit ?? ''
  formData.product_in_warehouse_number = row.product_in_warehouse_number ?? null
  formData.product_single_price = row.product_single_price ?? null
  formData.product_create_person = row.product_create_person ?? ''
  formData.in_memo = row.in_memo ?? ''
}

// 打开时先用行数据填充表单，关闭与重新打开之间不依赖父组件保留状态。
const open = (row: Partial<ProductFormModel>) => {
  fillForm(row)
  dialogVisible.value = true
}

// 这里在提交前走一次 Element Plus 表单校验，避免把空字段直接送到后端。
const handleEdit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  const res = await editProduct(formData)
  if ((res as { status?: number }).status === 0) {
    ElMessage.success('商品信息修改成功')
    dialogVisible.value = false
    emit('success')
    return
  }

  ElMessage.error('商品信息修改失败')
}

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
