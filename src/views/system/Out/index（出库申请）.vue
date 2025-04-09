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
      <el-form-item label="标本编号" prop="number">
        <el-input
          v-model="queryParams.number"
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
        <el-table-column align="center" label="申请单号" prop="id" width="100" />
        <el-table-column label="标本编号" align="center" prop="number" width="120" />

        <el-table-column label="申请单位" align="center" prop="applyUnit" width="120" />
        <el-table-column
          :formatter="dateFormatter2"
          align="center"
          label="退还时间"
          prop="returnExpect"
          width="180"
        />

        <el-table-column label="目的" align="center" prop="purpose" width="120" />





<!--        <el-table-column label="出库类型" align="center" prop="outType" width="120">-->
<!--          <template #default="scope">-->
<!--            <dict-tag :type="DICT_TYPE.SPECIMEN_OUT_TYPE" :value="scope.row.outType" />-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label="标本名称" align="center" prop="sampleName" width="120" />
        <el-table-column label="申请人" align="center" prop="applicant" width="120" />
<!--        <el-table-column label="申请数量" align="center" prop="quantity" width="100" />-->
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
        <el-table-column label="状态" align="center" prop="state" />
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
            <el-button
              v-hasPermi="['system:role:delete']"
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              审批
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
<!--  审批弹窗-->
<!--  <SpForm ref="formRef" @success="getList" />-->
</template>

<script lang="ts" setup>
import OutForm from './OutForm.vue'

// import ApproveForm from './approveForm.vue'
import * as OutBoundApi from '@/api/system/Out/index'
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";
import * as UserApi from "@/api/system/user";
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
  { value: 0, label: '在库（0）' },

  { value: 1, label: '已出库（1）' },
  { value: 2, label: '审批中（2）' },
  { value: 3, label: '审批通过（3）' },
  { value: 4, label: '审批驳回（4）' }
]

// 状态标签类型映射
// const statusTagMap = {
//   1: 'warning',
//   2: 'success',
//   3: 'danger'
// }


// 0在库，1已出库,2审批中，3审批通过，4审批驳回


// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  number:undefined,
  sampleName: undefined,
  status: undefined,
  applyTime: undefined
})
const queryFormRef = ref()
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
// const handleCommand = (command: string, row: UserApi.UserVO) => {
//   switch (command) {
//     case 'handleDelete':
//       handleDelete(row.id)
//       break








// 删除操作
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DeleteApi.deleteOut(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

onMounted( ()=>{
  getList();
})
</script>

