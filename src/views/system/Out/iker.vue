<template>
  <div class="role-management">
    <!-- 搜索区域 -->
    <el-card class="search-area">
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="searchForm.identifier" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="开启" value="1" />
            <el-option label="关闭" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-table :data="filteredRoles" border style="width: 100%">
      <el-table-column prop="id" label="角色编号" width="100" />
      <el-table-column prop="name" label="角色名称" width="150" />
      <el-table-column prop="type" label="角色类型" width="120" />
      <el-table-column prop="identifier" label="角色标识" width="180" />
      <el-table-column prop="order" label="显示顺序" width="100" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '开启' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleMenuAuth(row)">菜单权限</el-button>
          <el-button link type="primary" @click="handleDataAuth(row)">数据权限</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟数据
const roles = ref([
  {
    id: 101,
    name: '测试账号',
    type: '自定义',
    identifier: '测试',
    order: 0,
    remark: '',
    status: 1,
    createTime: '2021-01-06 13:49:35'
  },
  // 其他数据...
])

// 搜索表单
const searchForm = ref({
  name: '',
  identifier: '',
  status: ''
})

// 过滤后的数据
const filteredRoles = computed(() => {
  return roles.value.filter(role => {
    return (
      role.name.includes(searchForm.value.name) &&
      role.identifier.includes(searchForm.value.identifier) &&
      (searchForm.value.status === '' ||
        role.status.toString() === searchForm.value.status)
    )
  })
})

// 操作方法
const handleSearch = () => {
  // 搜索逻辑
}

const handleAdd = () => {
  // 新增逻辑
}

const handleExport = () => {
  // 导出逻辑
}

const handleEdit = (row) => {
  // 编辑逻辑
}

const handleMenuAuth = (row) => {
  // 菜单权限设置
}

const handleDataAuth = (row) => {
  // 数据权限设置
}

const handleDelete = (row) => {
  // 删除逻辑
}
</script>

<style scoped>
.search-area {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 0;
}

.el-table {
  margin-top: 20px;
}
</style>
