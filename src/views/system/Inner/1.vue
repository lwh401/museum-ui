<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" inline>
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="标本名称" clearable />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="queryParams.number" placeholder="标本编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
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
      <el-table-column prop="returnBy" label="退还人" width="120" />
      <el-table-column prop="returnTime" label="退还时间" width="180" />
      <el-table-column prop="receiver" label="点收人" width="120" />
      <el-table-column prop="status" label="回库状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已回库' ? 'success' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleConfirm(row)">确认回库</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="入库记录编辑">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="退还人" prop="returnBy">
          <el-input v-model="form.returnBy" placeholder="请输入退还人姓名" />
        </el-form-item>
        <el-form-item label="点收人" prop="receiver">
          <el-input v-model="form.receiver" placeholder="请输入点收人姓名" />
        </el-form-item>
        <el-form-item label="退还时间" prop="returnTime">
          <el-date-picker
            v-model="form.returnTime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const tableData = ref([
  {
    id: 1,
    number: 'RT-001',
    name: '矿石标本',
    location: 'B区-3柜',
    image: 'https://via.placeholder.com/50',
    returnBy: '张三',
    returnTime: '2024-03-01 14:30:00',
    receiver: '李四',
    status: '已入库',
    note: '包装完好'
  }
])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  number: ''
})

const form = reactive({
  id: null,
  returnBy: '',
  receiver: '',
  returnTime: '',
  note: ''
})

const rules = {
  returnBy: [{ required: true, message: '退还人不能为空', trigger: 'blur' }],
  receiver: [{ required: true, message: '点收人不能为空', trigger: 'blur' }]
}
</script>
