<template>
  <ContentWrap>
    <!-- 搜索工具栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="标本编号" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入标本编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标本状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择标本状态"
        >
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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

        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />
          新建申请
        </el-button>
        <el-button
          v-hasPermi="['system:inner:export']"
          :loading="exportLoading"
          plain
          type="success"
          @click="handleExport"
        >
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="标本名称" prop="name" />
      <el-table-column align="center" label="开始日期" prop="startDate">
        <template #default="{ row }">
          {{ row.startDate ? dateFormatter(row.startDate) : 'N/A' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束日期" prop="endDate">
        <template #default="{ row }">
          {{ row.endDate ? dateFormatter(row.endDate) : 'N/A' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退还人" prop="returnUser" />
      <el-table-column align="center" label="点收人" prop="receiver" />
      <el-table-column align="center" label="标本编号" prop="code" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column :width="220" align="center" label="操作">
        <template #default="scope">
          <el-button
            v-hasPermi="['system:inner:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['system:inner:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 新增/编辑弹窗组件 -->
  <InnerForm ref="formRef" @success="getList" />

  <!-- 分页组件 -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
  />
</template>



<script setup lang="ts">

import { dateFormatter } from '@/utils/formatTime'

import InnerForm from './InnerForm.vue'
import RoleApi from '@/api/system/role'
// 本地模拟数据
const mockData = [
  {
    id: 1,
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    returnUser: '',
    receiver: '',
    sort: 1,
    status: 0,
    remark: '',
    createTime: ''
  },

]

// const loading = ref(false)
// const total = ref(0)
// const list = ref<any[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 查询列表（本地处理）
// const getList = async () => {
//   loading.value = true
//   try {
//     // 模拟过滤和分页
//     const filteredData = mockData.filter(item => {
//       const codeMatch = !queryParams.code || item.code.includes(queryParams.code)
//       const statusMatch = queryParams.status === undefined || item.status === queryParams.status
//       let dateMatch = true
//       if (queryParams.createTime && queryParams.createTime.length === 2) {
//         const itemDate = new Date(item.createTime).getTime()
//         const startDate = new Date(queryParams.createTime[0]).getTime()
//         const endDate = new Date(queryParams.createTime[1]).getTime()
//         dateMatch = itemDate >= startDate && itemDate <= endDate
//       }
//       return codeMatch && statusMatch && dateMatch
//     })
//
//     total.value = filteredData.length
//     const start = (currentPage.value - 1) * pageSize.value
//     const end = start + pageSize.value
//     list.value = filteredData.slice(start, end)
//   } finally {
//     loading.value = false
//   }
// }

// 删除处理
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    const index = mockData.findIndex(item => item.id === id)
    if (index !== -1) {
      mockData.splice(index, 1)
      message.success(t('common.delSuccess'))
      await getList()
    }
  } catch {}
}

// 导出处理（本地数据）
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    // 构造导出数据
    // const data = list.value.map(item => ({
    //   标本名称: item.name,
    //   标本编号: item.code,
    //   开始日期: item.startDate,
    //   结束日期: item.endDate,
    //   状态: item.status === 0 ? '启用' : '停用',
    //   创建时间: item.createTime
    // }))
    // download.excel(data, '标本列表.xls')
  } finally {
    exportLoading.value = false
  }
}
// 新建
const formRef = ref()
const openForm = (type:string, id?:number ) =>{
  formRef.value.open(type,id)

}
// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  getList()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getList()
}




/** 表单成功回调 */
// const handleFormSuccess = () => {
//   getList()
// }

onMounted(() => {
  getList()
})
</script>
