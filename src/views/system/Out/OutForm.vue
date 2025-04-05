<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
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


<!--      <el-form-item label="申请编号" prop="id">-->
<!--        <el-input-->
<!--          v-model="formData.id"-->
<!--          class="!w-240px"-->
<!--          placeholder="请输入申请编号"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="标本编号" prop="number">-->
<!--        <el-input v-model="formData.number" placeholder="请输入标本编号" />-->
<!--      </el-form-item>-->

      <el-form-item label="标本编号" prop="number">
        <el-input
          v-model="formData.number[0]"
          placeholder="请输入标本编号">
<!--        />-->
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
      <el-form-item label="申请人" prop="applyPerson">
        <el-input v-model="formData.applyPerson" placeholder="请输入申请人" />
      </el-form-item>
      <el-form-item label="申请单位" prop="applyUnit">
        <el-input v-model="formData.numbapplyUniter" placeholder="请输入申请单位" />
      </el-form-item>
      <el-form-item label="预计退还时间" prop="returnExpect">
<!--        <el-input v-model="formData.returnExpect" placeholder="请输入时间" />-->
<!--      </el-form-item>-->
<!--      <el-form-item-->
        <el-date-picker
        v-model="formData.returnExpect"
        range-separator="-"
        placeholder="退还时间"

      />
      </el-form-item>
      <el-form-item label="目的" prop="purpose">
        <el-input v-model="formData.purpose" placeholder="请输入目的" />
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
// import {updateForm} from "@/api/system/Out";
import {jsonParse} from "@/utils";


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

  number:['']
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
  //提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OutBoundApi.OouBoundVO
    // data.number =jsonParse(data.number)
    if (formType.value === 'create') {
      console.log(data,'新增时')
      // 1. 分割字符串并过滤空值
      // const rawArray = formData.value.number.split(',').map(item => item.trim()).filter(Boolean);
      // 2. 转换为数字数组
      // formData.value.number = rawArray.map(item => {
      //   const num = Number(item);
      //   return isNaN(num) ? null : num; // 处理非数字字符（返回 null 或根据需求处理）
      // }).filter(num => num !== null); // 过滤无效值
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
<!--<style scoped>-->
<!--.dialog-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 16px; /* 控制行间距 */-->
<!--}-->

<!--.form-item {-->
<!--  display: flex;-->
<!--  align-items: center; /* 垂直居中对齐 */-->
<!--  gap: 8px; /* 标签和输入框间距 */-->
<!--}-->

<!--.label {-->
<!--  width: 100px; /* 固定标签宽度 */-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.input {-->
<!--  flex: 1; /* 输入框自适应剩余空间 */-->
<!--}-->
<!--</style>-->
