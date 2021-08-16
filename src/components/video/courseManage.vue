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

        <el-form-item label="课程类型">
          <el-select v-model="courseType" clearable placeholder="请选择">
            <el-option v-for="item in courseTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>

        <!--新增课程-->
        <el-button style="float:right" type="primary" icon="el-icon-plus" @click="addCourse" circle></el-button>
      </el-form>

      <!--课程表格-->
      <el-table :data="courseList" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="50">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="courseTypeName" label="课程类型" min-width="80" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="author" label="作者">
        </el-table-column>
        <el-table-column prop="viewCount" label="学习人数">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)">
        </el-table-column>
        <el-table-column label="课程封面" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.coverUrl" alt="" height="50">
          </template>
        </el-table-column>
        <el-table-column label="视频拥有时限">
          <template slot-scope="scope">
            <div>{{scope.row.ownTime}}年</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="courseChapters" label="课程章节">
        </el-table-column> -->
        <el-table-column prop="ifOrgOwn" label="是否属于机构">
          <template slot-scope="scope">
            <div v-if="scope.row.ifOrgOwn == 1">是</div>
            <div v-if="scope.row.ifOrgOwn == 2">否</div>
          </template>
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
        courseTypeList: [], //
        courseType: "", //当前选择课程类型
        courseList: [], //课程集合
        loading: false, //表单加载
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
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
        //查询课程列列表
        this.loadCourse();

        //查询课程类型集合
        this.httpPost("/video/courseType/list", {}).then((res) => {
          this.courseTypeList = res.data.data;
        });

      },
    
      /**
       * 查询课程
       */
      loadCourse() {
        this.loading = true;
        var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
        this.httpPost("/video/course/list", param).then((res) => {
          this.courseList = res.data.data;
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
       * 新建课程
       */
      addCourse(id) {
        this.$router.push({
          path: "/index/courseDetail",
          query: {
            id: null,
            type: 1
          },
        });
      },

      /**
       * 修改课程
       */
      updateCourse(id) {
        this.$router.push({
          path: "/index/courseDetail",
          query: {
            id: id,
            type: 2
          },
        });
      },

      /**
       * 去往课程详情页
       */
      toDetail(id){
        this.$router.push({
          path: "/index/courseDetail",
          query: {
            id: id,
            type: 3
          },
        });
      },

      /**
       * 删除课程
       */
      deleteCourse(id){
        this.$confirm('此操作将删除课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/video/course/delete", param).then((res) => {
            this.$message({
                message: '删除课程成功！',
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
        courseType: this.courseType,
      };
      this.httpPost("/video/course/list", param).then(res => {
          this.courseList = res.data.data;
          this.totalCount = res.data.total;
          this.loading = false;
          this.$message({
                message: '查询课程成功！',
                type: 'success'
              });
        },
        function() {
          console.log("failed");
        }
      );
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
