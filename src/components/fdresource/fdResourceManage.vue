<template>
  <div class="app-container">
    <div class="block">
      <!--搜索栏-->
      <el-form :inline="true" class="demo-form-inline">
        <!--新增机构-->
        <el-form-item label="上传文件" prop="url">
          <el-upload class="upload-demo" :action=uploadUrl :show-file-list=false :on-success="uploadSuccess"
            :on-progress="upload">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="机构类型">
          <el-select v-model="type" clearable placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="机构状态">
          <el-select v-model="status" clearable placeholder="请选择">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="keyWords" placeholder="请输入关键字"></el-input>
        </el-form-item>

        <el-button type="primary" @click="search">查询</el-button>

      </el-form>

      <!--机构详情表格-->
      <el-table :data="fdResourceList" tooltip-effect="dark" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" align="center" label="" width="50px"></el-table-column>
        <el-table-column prop="name" label="机构名称" width="200px">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="type" label="资源类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 7">服务站</div>
            <div v-if="scope.row.type == 8">其他</div>
          </template>
        </el-table-column>
        <el-table-column prop="subType" label="企业类型">
          <template slot-scope="scope">
            <div v-if="scope.row.subType == 4">社会团体</div>
            <div v-if="scope.row.subType == 5">民办非企业单位</div>
          </template>
        </el-table-column>
        <el-table-column prop="setUpTimeString" label="成立时间">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">待发布</div>
            <div v-if="scope.row.status == 1">已发布</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布" width="100">
          <template slot-scope="scope">
            <el-switch @change="updateFdResourceStatus(scope.row.id,scope.row.status)" v-model="scope.row.status"
              :active-value=1 :inactive-value=0>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" size="mini">查看</el-button>
            <el-button @click="toUpdate(scope.row.id)" size="mini">编辑</el-button>
            <el-button @click="deleteFdResource(scope.row.id,scope.$index)" type="danger" size="mini">删除</el-button>
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
  import {
    Loading
  } from 'element-ui';
  export default {
    data() {
      return {
        uploadUrl: this.baseUrl + "/fdresource/import", //上传路径
        loadingInstance: null,
        startTime: null, //查询开始时间
        endTime: null, //查询结束时间
        keyWords: null, //关键词
        loading: false, //表单加载
        pageNum: 1, //当前页码
        pageSize: 10, //默认每页数据量
        totalCount: 0, //总数
        fdResourceList: null, //发现资源集合
        typeList: [{
          id: 7,
          name: "服务站"
        }, {
          id: 8,
          name: "其他"
        }], //机构类型集合
        statusList: [{
          id: 0,
          name: "未发布"
        }, {
          id: 1,
          name: "已发布"
        }], //机构状态
        type: null, //机构类型
        status: null, //机构状态
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
        this.searchFdResource(ifLoad);
      },

      /**
       * 条件查询精品案例
       */
      searchFdResource(ifLoad) {
        this.loading = true;
        var param = {
          status: this.status,
          keyWords: this.keyWords,
          type: this.type,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        this.httpPost("/fdresource/list", param).then((res) => {
          this.fdResourceList = res.data.data;
          this.loading = false;
          this.totalCount = res.data.total;
          if (ifLoad) {
            return
          }
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
       * 修改机构发布状态
       */
      updateFdResourceStatus: function (id, status) {
        var param = {
          id: id,
          status: status
        }
        this.updateFdResource(param, (res) => {
          var message = "发布成功";
          if (status == 0) {
            message = "撤回成功"
          }
          this.$message({
            message: message,
            type: 'success'
          });
        })
      },

      /**
       * 修改机构
       */
      updateFdResource: function (param, successCallBack) {
        this.httpPost("/fdresource/update", param).then((res) => {
          successCallBack(res);
        });
      },

      /**
       * 上传文件
       */
      upload() {
        this.loading = true;
      },

      /**
       * 上传成功
       */
      uploadSuccess() {
        this.loading = false;
        this.$message({
          message: "上传成功",
          type: 'success'
        });
        this.searchFdResource(true);
      },

      /**
       * 条件查询机构
       */
      search() {
        this.pageNum = 1;
        this.searchFdResource();
      },

      /**
       * 删除机构
       */
      deleteFdResource(id) {
        this.$confirm('此操作将删除机构, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            id: id
          }
          this.httpPost("/fdresource/delete", param).then((res) => {
            this.$message({
              message: "删除成功",
              type: 'success'
            });
            this.searchFdResource(true);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      /**
       * 跳往查看
       */
      toDetail(id) {
        this.$router.push({
          path: "/index/fdResourceDetail",
          query: {
            id: id,
            type: 2
          },
        });
      },

      /**
       * 修改
       */
      toUpdate(id) {
        this.$router.push({
          path: "/index/fdResourceDetail",
          query: {
            id: id,
            type: 1
          },
        });
      },



    }
  };
</script>


<style scoped>

</style>
