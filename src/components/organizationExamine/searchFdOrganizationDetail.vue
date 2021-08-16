<template>
    <div class="app-container">
        <!--查看显示内容-->
        <el-form
            ref="form"
            :model="form"
            label-width="150px"
            style="width: 1200px;"
            :disabled="disableValue"
        >
            <el-form-item label="名称">
                <div>{{form.name}}</div>
            </el-form-item>
            <el-form-item label="类别">
                <div v-if="form.type == 1">社工机构</div>
                <div v-if="form.type == 2">基金会</div>
                <div v-if="form.type == 3">协会</div>
                <div v-if="form.type == 9">其他</div>
            </el-form-item>
            <el-form-item label="电话">
                <div>{{form.phone}}</div>
            </el-form-item>
            <el-form-item label="经度">
                <div>{{form.lat}}</div>
            </el-form-item>
            <el-form-item label="纬度">
                <div>{{form.lon}}</div>
            </el-form-item>
            <el-form-item label="定位类型">
                <div v-if="form.posType == 1">gps</div>
                <div v-if="form.posType == 2">基站</div>
                <div v-if="form.posType == 3">百度</div>
                <div v-if="form.posType == 4">高德</div>
            </el-form-item>
            <el-form-item label="创建时间">
                <div>{{form.createTimeString}}</div>
            </el-form-item>
            <el-form-item label="是否是资源">
                <div v-if="form.isFdresource == 1">是</div>
                <div v-if="form.isFdresource == 2">否</div>
            </el-form-item>
            <el-form-item label="地址">
                <div>{{form.address}}</div>
            </el-form-item>
            <el-form-item label="编辑人">
                <div>{{form.editor}}</div>
            </el-form-item>
            <el-form-item label="简介">
                <div class="ql-container ql-snow">
                    <div class="ql-editor">
                        <div v-html="form.intro"></div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="修改时间">
                <div>{{form.updateTimeString}}</div>
            </el-form-item>
            <el-form-item label="负责人">
                <div>{{form.principal}}</div>
            </el-form-item>
            <el-form-item label="logo">
                <img :src="form.image" alt width="480px">
            </el-form-item>
            <el-form-item label="网址">
                <div>{{form.webUrl}}</div>
            </el-form-item>
            <el-form-item label="成立时间">
                <div>{{form.setUpTimeString}}</div>
            </el-form-item>
            <el-form-item label="机构规模">
                <div v-if="form.size == 1">0-10</div>
                <div v-if="form.size == 2">10-20</div>
                <div v-if="form.size == 3">20-50</div>
                <div v-if="form.size == 4">50-100</div>
                <div v-if="form.size == 5">100-300</div>
                <div v-if="form.size == 6">300以上</div>
            </el-form-item>
            <el-form-item label="状态">
                <div v-if="form.status == 0">无效</div>
                <div v-if="form.status == 1">有效</div>
                <div v-if="form.status == 20">待审核</div>
                <!-- <div v-if="form.status == 21">审核通过</div>
                <div v-if="form.status == 22">审核不通过</div>-->
            </el-form-item>
            <!-- <el-form-item label="是否发布">
                <el-switch
                    @change="updateNewsStatus()"
                    v-model="form.status"
                    :active-value="3"
                    :inactive-value="1"
                ></el-switch>
            </el-form-item>-->
            <el-form-item>
                <el-button type="primary" @click="pass">通过</el-button>
                <el-button type="primary" @click="reject">拒绝</el-button>
                <el-button type="primary" @click="toback">返回</el-button>
                <el-button type="primary" @click="onEditor">编辑</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
export default {
    data() {
        return {
            disableValue: false, //表单是否可以修改
            indexType: 1, //页面类型，1：新增，2：修改，3：查看
            dialogVisible: false,
            form: {
                name: "",
                type: "",
                phone: "",
                lat: "",
                lon: "",
                posType: "",
                isFdresource: "",
                setUpTime: "",
                webUrl: "",
                principal: "",
                status: "",
                address: "",
                editor: "",
                intro: "",
                size: "",
                createTime: "",
                updateTime: "",
                image: ""
                //createTimeString:"",
            } //提交表单
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
            //如果是修改
            var id = this.$route.query.id;
            if (id != null) {
                //查询机构详情
                var param = {
                    id: id
                };
                this.httpPost(
                    "/fdOrganization/queryByFdOrganizationId",
                    param
                ).then(res => {
                    if (typeof res == "undefined") {
                        return;
                    }
                    this.form = res.data;
                });
            }
        },

        toback(id) {
            this.$router.push({
                path: "/index/organizationExamineManage"
            });
        },

        onEditor() {
            var id = this.$route.query.id;
            this.$router.push({
                path: "/index/fdOrganizationDetail",
                query: {
                    id: id,
                    type: 2
                }
            });
        },

        /**
         * 通过审核
         */
        pass() {
            this.$confirm("此操作将通过机构审核, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    var id = this.$route.query.id;
                    var param = {
                        id: id
                    };
                    this.httpPost("/fdOrganization/examine", param).then(
                        res => {
                            this.$message({
                                message: "审核机构成功！",
                                type: "success"
                            });
                            this.loadData();
                        }
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消机构审核通过"
                    });
                });
        },

        /**
         * 拒绝审核通过
         */
        reject(id) {
            this.$confirm("此操作将拒绝机构审核, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    var id = this.$route.query.id;
                    var param = {
                        id: id
                    };
                    this.httpPost("/fdOrganization/examineNotPass", param).then(
                        res => {
                            this.$message({
                                message: "拒绝审核机构成功！",
                                type: "success"
                            });
                            this.loadData();
                        }
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消机构审核拒绝"
                    });
                });
        }
    }
};
</script>


<style scoped>
el-button {
    margin-left: 20px;
    margin-bottom: 30px;
}
.quill-editor {
    height: 400px;
}
</style>
