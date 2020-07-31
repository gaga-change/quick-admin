<template>
  <div id="app">
    <div class="container-ui">
      <h4>基本信息</h4>
      <BaseForm />
      <h4>数据结构</h4>
      <TableList />
    </div>
  </div>
</template>

<script>
import BaseForm from "./components/BaseForm";
import TableList from "./components/TableList";

export default {
  name: "App",
  components: {
    BaseForm,
    TableList
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
