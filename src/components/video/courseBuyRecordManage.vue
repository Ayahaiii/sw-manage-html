<template>
  <div class="app-container">
    <div class="block">
      <!--搜索栏-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="起始时间">
          <el-date-picker v-model="startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label>
          <el-input v-model="keyName" placeholder="请输入课程名称/用户名"></el-input>
        </el-form-item>
        <el-button type="primary" v-on:click="search">查询</el-button>
      </el-form>

      <!--购买记录表格-->
      <el-table :data="courseBuyRecordList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="课程名称" ></el-table-column>
        <el-table-column prop="username" label="用户姓名" ></el-table-column>
        <el-table-column prop="amount" label="金额(元)" ></el-table-column>
        <el-table-column prop="payOrderId" label="订单编号" ></el-table-column>
        <el-table-column prop="expireTimeString" label="过期时间" ></el-table-column>
        <el-table-column prop="createTimeString" label="创建时间" ></el-table-column>
      </el-table>
      <!--分页-->
      <div style="float:right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        startTime: "", //查询开始时间
        endTime: "", //查询结束时间
        courseBuyRecordList: [], //购买记录集合
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        payOrderId: 0, //订单号
        keyName: "", //关键字
        totalCount: 0 //总数
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
        //查询视频
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/video/vdBuyRecords/list", param).then(res => {
          this.courseBuyRecordList = res.data.data;
          this.totalCount = res.data.total;
        });
      },

      /**
       * 每页显示数据量变更
       */
      handleSizeChange: function (val) {
        this.pageSize = val;
        this.search();
      },

      /**
       * 页码变更
       */
      handleCurrentChange: function (val) {
        this.pageNum = val;
        this.search();
      },

      /**
       * 搜索
       */
      search: function () {
        var param = {
          startTime: this.startTime,
          endTime: this.endTime,
          keyName: this.keyName,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/video/vdBuyRecords/list", param).then(res => {
            this.courseBuyRecordList = res.data.data;
            this.totalCount = res.data.total;
            this.$message({
              message: '查询成功！',
              type: 'success'
            });
          },
          function () {
            console.log("failed");
          }
        );
      },

      /**
       * 去往购买记录详情页
       */
      handleCourseBuyRecordQuery(id) {
        this.$router.push({
          path: "/index/courseBuyRecordDetail",
          query: {
            id: id,
            type: 3
          },
        });
      },

      /**
       * 删除视频
       */
      handleDeleteVdCourseBuyRecord(id) {
        this.$confirm('此操作将删除购买记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/vdBuyRecords/delete", param).then((res) => {
            this.$message({
              message: '删除购买记录成功！',
              type: 'success'
            });
            this.loadData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    }
  };
</script>


<style scoped>
  .el-header {
    width: 100%;
    height: 100px;
    border: 1px solid red;
  }

  .tableMain {
    width: 100%;
    margin-top: 40px;
  }

  .el-pagination {
    margin-top: 15px;
  }

  .el-table {
    margin-top: 15px;
  }
</style>
