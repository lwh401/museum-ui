<template>
  <div class="in-request-page">
    <h1>标本入库申请</h1>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input v-model="searchForm.name" placeholder="名称" />
      <input v-model="searchForm.number" placeholder="编号" />
      <button @click="search">搜索</button>
      <button @click="resetSearch">重置</button>
      <button @click="exportData">导出</button>
    </div>

    <!-- 数据表格 -->
    <table class="data-table">
      <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>存放位置</th>
        <th>图片</th>
        <th>退还人</th>
        <th>退还时间</th>
        <th>点收人</th>
        <th>回库状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredData" :key="item.id">
        <td>{{ item.number }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.location }}</td>
        <td>
          <img :src="item.image" alt="标本图片" class="specimen-image" />
        </td>
        <td>{{ item.returner }}</td>
        <td>{{ item.returnTime }}</td>
        <td>{{ item.receiver }}</td>
        <td>
          <span :class="`status ${item.status}`">{{ item.status }}</span>
        </td>
        <td>
          <button @click="confirmReturn(item.id)">确认回库</button>
          <button @click="editItem(item)">编辑</button>
          <button @click="deleteItem(item.id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 入库申请弹窗 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>入库申请表单</h2>
        <div>
          <label>申请人：</label>
          <input v-model="requestForm.applicant" placeholder="申请人" />
        </div>
        <div>
          <label>申请时间：</label>
          <input v-model="requestForm.applyTime" type="date" />
        </div>
        <div>
          <label>标本名称：</label>
          <input v-model="requestForm.specimenName" placeholder="标本名称" />
        </div>
        <div>
          <label>标本编号：</label>
          <input v-model="requestForm.specimenNumber" placeholder="标本编号" />
        </div>
        <div>
          <label>用途：</label>
          <input v-model="requestForm.purpose" placeholder="用途" />
        </div>
        <div>
          <label>附件：</label>
          <input type="file" @change="handleFileUpload" />
        </div>
        <div>
          <button @click="submitRequest">提交</button>
          <button @click="closeModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 提交申请按钮 -->
    <button class="submit-button" @click="openRequestModal">提交入库申请</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'InRequest',
  setup() {
    // 搜索表单
    const searchForm = ref({
      name: '',
      number: '',
    });

    // 入库申请表单
    const showModal = ref(false);
    const requestForm = ref({
      applicant: '',
      applyTime: '',
      specimenName: '',
      specimenNumber: '',
      purpose: '',
      attachment: null,
    });

    // 数据列表
    const data = ref([
      {
        id: 1,
        number: 'RT-001 系列',
        name: '矿石标本',
        location: 'B区-3柜',
        image: 'https://via.placeholder.com/50', // 替换为实际图片链接
        returner: '张三',
        returnTime: '2024-03-01 14:30:00',
        receiver: '李四',
        status: '已入库',
      },
      {
        id: 2,
        number: 'RT-002 系列',
        name: '矿石标本',
        location: 'B区-4柜',
        image: 'https://via.placeholder.com/50', // 替换为实际图片链接
        returner: '王五',
        returnTime: '2024-03-02 15:45:00',
        receiver: '赵六',
        status: '待审核',
      },
    ]);

    // 过滤数据
    const filteredData = computed(() => {
      return data.value.filter((item) =>
        `${item.name}${item.number}`.includes(`${searchForm.value.name}${searchForm.value.number}`)
      );
    });

    // 搜索
    const search = () => {
      console.log('搜索中...');
    };

    // 重置搜索
    const resetSearch = () => {
      searchForm.value = { name: '', number: '' };
    };

    // 导出数据
    const exportData = () => {
      console.log('导出数据...');
    };

    // 打开入库申请弹窗
    const openRequestModal = () => {
      showModal.value = true;
    };

    // 关闭弹窗
    const closeModal = () => {
      showModal.value = false;
      requestForm.value = {
        applicant: '',
        applyTime: '',
        specimenName: '',
        specimenNumber: '',
        purpose: '',
        attachment: null,
      };
    };

    // 提交入库申请
    const submitRequest = () => {
      const newRequest = {
        id: data.value.length + 1,
        ...requestForm.value,
        status: '待审核',
      };
      data.value.push(newRequest);
      closeModal();
    };

    // 确认回库
    const confirmReturn = (id) => {
      const index = data.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        data.value[index].status = '已入库';
      }
    };

    // 编辑数据
    const editItem = (item) => {
      console.log('编辑', item);
    };

    // 删除数据
    const deleteItem = (id) => {
      data.value = data.value.filter((item) => item.id !== id);
    };

    // 文件上传
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        requestForm.value.attachment = URL.createObjectURL(file);
      }
    };

    return {
      searchForm,
      showModal,
      requestForm,
      data,
      filteredData,
      search,
      resetSearch,
      exportData,
      openRequestModal,
      closeModal,
      submitRequest,
      confirmReturn,
      editItem,
      deleteItem,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
.in-request-page {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.search-bar button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.status.已入库 {
  background-color: #4caf50;
}

.status.待审核 {
  background-color: #ff9800;
}

.specimen-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-content div {
  margin-bottom: 10px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.modal-content button {
  margin-right: 10px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
