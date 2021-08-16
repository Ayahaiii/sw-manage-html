<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;" :disabled="disableValue">
      <el-form-item label="直播类型名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCourseTypeSubmit" v-if="indexType==1">确认提交</el-button>
        <el-button type="primary" @click="onCourseTypeUpdate" v-if="indexType==2">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        disableValue: false, //表单是否可以修改
        indexType: 1, //页面类型，1：新增，2：修改，3：查看
        form: {
          name: "",
        }, //提交表单
        formRules: {
          name: [{
              required: true,
              message: '请填写课程类型名称',
              trigger: 'blur'
            }
          ],
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
       
        //如果是修改
        var id = this.$route.query.id;
        var type = this.$route.query.type;
        if (id != null) {
          //查询直播类型详情
          var param = {
            id: id,
          }
          this.httpPost("/live/liveType/queryByLiveTypeId", param).then((res) => {
            this.form = res.data;
            this.indexType = type;
            if (type == 3) {
              this.disableValue = true;
            }
          });
        }
      },

      /** 
       * 提交直播类型
       */
      onCourseTypeSubmit: function () {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.httpPost("/live/liveType/add", this.form).then((res) => {
              this.$message({
                message: '新增直播类型成功！',
                type: 'success'
              });
              this.$router.push("/index/liveTypeManage");
            });
          }
        })
      },

      /**
       * 修改直播类型
       */
      onCourseTypeUpdate(){
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.form.id = this.$route.query.id;
            this.httpPost("/live/liveType/update", this.form).then((res) => {
              this.$message({
                message: '修改直播类型成功！',
                type: 'success'
              });
              this.$router.push("/index/liveTypeManage");
            });
          }
        })
      },

    }
  };
</script>


<style scoped>
  el-button{
    margin-left: 20px;
    margin-bottom: 30px;
  }

</style>
