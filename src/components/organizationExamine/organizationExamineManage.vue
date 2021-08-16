<template>
    <div class="app-container">
        <div class="block">
            <!--搜索栏-->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="起始时间">
                    <el-date-picker v-model="startTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select v-model="fdOrganizationType" filterable clearable placeholder="请选择">
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--新增机构-->
                <el-button
                    style="float:right"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addFdOrganization"
                    circle
                ></el-button>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="状态" prop="state">
                    <el-select v-model="state" clearable placeholder="请选择" style="margin-left:30px">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="keyName" placeholder="请输入名称" style="width:570px"></el-input>
                </el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form>

            <!--机构详情表格-->
            <el-table :data="fdOrganizationList" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    min-width="80"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column prop="type" label="类型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type == 1">社工机构</div>
                        <div v-if="scope.row.type == 2">基金会</div>
                        <div v-if="scope.row.type == 3">协会</div>
                        <div v-if="scope.row.type == 9">其他</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">无效</div>
                        <div v-if="scope.row.status == 1">有效</div>
                        <div v-if="scope.row.status == 20">待审核</div>
                        <!-- <div v-if="scope.row.status == 21">审核通过</div>
                        <div v-if="scope.row.status == 22">审核不通过</div>-->
                    </template>
                </el-table-column>

                <el-table-column prop="createTimeString" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" size="mini">查看</el-button>
                        <el-button @click="updateFdOrganization(scope.row.id)" size="mini">编辑</el-button>
                        <el-button
                            @click="deleteFdOrganization(scope.row.id)"
                            type="danger"
                            size="mini"
                        >删除</el-button>
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
            fdOrganizationList: [], //机构集合
            keyName: "",
            state: "",
            fdOrganizationType: "", //当前选择机构类型
            loading: false, //表单加载
            pageNum: 1, //当前页码
            pageSize: 10, //默认每页数据量
            totalCount: 0, //总数
            statusList: [
                {
                    value: 0,
                    name: "无效"
                },
                {
                    value: 1,
                    name: "有效"
                },
                {
                    value: 20,
                    name: "待审核"
                }
            ], //状态集合
            typeList: [
                {
                    value: 1,
                    name: "社工机构"
                },
                {
                    value: 2,
                    name: "基金会"
                },
                {
                    value: 3,
                    name: "协会"
                },
                {
                    value: 9,
                    name: "其他"
                }
            ] //类型集合
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
            this.loadFdOrganization();
        },

        /**
         * 查询机构
         */
        loadFdOrganization() {
            this.loading = true;
            var param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            this.httpPost("/fdOrganization/list", param).then(res => {
                this.fdOrganizationList = res.data.data;
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
        addFdOrganization(id) {
            this.$router.push({
                path: "/index/fdOrganizationDetail",
                query: {
                    id: null,
                    type: 1
                }
            });
        },

        /**
         * 修改机构
         */
        updateFdOrganization(id) {
            this.$router.push({
                path: "/index/fdOrganizationDetail",
                query: {
                    id: id,
                    type: 2
                }
            });
        },

        /**
         * 去往机构详情页
         */
        toDetail(id) {
            this.$router.push({
                path: "/index/searchFdOrganizationDetail",
                query: {
                    id: id
                }
            });
        },

        /**
         * 删除新闻
         */
        deleteFdOrganization(id) {
            this.$confirm("此操作将删除机构, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    var param = {
                        id: id
                    };
                    this.httpPost("/fdOrganization/delete", param).then(res => {
                        this.$message({
                            message: "删除机构成功！",
                            type: "success"
                        });
                        this.loadData();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
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
                fdOrganizationType: this.fdOrganizationType,
                keyName: this.keyName,
                state: this.state
            };
            this.httpPost("/fdOrganization/list", param).then(
                res => {
                    this.fdOrganizationList = res.data.data;
                    this.totalCount = res.data.total;
                    this.loading = false;
                    this.$message({
                        message: "查询成功！",
                        type: "success"
                    });
                },
                function() {
                    console.log("failed");
                }
            );
        }
    }
};
</script>


<style scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>
