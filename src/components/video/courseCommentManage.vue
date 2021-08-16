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

        <el-form-item label="审核状态">
          <el-select v-model="status" clearable placeholder="请选择">
            <el-option v-for="item in checkStatus" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="keyName" placeholder="请输入课程标题/用户名"></el-input>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>
      </el-form>

      <!--评论表格-->
      <el-table :data="courseCommentList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="courseTitle" label="课程名称">
        </el-table-column>
        <el-table-column prop="content" label="评论" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="username" label="用户名称">
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">未审核</div>
            <div v-if="scope.row.status == 2">审核通过</div>
            <div v-if="scope.row.status == 3">审核未通过</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="审核">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleExamineComment(scope.row.id)">通过</el-button>
            <el-button size="mini" type="danger" @click="handleExamineNotPassComment(scope.row.id)">拒绝</el-button>
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
        courseCommentList: [], //课程评论集合
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        keyName: "", //关键字
        totalCount: 0, //总数
        courseId: null,
        checkStatus: [{
          id: 1,
          name: "未审核"
        }, {
          id: 2,
          name: "审核通过"
        }, {
          id: 3,
          name: "审核未通过"
        }], //审核状态集合
        status: null, //筛选当前状态
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
        //查询评论
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          courseId: this.$route.query.courseId,
        };
        this.httpPost("/video/courseComment/list", param).then((res) => {
          this.courseCommentList = res.data.data;
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
          keyName: this.keyName,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.status
        };
        this.httpPost("/video/courseComment/list", param).then(res => {
            this.courseCommentList = res.data.data;
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
       * 去往评论详情页
       */
      handleCourseCommentquery(id) {
        this.$router.push({
          path: "/index/courseCommentDetail",
          query: {
            id: id,
            type: 3
          }
        });
      },

      /**
       * 审核
       */
      handleExamineComment(id) {
        this.$confirm('此操作将审核评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/courseComment/examine", param).then((res) => {
            this.$message({
              message: '审核评论成功！',
              type: 'success'
            });
            this.loadData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消评论审核通过'
          });
        });
      },

      /**
       * 审核不通过
       */
      handleExamineNotPassComment(id) {
        this.$confirm('此操作将不通过审核评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/courseComment/examineNotPass", param).then((res) => {
            this.$message({
              message: '审核不通过评论成功！',
              type: 'success'
            });
            this.loadData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核不通过评论'
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
