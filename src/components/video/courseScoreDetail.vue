<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;" :disabled="disableValue">
      <el-form-item label="课程名称" prop="courseTitle">
        <el-input v-model="form.courseTitle" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
       <el-form-item label="分数" prop="score">
        <el-input v-model="form.score" />
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
        form:{
          courseTitle: "",
          username: "",
          score: "",
        },
      }
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
          //查询笔记详情
          var param = {
            id: id,
          }
          this.httpPost("/video/courseScore/queryCourseScoreId", param).then((res) => {
            this.form = res.data;
            this.indexType = type;
            if (type == 3) {
              this.disableValue = true;
            }
          });
        }
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
