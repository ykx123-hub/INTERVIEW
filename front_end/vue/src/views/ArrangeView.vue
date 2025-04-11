<template>
  <div class="interview-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <el-menu default-active="1" class="el-menu-vertical-demo" router>
        <el-menu-item index="/arrange">
          <i class="el-icon-document"></i>
          <span>安排面试</span>
        </el-menu-item>
        <el-menu-item index="/room_info">
          <i class="el-icon-menu"></i>
          <router-link to="/room_info" style="text-decoration: none; color: inherit;">
          <span>面试管理</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <el-form
          ref="formRef"
          :model="form"
          label-width="120px"
          class="form-container"
      >
        <!-- 候选人信息 -->
        <div class="block">
          <h3>候选人信息</h3>
          <!-- 循环渲染每位候选人 -->
          <div
              v-for="(candidate, index) in form.candList"
              :key="index"
              class="candidate-item"
          >
            <el-form-item :label="'候选人 ' + (index + 1)">
              <div class="flatten_item">
                <el-input
                    class="short_input"
                    v-model="candidate.participantName"
                    placeholder="请输入候选人姓名"
                />
                <!-- 删除按钮 -->
                <el-button
                    type="danger"
                    :icon="Delete"
                    @click="removeCandidate(index)"
                >
                  删除
                </el-button>
              </div>
            </el-form-item>


          </div>
          <!-- 新增候选人按钮 -->
          <el-button
              type="primary"
              :icon="Plus"
              @click="addCandidate"
              plain
          >
            新增候选人
          </el-button>
        </div>

        <!-- 面试官信息 -->
        <div class="block">
          <h3>面试官信息</h3>
          <!-- 循环渲染每位面试官 -->
          <div
              v-for="(interviewer, idx) in form.hrList"
              :key="idx"
              class="interviewer-item"
          >

            <el-form-item :label="'面试官 ' + (idx + 1)">
              <div class="flatten_item">
                <el-input
                    class="short_input"
                    v-model="interviewer.participantName"
                    placeholder="请输入面试官姓名"
                />
                <el-button
                    type="danger"
                    :icon="Delete"
                    @click="removeInterviewer(idx)"
                >
                  删除
                </el-button>
              </div>
            </el-form-item>
          </div>
          <!-- 新增面试官按钮 -->
          <el-button
              type="primary"
              :icon="Plus"
              @click="addInterviewer"
              plain
          >
            新增面试官
          </el-button>
        </div>

        <!-- 面试基本信息 -->
        <div class="block">
          <h3>面试基本信息</h3>
          <el-form-item label="会议名称">
            <el-input v-model="form.roomName" placeholder="会议名称" />
          </el-form-item>

          <el-form-item label="职位名称">
            <el-input
                v-model="form.position"
                placeholder="应聘职位，如：前端开发工程师"
            />
          </el-form-item>

          <el-form-item label="面试环节">
            <el-input
                v-model="form.period"
                placeholder="面试环节，如：一面"
            />
          </el-form-item>

          <el-form-item label="面试时间">
            <el-date-picker
                v-model="form.time"
                type="datetime"
                placeholder="选择时间"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="MMM DD, YYYY"
                time-format="HH:mm"
            />
          </el-form-item>
        </div>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { Plus, Delete} from '@element-plus/icons-vue'
import {sendPost} from '@/api/http'
import { useRouter } from 'vue-router'

const hrName = "yyy"
const router = useRouter()

// 表单数据
const formRef = ref(null)
const form = ref({
  // 候选人列表
  candList: [
    {
      participantName: '',
    },
  ],
  // 面试官列表
  hrList: [
    {
      participantName: '',
    },
  ],
  // 面试基本信息
  position: '',
  period: '',
  roomName: '',
  // 面试时间
  time: '',
  // 当前操作的hr
  hrName: ''
})

// 新增候选人
function addCandidate() {
  form.value.candList.push({
    participantName: '',
  })
}

// 删除候选人
function removeCandidate(index) {
  form.value.candList.splice(index, 1)
}

// 新增面试官
function addInterviewer() {
  form.value.hrList.push({
    participantName: '',
  })
}

// 删除面试官
function removeInterviewer(idx) {
  form.value.hrList.splice(idx, 1)
}

// 判断数据类型
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

function isType(value, type) {
  return getType(value) === type.toLowerCase();
}

// 提交表单
async function handleSubmit() {
  // 检查是否选择面试时间
  if (!isType(form.value.time, "date")){
    alert("请选择面试时间！")
    return
  }

  // 将date转换为整数时间戳
  form.value.time = new Date(form.value.time).getTime()

  // 添加hrName
  form.value.hrName = hrName

  // 转字符串
  let newForm = convertForm(form);

  alert(newForm.hrList)

  // 向后端发送数据
  let data = await sendPost("/room/create", newForm)
  let temp = data.data.roomId + "/" + data.data.roomPwd
  alert(temp)

  // 处理后端返回数据，并向主系统后端发送请求，让主系统后端对面试者进行通知

  // 面试安排成功通知
  alert("面试安排成功！")

  // 跳转到面试管理界面
  await router.push({
    name: 'RoomInfo'
  })
}

function convertForm(form) {
  const newForm = { ...form.value };
  newForm.candList = newForm.candList.map(item => item.participantName).join(',');
  newForm.hrList = newForm.hrList.map(item => item.participantName).join(',');
  return newForm;
}

// 重置表单
function handleReset() {
  form.value = {
    candList: [
      {
        participantName: '',
      },
    ],
    hrList: [
      {
        participantName: '',
      },
    ],
    position: '',
    period: '',
    RoomName: '',
    time: '',
    hrName: ''
  }
}
</script>

<style scoped>
.interview-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧导航栏 */
.sidebar {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #dcdcdc;
  padding: 20px 0;
}

/* 右侧内容区 */
.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

/* 表单区域样式 */
.form-container {
  max-width: 800px;
}

/* 区块标题 */
.block {
  margin-bottom: 30px;
}

.block h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}

/* 候选人/面试官每条记录 */
.candidate-item,
.interviewer-item {
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.flatten_item {
  display: flex;
  gap: 20px;
}

.short_input {
  width: 200px;
}
</style>