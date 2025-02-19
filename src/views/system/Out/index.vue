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
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleOutbound(row)">出库</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const data = ref([
  { id: 1, name: '动物标本-001', number: '001', location: ' A1-0001', image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.r6v8jNnunKolS8G2Yt1PGAHaE7?rs=1&pid=ImgDetMain' },
  { id: 2, name: '化石标本-001', number: '001', location: ' B2-0001', image: 'https://img.redocn.com/sheying/20180223/sanyechonghuashibiaoben_9213393.jpg' },
]);

const searchQuery = ref('');

const filteredData = computed(() => {
  return data.value.filter(item =>
    item.name.includes(searchQuery.value) ||
    item.number.includes(searchQuery.value) ||
    item.location.includes(searchQuery.value)
  );
});

const handleOutbound = (row) => {
  console.log('出库标本:', row);
};
</script>
