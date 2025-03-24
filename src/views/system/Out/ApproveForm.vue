<template>
  <el-dialog title="审批表单">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="审批意见">
        <el-input v-model="formData.opinion" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="$emit('submit')">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  formData: Object
})
defineEmits(['cancel', 'submit'])
</script>
