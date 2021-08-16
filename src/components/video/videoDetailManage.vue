<template>
  <div class="app-container">
    <div class="block">
      <el-button type="primary" v-on:click="addCourse()">新增</el-button>
      <div class="videoName">视频名称：{{videoTitle}}</div>
      <!--课程表格-->
      <el-table :data="videoDetailList" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="50">
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="videoTime" label="概要出现时间">
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" size="mini">查看</el-button>
            <el-button @click="updateCourse(scope.row.id)" size="mini">编辑</el-button>
            <el-button @click="deleteCourse(scope.row.id)" type="danger" size="mini">删除</el-button>
          </template>
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
        loading: false, //表单加载
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        totalCount: 0, //总数
        videoId:null, //当前视频id
        videoTitle:null,//视频标题
        videoDetailList:null,//概要集合
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
        //视频id赋值
        this.videoId = this.$route.query.videoId;
        this.videoTitle = this.$route.query.videoTitle;
        //查询视频概要
        this.loadDetail();

      },

      /**
       * 查询视频概要
       */
      loadDetail() {
        this.loading = true;
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          vdVideoId: this.videoId
        };
        this.httpPost("/video/detail/list", param).then((res) => {
          this.videoDetailList = res.data.data
          this.loading = false;
          this.pageSize = res.data.pageSize;
          this.pageNum = res.data.pageNum;
          this.totalCount = res.data.total;
        });
      },

      //每页显示数据量变更
      handleSizeChange: function (val) {
        this.pageSize = val;
        this.search();
      },

      //页码变更
      handleCurrentChange: function (val) {
        this.pageNum = val;
        this.search();
      },

      /**
       * 新建视频概要
       */
      addCourse(id) {
        this.$router.push({
          path: "/index/videoDetailAdd",
          query: {
            id: null,
            type: 1,
            videoId: this.videoId
          },
        });
      },

      /**
       * 修改课程
       */
      updateCourse(id) {
        this.$router.push({
          path: "/index/videoDetailAdd",
          query: {
            id: id,
            type: 2,
            videoId: this.videoId
          },
        });
      },

      /**
       * 去往课程详情页
       */
      toDetail(id) {
        this.$router.push({
          path: "/index/videoDetailAdd",
          query: {
            id: id,
            type: 3,
            videoId: this.videoId
          },
        });
      },

      /**
       * 删除概要
       */
      deleteCourse(id) {
        this.$confirm('此操作将删除概要, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/detail/delete", param).then((res) => {
            this.$message({
              message: '删除概要成功！',
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
          const timeFormat = year + "-" + month + "-" + day + " "+ hh+":"+mm;
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

  .el-table {
    margin-top: 20px;
  }

  .videoName{
    color: #666;
    margin-top: 20px;
  }
</style>
