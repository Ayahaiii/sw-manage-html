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
        <el-button type="primary" @click="search">查询</el-button>

        <!--新增机构-->
        <el-button style="float:right" type="primary" icon="el-icon-plus" @click="addOrganization" circle></el-button>
      </el-form>

      <!--机构详情表格-->
      <el-table :data="organizationList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号" align="center" width="50">
        </el-table-column>
        <el-table-column prop="name" label="机构名称">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="createTimeString" label="时间" width="160px">
        </el-table-column>
         <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 2">开通</div>
            <div v-if="scope.row.status == 4">已过期</div>
            <div v-if="scope.row.status != 4 && scope.row.status != 2">未开通</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button @click="toOrganizationDetail(scope.row.id)" size="mini">查看</el-button>
             <el-button @click="updateOrganizationDetail(scope.row.id)" size="mini">编辑</el-button>
            <el-button @click="deleteOrganization(scope.row.id)" type="danger" size="mini">删除</el-button>
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
        organizationList: [], //机构集合
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
        //查询机构列表
        this.loadOrganization();
      },
    
      /**
       * 查询机构
       */
      loadOrganization() {
        this.loading = true;
        var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
        this.httpPost("/organization/list", param).then((res) => {
          this.organizationList = res.data.data;
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
       * 新建机构
       */
      addOrganization(id) {
        this.$router.push({
          path: "/index/addOrganization",
          query: {
            id: id,
          },
        });
      },

       /**
       * 修改机构
       */
      updateOrganizationDetail(id) {
        this.$router.push({
          path: "/index/organizationDetail",
          query: {
            id: id,
            type: 2
          },
        });
      },
      /**
       * 去往机构详情页
       */
      toOrganizationDetail(id){
        this.$router.push({
          path: "/index/organizationDetail",
          query: {
            id: id,
            type: 3
          },
        });
      },

      /**
       * 删除机构
       */
      deleteOrganization(id){
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

    //搜索
    search: function() {
      this.loading = true;
      var param = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.httpPost("/organization/list", param).then(res => {
          this.organizationList = res.data.data;
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
