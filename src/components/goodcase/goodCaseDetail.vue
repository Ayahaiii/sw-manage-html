<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;">
      <el-form-item label="案例名称" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" maxlength="6" />
      </el-form-item>
      <el-form-item label="案例类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="item in caseTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件" prop="url">
        <el-upload class="upload-demo" :action=uploadUrl :auto-upload=true multiple :limit="1" accept=".pdf" :on-exceed="onExceed"
          :on-success="uploadSuccess" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500kb</div>
        </el-upload>

      </el-form-item>
      <el-form-item label="案例标签" prop="tag">
        <el-input v-model="form.tag" />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input v-model="form.source" />
      </el-form-item>
      <el-form-item label="简介" prop="briefIntroduction">
        <el-input v-model="form.briefIntroduction" />
      </el-form-item>
      <el-form-item label="是否发布" prop="status">
        <el-switch v-model="form.status" :active-value=2 :inactive-value=1>
        </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="updateOrAdd == 2">确认提交</el-button>
        <el-button type="primary" @click="onUpdate" v-if="updateOrAdd == 1">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        uploadUrl: this.baseUrl + "/upload/pdf/upload", //上传地址
        fileList: [], //上传文件集合
        updateOrAdd: null, //1:update,2:add
        caseTypeList: [{
            id: 1,
            name: "个案实务"
          },
          {
            id: 2,
            name: "小组实务"
          },
          {
            id: 3,
            name: "社区实务"
          }
        ], //案例类型
        form: {
          id: null,
          title: null,
          author: null,
          type: 1,
          url: null,
          tag: null,
          source: null,
          briefIntroduction: null,
          status: 2,
        }, //提交表单
        formRules: {
          title: [{
              required: true,
              message: "案例名称不能为空",
              trigger: "blur"
            },
            {
              max: 10,
              message: "案例名称最大长度不能超过10位",
              trigger: "blur"
            },
          ],
          author: [{
            required: true,
            message: "作者不能为空",
            trigger: "blur"
          }, ],
          type: [{
            required: true,
            message: "类型不能为空",
            trigger: "change"
          }, ],
        }, //表单验证规则
      };
    },
    created() {
      this.loadData();
    },
    methods: {

      /**
       * 页面初始化加载数据
       */
      loadData() {
        //判断是修改还是新增
        var id = this.$route.query.id;
        if (null == id || id == "") {
          this.updateOrAdd = 2;
        } else {
          this.updateOrAdd = 1;
          var param = {
            id: id
          }
          this.httpPost("/goodcase/query", param).then((res) => {
            this.form = res.data;
            var arr = [{name:this.form.url,url:this.form.url}];
            this.fileList = arr;
          });
        }
      },

      /**
       * 新增精品案例
       */
      onSubmit: function () {
        if(this.form.url==null||this.form.url==""){
          this.$message({
            message: '请上传pdf',
            type: 'info'
          });
          return;
        }  
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.httpPost("/goodcase/add", this.form).then((res) => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.$router.push({
                path: "/index/goodCaseManage",
              });
            });
          }
        });
      },

      /**
       * 修改精品案例
       */
      onUpdate() {
        if(this.form.url==null||this.form.url==""){
          this.$message({
            message: '请上传pdf',
            type: 'info'
          });
          return;
        }
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.httpPost("/goodcase/update", this.form).then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$router.push({
                path: "/index/goodCaseManage",
              });
            });
          }
        });
      },

      /**
       * 上传的文件个数超出设定时触发的函数
       */
      onExceed(files, fileList) {
        this.$message({
          type: 'info',
          message: '只能上传一份pdf',
          duration: 6000
        });
      },

      /**
       *封面文件上传成功的钩子函数
       */
      uploadSuccess(res, file) {
        if (file.response.code == 0) {
          this.$message({
            type: 'info',
            message: '上传成功',
            duration: 6000
          });
          this.uploadLiveCoverUrl = file.response.data; //将返回的文件储存路径赋值coverUrl字段
          this.form.url = this.uploadLiveCoverUrl;
        }else {
          this.$message({
            message: file.response.message,
            type: 'info'
          });
        }
      },

    }
  };
</script>


<style scoped>

</style>
