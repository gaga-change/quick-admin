<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      title="字段信息"
    >
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="mini"
        label-width="100px"
      >
        <el-form-item label="字段名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="字段名"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="type">
          <el-radio-group v-model="formData.type" size="medium">
            <el-radio
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.value"
              :disabled="item.disabled"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入标题"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="default">
          <el-input
            v-model="formData.default"
            placeholder="请输入默认值"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="trim" prop="trim">
          <el-switch v-model="formData.trim"></el-switch>
        </el-form-item>
        <el-form-item label="必填" prop="required">
          <el-switch v-model="formData.required"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        name: undefined,
        type: "String",
        title: undefined,
        default: undefined,
        trim: false,
        required: false
      },
      rules: {
        name: [
          {
            required: true,
            message: "字段名",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "字段类型不能为空",
            trigger: "change"
          }
        ],
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        default: []
      },
      typeOptions: [
        {
          label: "字符串",
          value: "String"
        },
        {
          label: "数字",
          value: "Number"
        },
        {
          label: "布尔",
          value: "Boolean"
        },
        {
          label: "关联文档ID",
          value: "ObjectId"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    setData(data) {
      this.$nextTick(() => {
        this.formData = data;
      });
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        this.$emit("submit", { ...this.formData });
        this.close();
      });
    }
  }
};
</script>
<style></style>
