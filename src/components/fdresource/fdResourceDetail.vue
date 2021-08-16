<template>
  <div class="app-container">
    <el-form ref="form" :disabled="disableValue" :model="form" :rules="formRules" label-width="120px" style="width: 600px;">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" maxlength="100" />
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <el-input v-model="form.principal" maxlength="11" />
      </el-form-item>
      <el-form-item label="案例类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮件地址" prop="email">
        <el-input v-model="form.email" maxlength="11" />
      </el-form-item>
      <el-form-item label="网站地址" prop="webUrl">
        <el-input v-model="form.webUrl" maxlength="50" />
      </el-form-item>
      <el-form-item label="成立时间" prop="setUpTime">
        <el-date-picker v-model="form.setUpTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="orgCode">
        <el-input v-model="form.orgCode" maxlength="100" />
      </el-form-item>
      <el-form-item label="注册资本" prop="capital">
        <el-input v-model="form.capital" maxlength="11" />
      </el-form-item>
      <el-form-item label="经营范围" prop="businessScope">
        <el-input type="textarea" :rows="10" v-model="form.businessScope" />
      </el-form-item>
      <el-form-item label="机构简介" prop="description">
        <el-input type="textarea" :rows="10" v-model="form.description" />
      </el-form-item>

      <el-form-item>
        <!-- <el-button type="primary" @click="onSubmit" v-if="updateOrAdd == 2">确认提交</el-button> -->
        <el-button type="primary" @click="onUpdate" v-if="updateOrAdd == 1 && !disableValue">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        disableValue: false,
        updateOrAdd: null, //1:update,2:add
        typeList: [{
          id: 1,
          name: "政府机关"
        }, {
          id: 2,
          name: "公益企业"
        }, {
          id: 3,
          name: "公益机构"
        }, {
          id: 4,
          name: "学校"
        }, {
          id: 5,
          name: "医院"
        }, {
          id: 6,
          name: "活动中心"
        }, {
          id: 7,
          name: "服务站"
        }, {
          id: 8,
          name: "其他"
        }], //机构类型集合
        form: {
          id: null,
          name: null,
          address: null,
          type: null,
          phone: null,
          setUpTime: null,
          businessScope: null,
          orgCode: null,
          capital: null,
          principal: null,
          email: null,
          webUrl: null,
          description: null,

        }, //提交表单
        formRules: {
          name: [{
              required: true,
              message: "机构名称不能为空",
              trigger: "blur"
            },
            {
              max: 20,
              message: "案例名称最大长度不能超过20位",
              trigger: "blur"
            },
          ],
          address: [{
            required: true,
            message: "地址不能为空",
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
        if (this.$route.query.type == 2) {
          this.disableValue = true;
        }
        //判断是修改还是新增
        var id = this.$route.query.id;
        if (null == id || id == "") {
          this.updateOrAdd = 2;
        } else {
          this.updateOrAdd = 1;
          var param = {
            id: id
          }
          this.httpPost("/fdresource/search", param).then((res) => {
            this.form = res.data;
          });
        }
      },


      /**
       * 修改机构
       */
      onUpdate() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.httpPost("/fdresource/update", this.form).then((res) => {
              if (typeof (res) == "undefined") {
                return;
              }
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$router.push({
                path: "/index/fdResourceManage",
              });
            });
          }
        });
      },

    }
  };
</script>


<style scoped>

</style>
