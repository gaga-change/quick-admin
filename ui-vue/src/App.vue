<template>
  <div id="app">
    <div class="container-ui">
      <div :style="{visibility: socketAddressDialogVisible ?'hidden': 'visible'}">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="base">
            <BaseForm ref="baseForm" />
          </el-tab-pane>
          <el-tab-pane label="数据结构" name="tables">
            <TableList ref="tableList" />
          </el-tab-pane>
        </el-tabs>
        <!-- <div v-if="readyState === 0">连接中</div>
        <div v-if="readyState === 1">已连接</div>
        <div v-if="readyState === 2">关闭中</div>
        <div v-if="readyState === 3">未连接</div>-->
        <div style="margin-top: 20px; float: right">
          <!-- <el-button type="primary" :disabled="readyState !== 3" @click="connect">连接</el-button> -->
          <el-button type="primary" :disabled="readyState !== 1" @click="closeSocket">断开连接</el-button>
          <el-button
            type="primary"
            :loading="saveLoading"
            :disabled="readyState !== 1"
            @click="handleSave"
          >保存</el-button>
        </div>
      </div>
    </div>
    <SocketAddressDialog
      :readyState="readyState"
      :visible.sync="socketAddressDialogVisible"
      @connect="handleConnect"
    />
  </div>
</template>

<script>
import BaseForm from "./components/BaseForm";
import TableList from "./components/TableList";
import SocketAddressDialog from "./components/SocketAddressDialog";
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
    TableList,
    SocketAddressDialog
  },
  data() {
    return {
      ws: null,
      saveLoading: false,
      // socketAddressDialogVisible: false,
      activeName: sessionStorage.getItem("tabe_key") || "base",
      readyState: 2,
      connecting: false,
      connected: false
    };
  },
  computed: {
    loading() {
      return this.readyState === 0 || this.readyState === 2;
    },
    socketAddressDialogVisible() {
      return this.readyState !== 1;
    }
  },
  watch: {
    socketAddressDialogVisible(val) {
      console.log("socketAddressDialogVisible ", val);
    },
    readyState(val) {
      console.log("readyState ", val);
    }
  },
  mounted() {
    // this.connect();
  },
  methods: {
    handleClick(tab) {
      sessionStorage.setItem("tabe_key", tab.name);
    },
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
    handleConnect(url) {
      this.connect(url);
    },
    connect(url) {
      const _up = () => (this.readyState = this.ws.readyState);
      if (this.ws) {
        this.ws.close();
      }
      this.connecting = true;
      this.ws = new WebSocket(url);
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
          if (data.event === "save config success") {
            this.saveLoading = false;
            this.$message.success("保存成功！");
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
      this.$refs["baseForm"].submitForm((err, data) => {
        if (err) {
          this.activeName = "base";
          return;
        }
        const tableList = this.$refs["tableList"].tableData;
        this.emit("save config", { ...data, tableList });
        this.saveLoading = true;
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
