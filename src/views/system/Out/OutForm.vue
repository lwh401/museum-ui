<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
<!--      <el-form-item label="出库标本">-->
<!--        <el-select v-model="formData.number" clearable placeholder="请选择出库标本">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
<!--            :key="dict.number"-->
<!--            :label="dict.name"-->
<!--            :value="dict.number"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="出库人员">-->
<!--        <el-select v-model="formData.number" clearable placeholder="请选择出库人员">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
<!--            :key="dict.number"-->
<!--            :label="dict.name"-->
<!--            :value="dict.number"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->


      <el-form-item label="申请编号" prop="id">
        <el-input
          v-model="formData.id"
          class="!w-240px"
          placeholder="请输入申请编号"
        />
      </el-form-item>
      <el-form-item label="标本编号" prop="number">
        <el-input v-model="formData.number" placeholder="请输入标本编号" />
      </el-form-item>



    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>

import { CommonStatusEnum } from '@/utils/constants'

import * as OutBoundApi from '@/api/system/Out'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {updateForm} from "@/api/system/Out";


defineOptions({ name: 'SystemOutForm' })

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

  number:""
})
const formRules = reactive({
 })
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
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

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    number:""
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
  //提交请求
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
  } finally {
    formLoading.value = false
  }
}
  </script>
