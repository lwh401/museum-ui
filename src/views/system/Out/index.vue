<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" inline>
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入标本名称" clearable />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="queryParams.number" placeholder="请输入标本编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="warning" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table :data="tableData" border>
      <el-table-column prop="number" label="编号" width="120" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="location" label="存放位置" />
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link @click="handlePermission(row)">权限</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getList"
      @current-change="getList"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标本名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标本名称" />
        </el-form-item>
        <el-form-item label="标本编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入标本编号" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入存放位置" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    number: 'SP-001',
    name: '植物标本',
    location: 'A区-1柜',
    image: 'https://via.placeholder.com/50',
    status: 1,
    createTime: '2024-03-01 10:00:00'
  }
])

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  number: ''
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  number: '',
  location: '',
  image: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  number: [{ required: true, message: '编号不能为空', trigger: 'blur' }]
}

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()

// 获取数据列表
const getList = async () => {
  // 这里调用API接口
  console.log('获取列表数据', queryParams)
}

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    pageNum: 1,
    name: '',
    number: ''
  })
  getList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增标本'
  Object.keys(form).forEach(key => (form[key] = ''))
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑标本'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该记录吗？', '警告', {
    type: 'warning'
  }).then(() => {
    // 调用删除API
    console.log('删除成功')
    getList()
  })
}

// 状态修改
const handleStatusChange = (row) => {
  ElMessage.success('状态修改成功')
  // 调用状态修改API
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // 调用新增/修改API
      dialogVisible.value = false
      ElMessage.success('操作成功')
      getList()
    }
  })
}

// 文件上传
const handleUploadSuccess = (response) => {
  form.image = response.url // 根据实际接口调整
}

// 初始化获取数据
getList()
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
