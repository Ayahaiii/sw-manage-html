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

        <el-form-item label="直播类型">
          <el-select v-model="liveType" clearable placeholder="请选择">
            <el-option v-for="item in liveTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>

        <!--新增直播-->
        <el-button style="float:right" type="primary" icon="el-icon-plus" @click="addLive" circle></el-button>
      </el-form>

      <!--直播详情表格-->
      <el-table :data="liveDetailList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号" align="center" width="50">
        </el-table-column>
        <el-table-column prop="title" label="直播标题" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="liveTypeName" label="直播类型" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="author" label="作者">
        </el-table-column>
        <el-table-column prop="score" label="评分">
        </el-table-column>
        <el-table-column prop="viewCount" label="观看人数">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)">
        </el-table-column>
        <el-table-column label="直播封面" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.coverUrl" alt="" height="50">
          </template>
        </el-table-column>
        <el-table-column prop="status" label="直播是否已结束">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">否</div>
            <div v-if="scope.row.status == 2">是</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间" width="160">
        </el-table-column>
         <el-table-column align="center" label="发布直播状态" width="100">
          <template slot-scope="scope">
            <el-switch @change="updateLiveStatus(scope.row.id,scope.row.status)" v-model="scope.row.status"
              :active-value=2 :inactive-value=1>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" size="mini">查看</el-button>
            <el-button @click="updateCourse(scope.row.id)" size="mini">编辑</el-button>
            <el-button @click="deleteLive(scope.row.id)" type="danger" size="mini">删除</el-button>
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
        endTime: "", //查询结束时间
        liveTypeList: [], //直播类型集合
        liveType: "", //当前选择直播类型
        liveDetailList: [], //直播集合
        loading: false, //表单加载
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        totalCount: 0, //总数
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
        //查询直播列表
        this.loadLive();

        //查询直播类型集合
        this.httpPost("/live/liveType/list", {}).then((res) => {
          this.liveTypeList = res.data.data;
        });

      },
    
      /**
       * 查询直播
       */
      loadLive() {
        this.loading = true;
        var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
        this.httpPost("/live/liveDetail/list", param).then((res) => {
          this.liveDetailList = res.data.data;
          this.totalCount = res.data.total;
          this.loading = false;
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

      /**
       * 新建直播
       */
      addLive(id) {
        this.$router.push({
          path: "/index/liveDetail",
          query: {
            id: null,
            type: 1
          },
        });
      },

      /**
       * 修改直播
       */
      updateCourse(id) {
        this.$router.push({
          path: "/index/liveDetail",
          query: {
            id: id,
            type: 2
          },
        });
      },

      /**
       * 去往直播详情页
       */
      toDetail(id){
        this.$router.push({
          path: "/index/liveDetail",
          query: {
            id: id,
            type: 3
          },
        });
      },

      /**
       * 删除直播
       */
      deleteLive(id){
        this.$confirm('此操作将删除直播, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/live/liveDetail/delete", param).then((res) => {
            this.$message({
                message: '删除直播成功！',
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

    //搜索
    search: function() {
      this.loading = true;
      var param = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        liveType: this.liveType,
      };
      this.httpPost("/live/liveDetail/list", param).then(res => {
          this.liveDetailList = res.data.data;
          this.totalCount = res.data.total;
          this.loading = false;
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
       * 判断直播是否状态
       */
      updateLiveStatus(id, status) {
        var param = {
          id: id,
          status: status
        }
        this.updateLiveOverStatus(param, (res) => {
          var message = "直播已结束";
          if (status == 1) {
            message = "直播未结束"
          }
          this.$message({
            message: message,
            type: 'success'
          });
        })
      },

       /**
       * 修改直播是否结束状态
       */
      updateLiveOverStatus(param, successBack) {
        this.httpPost("/live/liveDetail/update", param).then((res) => {
          successBack(res);
        });
      },




      /**
       * 时间格式化
       */
      dateFormat(row, column, cellValue, index) {
        const daterc = row[column.property]
        if (daterc != null) {
          const dateMat = new Date(daterc);
          const year = dateMat.getFullYear();
          const month = dateMat.getMonth() + 1;
          const day = dateMat.getDate();
          const hh = dateMat.getHours();
          const mm = dateMat.getMinutes();
          const ss = dateMat.getSeconds();
          const timeFormat = year + "-" + month + "-" + day;
          return timeFormat;
        }

      }

    }
  };
</script>


<style scoped>

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>
