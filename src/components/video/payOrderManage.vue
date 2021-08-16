<template>
  <div class="app-container">
    <div class="block">
      <!--搜索栏-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="起始时间">
          <el-date-picker v-model="startTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="endTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="status" clearable placeholder="请选择">
            <el-option v-for="item in payStatus" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="keyName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-button type="primary" v-on:click="search">查询</el-button>
      </el-form>

      <!--订单记录表格-->
      <el-table :data="courseOrderList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="outTradeNo" label="订单流水号" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="amount" label="金额(元)">
        </el-table-column>
        <el-table-column label="支付类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 1">购买课程</div>
            <div v-if="scope.row.type == 2">购买直播</div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">未支付</div>
            <div v-if="scope.row.status == 1">已支付</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间">
        </el-table-column>
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
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        keyName: "", //关键字
        totalCount: 0, //总数
        courseOrderList: [], //订单集合
        payWay: "",
        type: "",
        payStatus:[{
          id:0,
          name:"未支付"
        },{
          id:1,
          name:"已支付"
        }],
        status:null,//筛选支付状态
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
        //查询订单
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/video/order/list", param).then((res) => {
          // console.log(res.data)
          this.courseOrderList = res.data.data;
          this.totalCount = res.data.total;
        })

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
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyName: this.keyName,
          status: this.status
        };
        this.httpPost("/video/order/list", param).then(res => {
            this.courseOrderList = res.data.data;
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
       * 删除订单
       */
      handleDeleteOrder(id) {
        this.$confirm('此操作将删除订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/order/delete", param).then((res) => {
            this.$message({
              message: '删除订单成功！',
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
