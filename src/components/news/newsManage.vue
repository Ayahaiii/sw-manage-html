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

                <el-form-item label="新闻类别" prop="categoryId">
                    <el-select v-model="categoryId" filterable clearable placeholder="请选择">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--新增直播-->
                <el-button
                    style="float:right"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addNews"
                    circle
                ></el-button>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="是否首页" prop="index">
                    <el-select v-model="index" clearable placeholder="请选择">
                        <el-option
                            v-for="item in isIndexList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否轮播" prop="topshow">
                    <el-select v-model="topshow" clearable placeholder="请选择">
                        <el-option
                            v-for="item in isTopShowList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否置顶" prop="top">
                    <el-select v-model="top" clearable placeholder="请选择">
                        <el-option
                            v-for="item in isTopList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
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
                    <el-input v-model="keyName" placeholder="请输入标题/来源/标签" style="width:600px"></el-input>
                </el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form>

            <!--新闻详情表格-->
            <el-table :data="newsList" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
                <el-table-column
                    prop="title"
                    label="新闻标题"
                    min-width="80"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column prop="publishTimeString" label="发布时间" width="180px"></el-table-column>
                <el-table-column prop="tags" label="标签"></el-table-column>
                <el-table-column prop="orginalTitle" label="原文标题"  min-width="80"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="name" label="新闻类型"></el-table-column>
                <el-table-column prop="isIndex" label="是否首页">
                     <template slot-scope="scope">
                        <div v-if="scope.row.isIndex == 1">是</div>
                        <div v-if="scope.row.isIndex == 2">否</div>
                    </template>
                </el-table-column>
                <el-table-column prop="isTopShow"  label="是否轮播">
                     <template slot-scope="scope">
                        <div v-if="scope.row.isTopShow == 1">是</div>
                        <div v-if="scope.row.isTopShow == 2">否</div>
                    </template>
                </el-table-column>
                <el-table-column prop="isTop"  label="是否置顶">
                     <template slot-scope="scope">
                        <div v-if="scope.row.isTop == 1">是</div>
                        <div v-if="scope.row.isTop == 2">否</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="新闻状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">草稿</div>
                        <div v-if="scope.row.status == 3">已发布</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" size="mini">查看</el-button>
                        <el-button @click="updateNews(scope.row.id)" size="mini">编辑</el-button>
                        <el-button @click="deleteNews(scope.row.id)" type="danger" size="mini">删除</el-button>
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
            newsList:[],//新闻集合
            keyName:"",
            state:"",
            index:"",
            top:"",
            topshow:"",
            categoryList: [], //新闻类型集合
            categoryId: "", //当前选择新闻类型
            loading: false, //表单加载
            pageNum: 1, //当前页码
            pageSize: 10, //默认每页数据量
            totalCount: 0, //总数
            statusList: [
                {
                    value: 1,
                    name: "草稿"
                },
                {
                    value: 3,
                    name: "已发布"
                }
            ], //状态集合
            isIndexList: [
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 2,
                    name: "否"
                }
            ], //首页集合
            isTopShowList: [
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 2,
                    name: "否"
                }
            ], //轮播集合
            isTopList: [
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 2,
                    name: "否"
                }
            ] //置顶集合
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
            //查询新闻列表
            this.loadLive();

            //查询新闻类型集合
            this.httpPost("/news/newsType", {}).then(res => {
                this.categoryList = res.data;
            });
        },

        /**
         * 查询新闻
         */
        loadLive() {
            this.loading = true;
            var param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            this.httpPost("/news/list", param).then(res => {
                this.newsList = res.data.data;
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
         * 新建新闻
         */
        addNews(id) {
            this.$router.push({
                path: "/index/newsDetail",
                query: {
                    id: null,
                    type: 1
                }
            });
        },

        /**
         * 修改新闻
         */
        updateNews(id) {
            this.$router.push({
                path: "/index/newsDetail",
                query: {
                    id: id,
                    type: 2
                }
            });
        },

        /**
         * 去往新闻详情页
         */
        toDetail(id) {
            this.$router.push({
                path: "/index/searchNewsDetail",
                query: {
                    id: id,
                    type: 3
                }
            });
        },

        /**
         * 删除新闻
         */
        deleteNews(id) {
            this.$confirm("此操作将删除新闻, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    var param = {
                        id: id
                    };
                    this.httpPost("/news/delete", param).then(
                        res => {
                            this.$message({
                                message: "删除新闻成功！",
                                type: "success"
                            });
                            this.loadData();
                        }
                    );
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
                categoryId: this.categoryId,
                keyName:this.keyName,
                index:this.index,
                state:this.state,
                top:this.top,
                topshow:this.topshow

            };
            this.httpPost("/news/list", param).then(
                res => {
                    this.newsList = res.data.data;
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
        },

        
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
