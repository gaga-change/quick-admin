<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="项目连接"
    >
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="域名" prop="domain">
          <el-input
            v-model="formData.domain"
            placeholder="请输入域名"
            :maxlength="11"
            show-word-limit
            clearable
            prefix-icon="el-icon-mobile"
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="formData.port" placeholder="端口" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :loading="readyState === 0" @click="handelConfirm">连 接</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const cacheHost = "CACHE_ADDRESS_HOST";
const cachePort = "CACHE_ADDRESS_PORT";
export default {
  inheritAttrs: false,
  components: {},
  props: {
    readyState: {
      type: Number
    }
  },
  data() {
    return {
      formData: {
        domain: "localhost",
        port: 9191
      },
      rules: {
        domain: [
          {
            required: true,
            message: "请输入域名",
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "端口",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    let port = localStorage.getItem(cachePort);
    let host = localStorage.getItem(cacheHost);
    if (port) {
      this.formData.port = port;
    }
    if (host) {
      this.formData.domain = host;
    }
  },
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      localStorage.setItem(cachePort, this.formData.port);
      localStorage.setItem(cacheHost, this.formData.domain);
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        this.$emit(
          "connect",
          `ws://${this.formData.domain}:${this.formData.port}/ws`
        );
        // this.close();
      });
    }
  }
};
</script>
<style>
</style>
