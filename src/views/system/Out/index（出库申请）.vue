<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="标本编号" prop="id">
        <el-input
          v-model="queryParams.id"
          class="!w-240px"
          placeholder="请输入标本编号"
        />
      </el-form-item>
      <el-form-item label="标本名称" prop="sampleName">
        <el-input
          v-model="queryParams.sampleName"
          class="!w-240px"
          placeholder="请输入标本名称"
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
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker
          v-model="queryParams.applyTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="!w-340px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />
          新建申请
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
<!--  列表-->
  <ContentWrap>
      <el-table v-loading="loading" :data="list">
<!--        <el-table-column align="center" label="标本编号" prop="id" width="100" />-->
        <el-table-column label="标本编号" align="center" prop="number" width="120" />

        <el-table-column label="申请单位" align="center" prop="applyUnit" width="120" />
        <el-table-column label="退还时间" align="center" prop="returnExpect" width="120" />

        <el-table-column label="目的" align="center" prop="purpose" width="120" />





<!--        <el-table-column label="出库类型" align="center" prop="outType" width="120">-->
<!--          <template #default="scope">-->
<!--            <dict-tag :type="DICT_TYPE.SPECIMEN_OUT_TYPE" :value="scope.row.outType" />-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label="标本名称" align="center" prop="sampleName" width="120" />
        <el-table-column label="申请人" align="center" prop="applicant" width="120" />
        <el-table-column label="申请数量" align="center" prop="quantity" width="100" />
<!--        <el-table-column label="申请时间" align="center" prop="applyTime" width="180">-->
<!--          <template #default="scope">-->
<!--            {{ dateFormatter(scope.row.applyTime) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="状态" align="center" prop="status" width="100">-->
<!--          <template #default="scope">-->
<!--            <dict-tag :type="DICT_TYPE.SPECIMEN_OUT_STATUS" :value="scope.row.status" />-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPermi="['system:role:delete']"
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    <!-- 分页 -->
    <Pagination
      :page="queryParams.pageNo"
      :limit="queryParams.pageSize"
      :total="total"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <OutForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import OutForm from './OutForm.vue'

// import ApproveForm from './approveForm.vue'
import * as OutBoundApi from '@/api/system/Out/index'
// import * as UserApi from "@/api/system/user";
// 模拟数据
// const mockData = [
//   {
//     applyNo: '0',
//     sampleName: '0',
//     applicant: '0',
//     applyTime: '0',
//     quantity: 0,
//     status: 0
//   },
//   {
//     applyNo: '1',
//     sampleName: '1',
//     applicant: '1',
//     applyTime: '1',
//     quantity: 1,
//     status: 1
//   },
//
// ]

// 状态选项
const statusOptions = [
  { value: 1, label: '待审批' },
  { value: 2, label: '已通过' },
  { value: 3, label: '已拒绝' }
]

// 状态标签类型映射
const statusTagMap = {
  1: 'warning',
  2: 'success',
  3: 'danger'
}
const queryFormRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  sampleName: undefined,
  status: undefined,
  applyTime: undefined
})

const loading = ref(false)
// const total = ref(mockData.length)

const list = ref([])
const total = ref()
const getList = async () => {
  loading.value = true
  try {
    const data = await OutBoundApi.getPage(queryParams)
    console.log(data,'1')
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}


// 搜索处理
const handleQuery = () => {
  queryParams.pageNo = 1
  console.log(queryParams,'搜索时')
  getList()
}

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 新建申请
const formRef = ref()
const openForm = (type:string, id?:number ) =>{
  formRef.value.open(type,id)

}

// 编辑操作
// const handleEdit = (row: any) => {
//   ElMessage.info(`编辑申请 ${row.applyNo}`)
// }

// 审批操作
// const handleApprove = (row: any) => {
//   ElMessageBox.confirm(`确认审批申请 ${row.applyNo}?`, '提示', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(() => {
//     ElMessage.success('审批操作成功')
//   })
// }

// 删除操作
// const handleDelete = (row: any) => {
//   ElMessageBox.confirm(`确认删除申请 ${row.applyNo}?`, '警告', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'error'
//   }).then(() => {
//     ElMessage.success('删除成功')
//   })
// }
// const showApproveForm = ref(false)
// const showOutForm = ref(false)

onMounted( ()=>{
  getList();
})
</script>

