<template>
  <div>
    <el-button @click="addTable">添加表</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="表名" width="180"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link @click="handleDel(scope.$index)" type="warning"
            >删除</el-link
          >
          <el-divider direction="vertical" />
          <el-link
            @click="
              attrs = scope.row.attrs;
              attrListDialogVisible = true;
            "
            type="primary"
            >字段列表</el-link
          >
          <el-divider direction="vertical" />
          <el-link type="primary" @click="handleModify(scope.row, scope.$index)"
            >编辑</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <AddTableFromDialog
      :visible.sync="dialogVisible"
      @submit="addRow"
      ref="tableForm"
    />
    <AttrListDialog :visible.sync="attrListDialogVisible" :attrs="attrs" />
  </div>
</template>

<script>
import AddTableFromDialog from "./AddTableFromDialog";
import AttrListDialog from "./AttrListDialog";
export default {
  components: { AddTableFromDialog, AttrListDialog },
  data() {
    return {
      attrs: [],
      dialogVisible: false,
      attrListDialogVisible: false,
      tableData: []
    };
  },
  methods: {
    setData(tableData) {
      this.tableData = tableData;
    },
    addTable() {
      this.dialogVisible = true;
      this.$refs["tableForm"].setData({
        name: undefined,
        title: undefined,
        attrs: []
      });
    },
    addRow(row) {
      if (row.modify) {
        const index = row.index;
        this.tableData.splice(index, 1, row);
      } else {
        this.tableData.push(row);
      }
    },
    handleModify(row, index) {
      this.dialogVisible = true;
      this.$refs["tableForm"].setData({ ...row, modify: true, index });
    },
    handleDel(index) {
      this.$confirm("此操作将永久删除该表信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less"></style>
