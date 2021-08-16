<template>
  <el-container class="container-index">
    <el-aside class="side-menu">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">视频点播</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/courseManage">
              <el-menu-item index="1-1">课程管理</el-menu-item>
            </router-link>
            <router-link to="/index/videoManage">
              <el-menu-item index="1-2">视频管理</el-menu-item>
            </router-link>
            <router-link to="/index/courseTypeManage">
              <el-menu-item index="1-3">课程类型管理</el-menu-item>
            </router-link>
            <router-link to="/index/courseNoteManage">
              <el-menu-item index="1-4">课程笔记管理</el-menu-item>
            </router-link>
            <router-link to="/index/courseScoreManage">
              <el-menu-item index="1-5">课程评分管理</el-menu-item>
            </router-link>
            <router-link to="/index/courseCommentManage">
              <el-menu-item index="1-6">课程评论管理</el-menu-item>
            </router-link>
            <router-link to="/index/videoPlayRecordManage">
              <el-menu-item index="1-7">课程视频播放记录管理</el-menu-item>
            </router-link>
            <router-link to="/index/courseBuyRecordManage">
              <el-menu-item index="1-8">课程购买记录管理</el-menu-item>
            </router-link>
            <router-link to="/index/payOrderManage">
              <el-menu-item index="1-9">课程订单管理</el-menu-item>
            </router-link>
            <router-link to="/index/bannerManage">
              <el-menu-item index="1-10">课程广告管理</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">视频直播</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/liveManage">
              <el-menu-item index="2-1">直播管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveCommentManage">
              <el-menu-item index="2-2">直播评论管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveScoreManage">
              <el-menu-item index="2-3">直播评分管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveOrderManage">
              <el-menu-item index="2-4">直播预约管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveTypeManage">
              <el-menu-item index="2-5">直播类型管理</el-menu-item>
            </router-link>
            <router-link to="/index/livePlayRecordManage">
              <el-menu-item index="2-6">直播播放记录管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveBuyRecordManage">
              <el-menu-item index="2-7">直播购买记录管理</el-menu-item>
            </router-link>
            <router-link to="/index/liveCollectManage">
              <el-menu-item index="2-8">直播收藏管理</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">机构管理</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/organizationManage">
              <el-menu-item index="3-1">机构列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">精品案例</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/goodCaseManage">
              <el-menu-item index="4-1">精品案例列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">新闻管理</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/newsManage">
              <el-menu-item index="5-1">新闻列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">机构审核管理</span>
          </template>
          <el-menu-item-group>
            <router-link to="/index/organizationExamineManage">
              <el-menu-item index="6-1">机构审核列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">发现资源管理</span>
          </template>
          <el-menu-item-group>
            <router-link to='/index/fdResourceManage'>
              <el-menu-item index="7-1">资源列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="home" @click="toggleMenu" :label="bool">
          <icon name="bars" class="bars"></icon>
          <span>首页</span>
        </div>
        <el-dropdown>
          <i class="el-icon-setting">
            &nbsp;&nbsp;
            <span>王小虎</span>
          </i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="signOut()">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        bool: false,
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath); 
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },

      // 侧面菜单收起
      toggleMenu() {
        if (this.isCollapse == false) {
          this.isCollapse = true;
        } else {
          this.isCollapse = false;
        }
      },
      // 退出
      signOut() {
        this.$router.push("/");
      }
    }
  };
</script>

<style>
  .el-form-item__label {
    font-size: 15px;
    font-weight: 600;
    color: #666;
  }

  a {
    text-decoration: none;
  }

  .container-index {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .side-menu {
    width: auto !important;
    background: #393d49;
  }

  .side-menu .el-menu {
    background: #393d49;
    border: 0px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .side-menu .el-submenu__title {
    background: #393d49;
  }

  .side-menu .el-submenu__title:hover {
    background: #001528;
  }

  .side-menu .el-menu div,
  .side-menu .el-menu .el-menu-item {
    color: #bfcbd9;
  }

  .side-menu .el-menu .el-menu-item:focus {
    background: #393d49;
  }

  .side-menu .el-menu .el-menu-item:hover {
    background: #001528;
  }

  .side-menu .el-menu .el-menu-item.is-active {
    color: #009688;
  }

  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
    text-align: right;
    font-size: 12px;
  }

  .el-header .home {
    float: left;
    font-size: 14px;
    cursor: pointer;
  }

  .el-header .home .bars {
    display: inline-block;
    vertical-align: middle;
    color: #606266;
    position: relative;
    top: -1px;
  }

  .el-header .home span {
    display: inline-block;
    vertical-align: middle;
    color: #606266;
  }

  .open {
    width: 300px !important;
    transition: width 1s;
    transform-origin: left;
  }

  .close {
    width: 0px !important;
    transition: width 1s;
    transform-origin: right;
  }

  body .el-table th.gutter {
    display: table-cell !important;
  }

  body .el-table colgroup.gutter {
    display: table-cell !important;
  }
</style>