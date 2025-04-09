<template>
  <ContentWrap>
  <!-- 搜索栏 -->
<el-form
  class="-mb-15px"
  :model="queryParams"
  ref="queryFormRef"
  :inline="true"
  label-width="100px"
>
  <el-form-item label="标本编号" prop="number">
    <el-input
      v-model="queryParams.number"
      placeholder="请输入编号"
      clearable
      @keyup.enter="handleQuery"
      class="!w-240px"
    />
  </el-form-item>
  <el-form-item label="入库时间" prop="returnTime">
<el-date-picker
  v-model="queryParams.returnTime"
  range-separator="-"
  placeholder="入库时间"
  />
  </el-form-item>
  <el-form-item>
    <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
    <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
                <el-button
                  type="primary"
                  plain
                  @click="openForm('create')"
                >
                  <Icon icon="ep:plus" /> 新增
                </el-button>
  </el-form-item>
</el-form>
</contentwrap>
<!-- 数据表格 -->
<ContentWrap>
<el-table v-loading="loading" :data="list">
  <el-table-column label="申请单号" align="center" prop="id" />
  <el-table-column label="标本编号" align="center" prop="number" />
  <el-table-column label="标本名称" align="center" prop="name" />
  <el-table-column label="入库时间" align="center" prop="returnTime" />
  <el-table-column label="退换人" align="center" prop="returnPerson" />
  <el-table-column label="点收人" align="center" prop="receivePerson" />
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
  <InnerForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import InnerForm from './InnerForm.vue'
import * as OutBoundApi from '@/api/system/In/index'
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  number:undefined,
  sampleName: undefined,
  applyTime: undefined
})
const queryFormRef = ref()
const loading = ref(false)
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
onMounted( ()=>{
  getList();
})
</script>
