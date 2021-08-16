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
      </el-form>

      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="案例类型">
          <el-select v-model="type" clearable placeholder="请选择">
            <el-option v-for="item in caseTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="案例状态">
          <el-select v-model="status" clearable placeholder="请选择">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="keyWords" placeholder="请输入关键字"></el-input>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>
        <!--新增机构-->
        <el-button style="float:right" type="primary" icon="el-icon-plus" @click="toAddGoodCase" circle></el-button>
      </el-form>

      <!--机构详情表格-->
      <el-table :data="goodCaseList" tooltip-effect="dark" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" align="center" label="" width="50px"></el-table-column>
        <el-table-column prop="title" label="案例标题" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="author" label="作者">
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 1">个案实务</div>
            <div v-if="scope.row.type == 2">小组实务</div>
            <div v-if="scope.row.type == 3">社区实务</div>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">待发布</div>
            <div v-if="scope.row.status == 2">已发布</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeString" label="创建时间" width="160">
        </el-table-column>
        <el-table-column align="center" label="发布" width="100">
          <template slot-scope="scope">
            <el-switch @change="updateGoodCaseStatus(scope.row.id,scope.row.status)" v-model="scope.row.status"
              :active-value=2 :inactive-value=1>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="toPriviewPdf(scope.row)" size="mini">查看</el-button>
            <el-button @click="toGoodCaseDetail(scope.row.id)" size="mini">编辑</el-button>
            <el-button @click="deleteGoodCase(scope.row.id,scope.$index)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div style="float:right;margin-top:15px;">
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
        startTime: null, //查询开始时间
        endTime: null, //查询结束时间
        status: null, //案例状态
        type: null, //案例类型
        keyWords: null, //关键词
        goodCaseList: [], //精品案例集合
        loading: false, //表单加载
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        totalCount: 0, //总数
        caseTypeList: [{
            id: 1,
            name: "个案实务"
          },
          {
            id: 2,
            name: "小组实务"
          },
          {
            id: 3,
            name: "社区实务"
          }
        ],
        statusList: [{
            id: 1,
            name: "待发布"
          },
          {
            id: 2,
            name: "已发布"
          }
        ]
      };
    },
    created() {
      this.loadData(true);
    },
    methods: {

      /**
       * 页面初始化加载数据
       */
      loadData(ifLoad) {
        //查询机构列表
        this.searchGoodcase(ifLoad);
      },

      /**
       * 条件查询精品案例
       */
      searchGoodcase(ifLoad) {
        this.loading = true;
        var param = {
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.status,
          keyWords: this.keyWords,
          type: this.type,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/goodcase/list", param).then((res) => {
          this.goodCaseList = res.data.data;
          this.loading = false;
          this.totalCount = res.data.total;
          if(ifLoad){return}
          this.$message({
            message: '查询成功！',
            type: 'success'
          });
        });
      },

      /**
       * 每页显示数据量变更
       */
      handleSizeChange: function (val) {
        this.pageSize = val;
        this.loadData();
      },

      /**
       * 页码变更
       */
      handleCurrentChange: function (val) {
        this.pageNum = val;
        this.loadData();
      },

      /**
       * 删除直播
       */
      deleteOrganization(id) {
        this.$confirm('此操作将删除机构, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
          }
          this.httpPost("/organization/delete", param).then((res) => {
            this.$message({
              message: '删除机构成功！',
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
       * 条件搜索
       */
      search: function () {
        this.loadData();
      },

      /**
       * 修改案例
       */
      updateGoodCase(param, successBack) {
        this.httpPost("/goodcase/update", param).then((res) => {
          successBack(res);
        });
      },

      /**
       * 修改课程发布状态
       */
      updateGoodCaseStatus(id, status) {
        var param = {
          id: id,
          status: status
        }
        this.updateGoodCase(param, (res) => {
          var message = "发布成功";
          if (status == 1) {
            message = "撤回成功"
          }
          this.$message({
            message: message,
            type: 'success'
          });
        })
      },

      /**
       * 删除精品案例
       */
      deleteGoodCase(id, index) {
        this.$confirm('此操作将删除案例, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id,
            ifDelete: 1
          }
          this.updateGoodCase(param, (res) => {
            this.$message({
              message: "删除成功",
              type: 'success'
            });
            this.goodCaseList.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      /**
       * 跳往案例详情页
       */
      toGoodCaseDetail(id){
        this.$router.push({
          path: "/index/goodCaseDetail",
          query: {
            id: id
          },
        });
      },

      /**
       * 跳往增加案例
       */
      toAddGoodCase(){
        this.$router.push({
          path: "/index/goodCaseDetail",
        });
      },

      /**
       * 预览pdf
       */
      toPriviewPdf(row){
        this.$router.push({
          path: "/index/priviewPdf",
          query: {
            url: row.url
          },
        });
      }
    }
  };
</script>


<style scoped>

</style>
