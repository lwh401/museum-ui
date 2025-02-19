<template>
  <div>
    <el-input v-model="searchQuery" placeholder="输入名称、编号或存放位置" style="width: 300px; margin-bottom: 20px" @input="handleSearch" />
    <el-table :data="filteredData" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="number" label="编号" />
      <el-table-column prop="location" label="存放位置" />
      <el-table-column label="图片">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="returnBy" label="退还人" />
      <el-table-column prop="returnTime" label="退还时间" />
      <el-table-column prop="receiver" label="点收人" />
      <el-table-column prop="note" label="备注" />
      <el-table-column prop="status" label="标本情况" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleReturn(row)">入库</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const data = ref([
  { id: 1, name: '标本1', number: '001', location: 'A1', image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.r6v8jNnunKolS8G2Yt1PGAHaE7?rs=1&pid=ImgDetMain', returnBy: '用户A', returnTime: '2023-10-01', receiver: '管理员', note: '完好', status: '正常' },
  { id: 2, name: '标本2', number: '002', location: 'B2', image: 'https://img.redocn.com/sheying/20180223/sanyechonghuashibiaoben_9213393.jpg', returnBy: '用户B', returnTime: '2023-10-02', receiver: '管理员', note: '轻微损坏', status: '需修复' },
]);

const searchQuery = ref('');

const filteredData = computed(() => {
  return data.value.filter(item =>
    item.name.includes(searchQuery.value) ||
    item.number.includes(searchQuery.value) ||
    item.location.includes(searchQuery.value)
  );
});

const handleReturn = (row) => {
  console.log('入库标本:', row);
};
</script>
