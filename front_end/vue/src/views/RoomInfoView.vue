<template>
  <div class="room-info-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <el-menu default-active="2" class="el-menu-vertical-demo" router>
        <el-menu-item index="/arrange">
          <i class="el-icon-document"></i>
          <span>安排面试</span>
        </el-menu-item>
        <el-menu-item index="/room_info">
          <i class="el-icon-menu"></i>
          <span>面试管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <h2>已安排的面试</h2>
      <el-table :data="interviews" style="width: 100%;">
        <el-table-column prop="roomId" label="会议号" width="120" />
        <el-table-column prop="roomName" label="会议名称" width="200" />
        <el-table-column prop="position" label="岗位" width="150" />
        <el-table-column prop="scheduledTime" label="开始时间" width="200" />
        <!-- 新增操作列 -->
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
                type="primary"
                size="small"
                @click="editInterview(scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
// import dayjs from 'dayjs'

const router = useRouter()
let hrName;
hrName = "yyy"

// 示例数据，实际项目中可从接口或 store 获取
const interviews = ref([])

onMounted(async() => {
  const params = new URLSearchParams();
  params.append('hrName', hrName);  // 将 hrName 添加为查询参数

  let response = await axios.get('http://127.0.0.1:6080' + `/room/get_all_rooms`, {params})
  interviews.value = response.data.data
})

// 编辑按钮点击处理函数
function editInterview(row) {
  router.push({
    name: 'Change',
    query: { data: JSON.stringify(row) }
  })
}
</script>

<style scoped>
.room-info-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #dcdcdc;
  padding: 20px 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

h2 {
  margin-bottom: 20px;
}
</style>
