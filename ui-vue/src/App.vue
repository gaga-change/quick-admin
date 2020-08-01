<template>
  <div id="app">
    <div class="container-ui" v-loading="loading">
      <h4>基本信息</h4>
      <BaseForm ref="baseForm" />
      <h4>数据结构</h4>
      <TableList ref="tableList" />
      <div style="margin-top: 20px; float: right">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseForm from "./components/BaseForm";
import TableList from "./components/TableList";
import axios from "axios";
export default {
  name: "App",
  components: {
    BaseForm,
    TableList
  },
  data() {
    return {
      loading: true
    };
  },
  created() {
    axios.get("/config").then(res => {
      this.loading = false;
      const {
        dirPath = "",
        mongoLink = "",
        adminName = "",
        tableList = []
      } = res.data;
      this.$refs["baseForm"].setData({ dirPath, mongoLink, adminName });
      this.$refs["tableList"].setData(tableList);
    });
  },
  methods: {
    handleSave() {
      this.$refs["baseForm"].submitForm(data => {
        const tableList = this.$refs["tableList"].tableData;
        this.loading = true;
        axios.post("/config", { ...data, tableList }).then(() => {
          this.loading = false;
        });
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
