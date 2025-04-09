<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="标本编号" prop="number">
        <el-input
          v-model="formData.number[0]" placeholder="请输入标本编号" >
        <template #append>
          <el-button
            type="primary"
            @click="add()"
          >
            +
          </el-button>
          <el-button
            type="primary"
            @click="remove()"
          >
            -
          </el-button>
        </template>
        </el-input>
      </el-form-item>
      <template v-if="formData.number && formData.number.length > 1">
        <el-form-item
          v-for="(item,index) in formData.number.slice(1)"
          :key="index + 1"
          :label="`标本编号 ${index + 2}`"
          :prop="`number.${index + 1}`"
        >
          <el-input
            v-model="formData.number[index + 1]"
            placeholder="请输入标本编号"
          />
        </el-form-item>
      </template>
      <el-form-item label="入库时间" prop="returnTime">
        <el-date-picker
          v-model="formData.returnTime"
          range-separator="-"
          placeholder="入库时间"
        />
      </el-form-item>
        <el-form-item label="退换人" prop="returnPerson">
          <el-input v-model="formData.returnPerson" placeholder="请输入退换人姓名" />
        </el-form-item>
      <el-form-item label="标本情况" prop="annex_return">
        <el-input v-model="formData.annex_return" placeholder="请输入标本情况" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输备注" type="textarea" />
      </el-form-item>
    </el-form>
      <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as RoleApi from '@/api/system/role'
import * as OutBoundApi from "@/api/system/Out";

defineOptions({ name: 'SystemRoleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  // name: '',
  // code: '',
  // sort: undefined,
  // status: CommonStatusEnum.ENABLE,
  // remark: ''
  number:['']
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OutBoundApi.getRole(id)
    } finally {
      formLoading.value = false
    }
  }
}

const add = () => {
  formData.value.number.push('')
}
const remove = () => {
  if (formData.value.number.length > 1) {
    formData.value.number.pop(); // 删除最后一个输入框
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    number:['']
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
//   校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
// 提交申请
  formLoading.value = true
  try {
    const data = formData.value as unknown as OutBoundApi.OouBoundVO
    if (formType.value === 'create') {
      console.log(data,'新增时')
      await OutBoundApi.createOutBound(data)
      message.success(t('common.createSuccess'))
    } else {
      await OutBoundApi.updateForm(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  }
  catch (error) {
    console.error('Error:', error);
  }
  finally {
    formLoading.value = false
  }
}
</script>
