<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="项目路径" prop="dirPath">
        <el-input
          v-model="formData.dirPath"
          placeholder="请输入项目路径"
          clearable
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
      <el-form-item label="MongoDB连接地址" prop="mongoLink">
        <el-input
          v-model="formData.mongoLink"
          placeholder="请输入MongoDB连接地址"
          clearable
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
      <el-form-item label="管理员名称" prop="adminName">
        <el-input
          v-model="formData.adminName"
          placeholder="请输入管理员名称"
          clearable
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        dirPath: "C:\\Users\\11724\\Desktop",
        mongoLink: "mongodb://localhost/test",
        adminName: "admin"
      },
      rules: {
        dirPath: [
          {
            required: true,
            message: "请输入项目路径",
            trigger: "blur"
          }
        ],
        mongoLink: [
          {
            required: true,
            message: "请输入MongoDB连接地址",
            trigger: "blur"
          }
        ],
        adminName: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    setData(data) {
      this.formData = data;
    },
    submitForm(cb) {
      this.$refs["elForm"].validate(valid => {
        if (!valid) {
          cb("err", { ...this.formData });
        } else {
          cb(null, { ...this.formData });
        }
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  }
};
</script>
<style></style>
