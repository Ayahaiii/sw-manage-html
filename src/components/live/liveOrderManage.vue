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

        <el-form-item label="">
            <el-input v-model="keyName" placeholder="请输入直播标题/用户名"></el-input>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>
         <el-button type="primary" @click="send" style="float:right" v-if="this.$route.query.buttonType == 1" :disabled=this.disabled>发送短信</el-button>
      </el-form>

      <!--直播预约表格-->
      <el-table :data="liveOrderList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="liveTitle" label="直播名称"></el-table-column>
        <el-table-column prop="username" label="用户名称"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码"></el-table-column>
         <el-table-column label="是否已发送预约提示">
          <template slot-scope="scope">
            <div v-if="scope.row.ifSend == 1">是</div>
            <div v-if="scope.row.ifSend == 2">否</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间"></el-table-column>
      </el-table>

      <!--分页-->
      <div style="float:right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
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
      liveOrderList: [], //直播预约集合
      pageNum: 1, //当前页码
      pageSize: 10, //默认每页数据量
      keyName: "", //关键字
      totalCount: 0, //总数
      liveId: null,
      status: null, //筛选当前状态
      liveOrderListById:[],//根据id查询出来的列表
      disabled:false,//按钮是否灰化
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    //页面初始化加载数据
    loadData() {
      //查询预约
      var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        liveId: this.$route.query.liveId,
      };
      this.httpPost("/live/liveOrder/list", param).then(res => {
        this.liveOrderList = res.data.data;
        this.totalCount = res.data.total;
        if(this.liveOrderList.length == 0){
           this.disabled = true;
        }
      });
    },

    //每页显示数据量变更
    handleSizeChange: function(val) {
      this.pageSize = val;
      this.search();
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.pageNum = val;
      this.search();
    },

    //搜索
    search: function() {
      var param = {
        startTime: this.startTime,
        endTime: this.endTime,
        keyName: this.keyName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.httpPost("/live/liveOrder/list", param).then(res => {
          this.liveOrderList = res.data.data;
          this.totalCount = res.data.total;
          this.$message({
                message: '查询成功！',
                type: 'success'
              });
        },
        function() {
          console.log("failed");
        }
      );
    },

    send:function() {
      var param = {
        liveId: this.$route.query.liveId,
      };
       this.httpPost("/sms/send", param).then(res => {
          this.loadData();
          this.$message({
                message: '短信发送成功！',
                type: 'success'
              });
        },  
        function() {
          console.log("failed");
        }
      );
      this.httpPost("/live/liveOrder/queryByLiveId", param).then(res => {
          this.liveOrderListById = res.data;
          if(this.liveOrderListById != null){
              this.disabled = true;
          }
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

