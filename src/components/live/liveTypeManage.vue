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
        <el-button type="primary" v-on:click="search">查询</el-button>

        <!--新增直播类型-->
        <el-button style="float:right" type="primary" icon="el-icon-plus" @click="addLiveType" circle></el-button>
      </el-form>

      <!--直播类型表格-->
      <el-table :data="liveTypeList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
          </el-table-column>
        <el-table-column prop="name" label="直播类型名称">
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-button @click="handleupdateLiveType(scope.row.id)" size="mini">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteLiveType(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
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
        endTime: "",  //查询结束时间
        liveTypeList: [],//课程类型集合
        totalCount:0,//总数
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
      };
    },
    created() {
      this.loadData();
    },
    methods: {
      //页面初始化加载数据
      loadData() {
        //查询类型
         var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
        };
        this.httpPost("/live/liveType/list",param).then((res) =>{
          this.liveTypeList = res.data.data;
          this.totalCount = res.data.total;
        })
        
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
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.httpPost("/live/liveType/list", param).then(res => {
          this.liveTypeList = res.data.data;
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

     /**
       * 新建直播类型
       */
      addLiveType(id) {
        this.$router.push({
          path: "/index/liveTypeDetail",
          query: {
            id: id,
            type: 1
          },
        });
      },
       /**
       * 修改直播类型
       */
      handleupdateLiveType(id) {
        this.$router.push({
          path: "/index/liveTypeDetail",
          query: {
            id: id,
            type: 2
          },
        });
      },


       /**
       * 删除直播类型
       */
      handleDeleteLiveType(id){
        this.$confirm('此操作将删除直播类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/live/liveType/delete", param).then((res) => {
            this.$message({
                message: '删除直播类型成功！',
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

