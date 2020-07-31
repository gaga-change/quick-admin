<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      title="表字段"
    >
      <div>
        <el-button @click="hanldeAdd">新增字段</el-button>
      </div>
      <el-table :data="attrs" style="width: 100%">
        <el-table-column prop="name" label="字段名" width="90">
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="type" label="类型"> </el-table-column>
        <el-table-column prop="default" label="默认值"> </el-table-column>
        <el-table-column prop="trim" label="左右去空格">
          <template slot-scope="scope">
            <span>{{ scope.row.trim ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填">
          <template slot-scope="scope">
            <span>{{ scope.row.required ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-link @click="handleDel(scope.$index)" type="warning"
              >删除</el-link
            >
            <el-divider direction="vertical" />
            <el-link
              type="primary"
              @click="handleModify(scope.row, scope.$index)"
              >编辑</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <AttrFormDialog
      :visible.sync="dialogVisible"
      ref="tableForm"
      @submit="addRow"
    />
  </div>
</template>
<script>
import AttrFormDialog from "./AttrFormDialog";
export default {
  inheritAttrs: false,
  components: { AttrFormDialog },
  props: {
    attrs: {
      type: Array
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    hanldeAdd() {
      this.dialogVisible = true;
      this.$refs["tableForm"].setData({
        name: undefined,
        type: "String",
        title: undefined,
        default: undefined,
        trim: false,
        required: false
      });
    },
    addRow(row) {
      if (row.modify) {
        const index = row.index;
        this.attrs.splice(index, 1, row);
      } else {
        this.attrs.push(row);
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
          this.attrs.splice(index, 1);
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
<style></style>
