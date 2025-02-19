<template>
  <div>
    <!-- 搜索栏 -->
    <el-input
      v-model="searchQuery"
      placeholder="输入申请人、标本名称或编号"
      style="width: 300px; margin-bottom: 20px"
      @input="handleSearch"
    />

    <!-- 出库申请列表 -->
    <el-table :data="filteredData" border>
      <el-table-column prop="applicant" label="申请人" />
      <el-table-column prop="requestTime" label="申请时间" />
      <el-table-column prop="specimenName" label="标本名称" />
      <el-table-column prop="specimenNumber" label="标本编号" />
      <el-table-column prop="purpose" label="用途" />
      <el-table-column prop="status" label="审核状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleReview(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审核弹窗 -->
    <el-dialog v-model="showDialog" title="审核出库申请">
      <p>申请人: {{ selectedRecord?.applicant }}</p>
      <p>标本名称: {{ selectedRecord?.specimenName }}</p>
      <p>标本编号: {{ selectedRecord?.specimenNumber }}</p>
      <p>用途: {{ selectedRecord?.purpose }}</p>
      <el-input
        v-if="isRejecting"
        v-model="rejectReason"
        placeholder="请输入驳回原因"
        style="margin-top: 20px"
      />
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
        <el-button type="primary" @click="handleApprove">通过</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const data = ref([
  {
    id: 1,
    applicant: '用户A',
    requestTime: '2025-01-01',
    specimenName: '标本1',
    specimenNumber: '001',
    purpose: '实验',
    status: '待审核',
  },
  {
    id: 2,
    applicant: '用户B',
    requestTime: '2025-01-01',
    specimenName: '标本2',
    specimenNumber: '002',
    purpose: '研究',
    status: '待审核',
  },
]);

// 搜索关键字
const searchQuery = ref('');

// 过滤后的数据
const filteredData = computed(() => {
  return data.value.filter(
    (item) =>
      item.applicant.includes(searchQuery.value) ||
      item.specimenName.includes(searchQuery.value) ||
      item.specimenNumber.includes(searchQuery.value)
  );
});

// 审核弹窗相关状态
const showDialog = ref(false);
const selectedRecord = ref(null);
const rejectReason = ref('');
const isRejecting = ref(false);

// 打开审核弹窗
const handleReview = (row) => {
  selectedRecord.value = row;
  showDialog.value = true;
  isRejecting.value = false; // 重置驳回状态
  rejectReason.value = ''; // 清空驳回原因
};

// 通过审核
const handleApprove = () => {
  selectedRecord.value.status = '已通过';
  showDialog.value = false;
  console.log('通过申请:', selectedRecord.value);
};

// 驳回审核
const handleReject = () => {
  if (!isRejecting.value) {
    isRejecting.value = true; // 显示驳回原因输入框
    return;
  }
  if (!rejectReason.value) {
    alert('请输入驳回原因');
    return;
  }
  selectedRecord.value.status = '已驳回';
  console.log('驳回原因:', rejectReason.value);
  showDialog.value = false;
};
</script>
