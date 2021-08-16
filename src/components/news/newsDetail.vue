<template>
    <div class="app-container">
        <!--查看显示内容-->
        <el-form
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="100px"
            style="width: 1200px;"
            :disabled="disableValue"
        >
            <el-form-item label="新闻类别" prop="categoryId">
                <el-select v-model="form.categoryId" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title"/>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="form.author"/>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div class="edit_container">
                    <quill-editor
                        v-model="form.content"
                        ref="myQuillEditor"
                        class="editer"
                    ></quill-editor>
                </div>
            </el-form-item>
            <el-form-item label="标签" prop="tags" style="margin-top: 120px;">
                <el-input v-model="form.tags"/>
            </el-form-item>
            <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker v-model="form.publishTime" type="datetime" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="来源" prop="source">
                <el-input v-model="form.source"/>
            </el-form-item>
            <el-form-item label="摘要" prop="newsAbstract">
                <el-input v-model="form.newsAbstract"/>
            </el-form-item>
            <el-form-item label="原文标题" prop="orginalTitle">
                <el-input v-model="form.orginalTitle"/>
            </el-form-item>
            <el-form-item label="原文链接" prop="orginalUrl">
                <el-input v-model="form.orginalUrl"/>
            </el-form-item>
            <!-- <el-form-item label="阅读数量" prop="numOfRead">
                <el-input v-model="form.numOfRead" type="number"/>
            </el-form-item>
            <el-form-item label="收藏数量" prop="numOfFavorite">
                <el-input v-model="form.numOfFavorite" type="number"/>
            </el-form-item>
            <el-form-item label="点赞数量" prop="numOfLike">
                <el-input v-model="form.numOfLike" type="number"/>
            </el-form-item>
            <el-form-item label="评论数量" prop="numOfComment">
                <el-input v-model="form.numOfComment" type="number"/>
            </el-form-item> -->
            <el-form-item label="位置" prop="position">
                <el-input v-model="form.position" />
            </el-form-item>
            <el-form-item label="是否首页" prop="isIndex">
                <el-select v-model="form.isIndex" clearable placeholder="请选择">
                    <el-option
                        v-for="item in isIndexList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否轮播" prop="isTopShow">
                <el-select v-model="form.isTopShow" clearable placeholder="请选择">
                    <el-option
                        v-for="item in isTopShowList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否置顶" prop="isTop">
                <el-select v-model="form.isTop" clearable placeholder="请选择">
                    <el-option
                        v-for="item in isTopList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
             <el-form-item  prop="showImageUrl" label="轮播图片">
                <el-upload
                    ref="upload"
                    :action="uploadNewsUrl"
                    multiple
                    name="file"
                    list-type="picture-card"
                    :limit="1"
                    :on-exceed="onExceed"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-preview="handlePreview"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="form.showImageUrl" alt>
                </el-dialog>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择">
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" v-if="indexType==1">确认提交</el-button>
                <el-button type="primary" @click="onUpdate" v-if="indexType==2">确认修改</el-button>
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
            baseUrl: this.baseUrl,
            uploadNewsUrl: this.baseUrl + "/news/upload",
            uploadNewsListUrl: "",
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
                showImageUrl:"",
                position:"",
            }, //提交表单
            formRules: {
                title: [
                    {
                        required: true,
                        message: "新闻标题不能为空",
                        trigger: "blur"
                    }
                ],
                categoryId: [
                    {
                        required: true,
                        message: "请选择新闻类型",
                        trigger: "change"
                    }
                ],
                author: [
                    {
                        required: true,
                        message: "请填写作者",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请填写新闻内容",
                        trigger: "blur"
                    }
                ],
                isIndex: [
                    {
                        required: true,
                        message: "选择是否首页",
                        trigger: "change"
                    }
                ],
                publishTime: [
                    {
                        required: true,
                        message: "请填写发布时间",
                        trigger: "blur"
                    }
                ],
                isTopShow: [
                    {
                        required: true,
                        message: "选择是否轮播",
                        trigger: "change"
                    }
                ],
                isTop: [
                    {
                        required: true,
                        message: "选择是否置顶",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "选择新闻的状态",
                        trigger: "change"
                    }
                ]
            }, //表单验证规则
            categoryList: [], //新闻类型集合
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
            //查询新闻类型集合
            this.httpPost("/news/newsType", {}).then(res => {
                this.categoryList = res.data;
            });

            //如果是修改
            var id = this.$route.query.id;
            var type = this.$route.query.type;
            if (id != null) {
                //查询新闻详情
                var param = {
                    id: id
                };
                this.httpPost("/news/queryBynewsId", param).then(res => {
                    this.form = res.data;
                     var arr = [{ url: this.form.showImageUrl }];
                     this.fileList = arr;
                    this.indexType = type;
                    if (type == 3) {
                        this.disableValue = true;
                    }
                });
            }
        },
        /**
         * 发布新闻
         */
        onSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.httpPost("/news/add", this.form).then(res => {
                        this.$message({
                            message: "新增新闻成功！",
                            type: "success"
                        });
                        this.$router.push("/index/newsManage");
                    });
                }
            });
        },

        /**
         * 修改新闻
         */
        onUpdate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.id = this.$route.query.id;
                    this.httpPost("/news/update", this.form).then(
                        res => {
                            this.$message({
                                message: "新闻修改成功！",
                                type: "success"
                            });
                            this.$router.push("/index/newsManage");
                        }
                    );
                }
            });
        },
         /**
         *文件上传成功的钩子函数
         */

        handleSuccess(res, file) {
            this.$message({
                type: "info",
                message: "图片上传成功",
                duration: 6000
            });
            if (file.response.code == 0) {
                this.uploadNewsListUrl = file.response.data;
                this.form.showImageUrl = "/sw-api-uploaded/news/" + this.uploadNewsListUrl; //将返回的文件储存路径赋值coverUrl字段
            }
        },

        /**
         * 删除文件之前的钩子函数
         */

        handleRemove(file, fileList) {
        },

        /**
         * 点击列表中已上传的文件事的钩子函数
         */

        handlePreview(file) {},

        /**
         * 上传的文件个数超出设定时触发的函数
         */

        onExceed(files, fileList) {
            this.$message({
                type: "info",
                message: "最多只能上传一个图片",
                duration: 6000
            });
        },

        /**
         *  文件上传前的前的钩子函数,参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
         */

        beforeUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isGIF = file.type === "image/gif";
            const isPNG = file.type === "image/png";
            const isBMP = file.type === "image/bmp";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
        },

     
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
