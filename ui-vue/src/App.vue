<template>
  <div id="app">
    <div class="container-ui" v-loading="loading">
      <h4>基本信息 {{ws && ws.readyState}}</h4>
      <div v-if="readyState === 0">连接中</div>
      <div v-if="readyState === 1">已连接</div>
      <div v-if="readyState === 2">关闭中</div>
      <div v-if="readyState === 3">未连接</div>
      <BaseForm ref="baseForm" />
      <h4>数据结构</h4>
      <TableList ref="tableList" />
      <div style="margin-top: 20px; float: right">
        <el-button type="primary" :disabled="readyState !== 3" @click="connect">连接</el-button>
        <el-button type="primary" :disabled="readyState !== 1" @click="closeSocket">断开连接</el-button>
        <el-button type="primary" :disabled="readyState !== 1" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseForm from "./components/BaseForm";
import TableList from "./components/TableList";
const parseMsgToObject = msg => {
  try {
    return JSON.parse(msg);
  } catch (err) {
    return msg;
  }
};

export default {
  name: "App",
  components: {
    BaseForm,
    TableList
  },
  data() {
    return {
      ws: null,
      readyState: 2,
      connecting: false,
      connected: false
    };
  },
  computed: {
    loading() {
      return this.readyState === 0 || this.readyState === 2;
    }
  },
  created() {
    this.connect();
  },
  methods: {
    closeSocket() {
      if (this.ws) {
        this.ws.close();
      }
    },
    emit(event, data) {
      if (this.ws) {
        this.ws.send(JSON.stringify({ event, payload: data }));
      }
    },
    connect() {
      const _up = () => (this.readyState = this.ws.readyState);
      if (this.ws) {
        this.ws.close();
      }
      this.connecting = true;
      this.ws = new WebSocket(`ws://localhost:9191/ws`);
      _up();
      this.ws.onerror = () => {
        this.$message.error("连接失败，检查地址是否正确、项目是否启动！");
      };
      this.ws.onmessage = messageEvent => {
        const data = parseMsgToObject(messageEvent.data);
        if (typeof data === "object") {
          console.log(data);
          if (data.event === "config update" || data.event === "get config") {
            const {
              dirPath = "",
              mongoLink = "",
              adminName = "",
              tableList = []
            } = data.payload;
            this.$refs["baseForm"].setData({ dirPath, mongoLink, adminName });
            this.$refs["tableList"].setData(tableList);
          }
        } else {
          console.error("未正常解析消息");
        }
      };
      this.ws.onopen = () => {
        _up();
        this.emit("get config");
      };
      this.ws.onclose = () => {
        _up();
      };
    },
    handleSave() {
      this.$refs["baseForm"].submitForm(data => {
        const tableList = this.$refs["tableList"].tableData;
        this.emit("save config", { ...data, tableList });
      });
    }
  }
};
</script>

<style lang="less">
.container-ui {
  max-width: 860px;
  padding: 20px;
  margin: auto;
}
</style>
