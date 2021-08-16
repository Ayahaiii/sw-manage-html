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

        <el-form-item label="">
          <el-input v-model="keyName" placeholder="请输入课程标题/视频标题/视频简介"></el-input>
        </el-form-item>

        <el-button type="primary" v-on:click="search">查询</el-button>

        <div v-if="this.$route.query.buttonType == 1" style="float:right">
          <!--新增视频-->
          <el-button type="primary" icon="el-icon-plus" @click="addVideo" circle></el-button>
        </div>
      </el-form>

      <!--视频表格-->
      <el-table :data="videoList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="coursetitle" label="课程标题">
        </el-table-column>
        <el-table-column prop="videoAbstract" label="视频简介" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="title" label="视频标题">
        </el-table-column>
        <el-table-column prop="sortNum" label="排序权重">
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间">
        </el-table-column>
        <el-table-column label="概要" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="toVideoDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleVideoEdit(scope.row)">查看</el-button>
            <el-button @click="handleupdateVideo(scope.row)" size="mini">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteVideo(scope.row.id)">删除</el-button>
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
        videoList: [], //视频集合
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        keyName: "", //关键字
        totalCount: 0, //总数
        courseId: null,
        videoList: [], //视频集合
      };
    },
    created() {
      this.loadData();
    },
    methods: {
      //页面初始化加载数据
      loadData() {
        //查询视频
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          courseId: this.$route.query.courseId,
        };
        this.httpPost("/video/list", param).then((res) => {
          this.videoList = res.data.data;
          this.totalCount = res.data.total;
        })

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

      //搜索
      search: function () {
        var param = {
          startTime: this.startTime,
          endTime: this.endTime,
          keyName: this.keyName,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/video/list", param).then(res => {
            this.videoList = res.data.data;
            this.totalCount = res.data.total;
            this.$message({
              message: '查询视频成功！',
              type: 'success'
            });
          },
          function () {
            console.log("failed");
          }
        );
      },

      /**
       * 新建视频
       */
      addVideo(videoId) {
        this.$router.push({
          path: "/index/videoDetail",
          query: {
            videoId: this.$route.query.courseId,
            type: 1,
            courseTitle: this.$route.query.courseTitle,
          },
        });
      },

      /**
       * 修改视频
       */
      handleupdateVideo(row) {
        this.$router.push({
          path: "/index/videoDetail",
          query: {
            id: row.id,
            type: 2,
            vdCourseTitle: row.coursetitle,
          },
        });
      },


      /**
       * 删除视频
       */
      handleDeleteVideo(id) {
        this.$confirm('此操作将删除视频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/delete", param).then((res) => {
            this.$message({
              message: '删除视频成功！',
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
       * 去往视频详情页
       */
      handleVideoEdit(row) {
        this.$router.push({
          path: "/index/videoDetail",
          query: {
            id: row.id,
            type: 3,
            vdCourseTitle: row.coursetitle,
          },
        });
      },

      /**
       * 查看视频概要
       */
      toVideoDetail(row) {
        this.$router.push({
          path: "/index/videoDetailManage",
          query: {
            videoId: row.id,
            videoTitle: row.title,
          },
        });
      }

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
