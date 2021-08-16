<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;" :disabled="disableValue">
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
     <el-form-item label="金额" prop="amount">
        <el-input v-model="form.amount" />
      </el-form-item>
      <el-form-item label="过期时间" prop="expireTimeString">
        <el-input v-model="form.expireTimeString" />
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
          title: "",
          username: "",
          amount: 0,
          expireTimeString: "",
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
          //查询购买记录详情
          var param = {
            id: id,
          }
          this.httpPost("/video/vdBuyRecords/vdBuyRecordsQueryById", param).then((res) => {
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
