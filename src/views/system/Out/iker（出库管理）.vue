<template>
  <contentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="标本编号" prop="">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用途" prop="use">
        <el-input
          v-model="queryParams.use"
          class="!w-240px"
          clearable
          placeholder="请输入用途"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          class="!w-240px"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>






      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button

          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="编号" prop="number" />
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="用途" prop="use" />
      <el-table-column align="center" label="显示顺序" prop="sort" />
      <el-table-column align="center" label="开始时间" prop="remark" />
      <el-table-column align="center" label="结束时间" prop="remark" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
<!--    <el-dialog-->
<!--      v-model="formVisible"-->
<!--      :title="formType === 'create' ? '新增' : '修改'"-->
<!--      width="500px"-->
<!--    >-->
<!--      <el-form-->
<!--        ref="formRef"-->
<!--        :model="formData"-->
<!--        :rules="formRules"-->
<!--        label-width="80px"-->
<!--      >-->
<!--        <el-form-item label="名称" prop="name">-->
<!--          <el-input v-model="formData.name" placeholder="请输入名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用途" prop="use">-->
<!--          <el-input v-model="formData.use" placeholder="请输入用途" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="显示顺序" prop="sort">-->
<!--          <el-input-number v-model="formData.sort" :min="0" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="时间范围">-->
<!--          <el-date-picker-->
<!--            v-model="formData.timeRange"-->
<!--            type="daterange"-->
<!--            range-separator="-"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注" prop="remark">-->
<!--          <el-input v-model="formData.remark" type="textarea" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->

<!--      <template #footer>-->
<!--        <el-button @click="formVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="submitForm">提交</el-button>-->
<!--      </template>-->
<!--    </el-dialog>-->
<!--  </contentWrap>-->
  <!-- 表单弹窗：添加/修改 -->
<!--  <IkerForm ref="formRef" @success="getList" />-->
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { dateFormatter } from '@/utils/formatTime'
// import IkerForm from "@/views/system/Out/IkerForm.vue";
// import * as UserApi from '@/api/system/user'

// import * as OutBoundApi from '@/api/system/ex/index'

const { t } = useI18n()

const loading = ref(true)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  use: undefined,
  startTime: [] as string[],
})
const queryFormRef = ref()

/** 查询列表 */
// const getList = async () => {
//   loading.value = true
//   try {
//     // const data = await UserApi.getUserPage(queryParams)
//     const data = [];
//     list.value = data.list
//   } finally {
//     loading.value = false
//   }
// }

/** 搜索按钮操作 */
// const handleQuery = () => {
//   queryParams.pageNo = 1
//   getList()
// }

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(t('common.delConfirm'), t('common.reminder'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    })
    await UserApi.deleteUser(id)
    ElMessage.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 打开表单 */
const openForm = (type: string, id?: number) => {
  // 这里需要实现表单组件逻辑
  console.log('打开表单', type, id)
}



// 状态选项
// const statusOptions = [
//   { value: 1, label: '待审批' },
//   { value: 2, label: '已通过' },
//   { value: 3, label: '已拒绝' }
// ]
// // 新增以下类型定义
// interface FormData {
//   id?: number
//   name: string
//   use: string
//   sort: number
//   timeRange: string[]
//   remark: string
// }
//
// // 在setup()中添加以下变量
// const formVisible = ref(false)
// const formType = ref('')
// const formRef = ref()
// const formData = ref<FormData>({
//   name: '',
//   use: '',
//   sort: 0,
//   timeRange: [],
//   remark: ''
// })
//
// // 表单验证规则
// const formRules = reactive({
//   name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
//   use: [{ required: true, message: '用途不能为空', trigger: 'blur' }],
//   sort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }]
// })
//
// // 修改openForm方法
// const openForm = (type: string, row?: any) => {
//   formType.value = type
//   if (type === 'create') {
//     formData.value = {
//       name: '',
//       use: '',
//       sort: 0,
//       timeRange: [],
//       remark: ''
//     }
//   } else {
//     // 编辑逻辑（如果需要）
//   }
//   formVisible.value = true
// }
//
// // 新增提交方法
// const submitForm = async () => {
//   await formRef.value.validate()
//   try {
//     loading.value = true
//     // 构造请求参数
//     const params = {
//       ...formData.value,
//       startTime: formData.value.timeRange[0],
//       endTime: formData.value.timeRange[1]
//     }
//     delete params.timeRange
//
//     // 调用API（需要实现）
//     // await UserApi.createUser(params)
//     ElMessage.success('新增成功')
//     formVisible.value = false
//     await getList() // 刷新列表
//   } catch (error) {
//     console.error('新增失败', error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted( ()=>{
  getList();
})
</script>
