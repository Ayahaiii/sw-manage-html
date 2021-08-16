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
            <el-form-item label="新闻类别">
                <div>{{form.name}}</div>
            </el-form-item>
            <el-form-item label="标题">
                <div>{{form.title}}</div>
            </el-form-item>
            <el-form-item label="作者">
                <div>{{form.author}}</div>
            </el-form-item>
            <el-form-item label="内容">
                <div class="ql-container ql-snow">
                    <div class="ql-editor">
                        <div v-html="form.content"></div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <div>{{form.tags}}</div>
            </el-form-item>
            <el-form-item label="发布时间">
                <div>{{form.publishTimeString}}</div>
            </el-form-item>
            <el-form-item label="来源">
                <div>{{form.source}}</div>
            </el-form-item>
            <el-form-item label="摘要">
                <div>{{form.newsAbstract}}</div>
            </el-form-item>
            <el-form-item label="原文标题">
                <div>{{form.orginalTitle}}</div>
            </el-form-item>
            <el-form-item label="原文链接">
                <div>{{form.orginalUrl}}</div>
            </el-form-item>
            <el-form-item label="位置">
                <div>{{form.position}}</div>
            </el-form-item>
            <el-form-item label="阅读数量">
                <div>{{form.numOfRead}}</div>
            </el-form-item>
            <el-form-item label="收藏数量">
                <div>{{form.numOfFavorite}}</div>
            </el-form-item>
            <el-form-item label="点赞数量">
                <div>{{form.numOfLike}}</div>
            </el-form-item>
            <el-form-item label="评论数量">
                <div>{{form.numOfComment}}</div>
            </el-form-item>
            <el-form-item label="是否首页">
                <div v-if="form.isIndex == 1">是</div>
                <div v-if="form.isIndex == 2">否</div>
            </el-form-item>
            <el-form-item label="是否轮播">
                <div v-if="form.isTopShow == 1">是</div>
                <div v-if="form.isTopShow == 2">否</div>
            </el-form-item>
            <el-form-item label="是否置顶">
                <div v-if="form.isTop == 1">是</div>
                <div v-if="form.isTop == 2">否</div>
            </el-form-item>
            <el-form-item label="状态">
                <div v-if="form.status == 1">草稿</div>
                <div v-if="form.status == 3">已发布</div>
            </el-form-item>
            <el-form-item label="轮播图片">
                <img :src="form.showImageUrl" alt width="480px">
            </el-form-item>
            <el-form-item label="是否发布">
                <el-switch
                    @change="updateNewsStatus()"
                    v-model="form.status"
                    :active-value="3"
                    :inactive-value="1"
                ></el-switch>
            </el-form-item>
            <el-form-item>
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
                title: "",
                categoryId: null,
                author: "",
                content: "",
                tags: "",
                publishTime: "",
                source: "",
                newsAbstract: "",
                orginalTitle: "",
                orginalUrl: "",
                numOfRead: 0,
                numOfFavorite: 0,
                numOfLike: 0,
                numOfComment: 0,
                isIndex: "",
                isTopShow: "",
                isTop: "",
                status: "",
                showImageUrl: "",
                position: ""
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
            //var type = this.$route.query.type;
            if (id != null) {
                //查询新闻详情
                var param = {
                    id: id
                };
                this.httpPost("/news/queryBynewsId", param).then(res => {
                    this.form = res.data;
                    //this.indexType = type;
                });
            }
        },

        toback(id) {
            this.$router.push({
                path: "/index/newsManage"
            });
        },

        onEditor() {
            var id = this.$route.query.id;
            this.$router.push({
                path: "/index/newsDetail",
                query: {
                    id: id,
                    type: 2
                }
            });
        },

        /**
         * 修改新闻
         */
        updateNews(param, successBack) {
            this.httpPost("/news/updateStatus", param).then(res => {
                successBack(res);
            });
        },

        /**
         * 修改新闻发布状态
         */
        updateNewsStatus() {
            var id = this.$route.query.id;
            var param = {
                id: id,
                status: this.form.status
            };
            this.updateNews(param, res => {
                var message = "发布成功";
                if (this.form.status == 1) {
                    message = "撤回成功";
                }
                this.$message({
                    message: message,
                    type: "success"
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
