<template>
    <div class="app-container">
        <el-form
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="120px"
            style="width: 600px;"
            :disabled="disableValue"
        >
           <el-form-item label="广告类型" prop="targetType">
                <el-select v-model="form.targetType" clearable placeholder="请选择">
                    <el-option
                        v-for="item in bannerTypeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
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
             <el-form-item label="目标课程" prop="targetId">
                <el-select v-model="form.targetId" clearable placeholder="请选择">
                    <el-option
                        v-for="item in courseList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="indexType != 3" prop="imageUrl" label="广告封面">
                <el-upload
                    ref="upload"
                    :action="uploadCoverUrl"
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
                    <img width="100%" :src="form.imageUrl" alt>
                </el-dialog>
            </el-form-item>
            <el-form-item label="排序权重" prop="sortNum">
                <el-input v-model="form.sortNum"/>
            </el-form-item>
            <!--查看显示内容-->
            <el-form-item v-if="indexType == 3" label="封面">
                <img :src="form.imageUrl" alt width="480px">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onBannerSubmit" v-if="indexType==1">确认提交</el-button>
                <el-button type="primary" @click="onBannerUpdate" v-if="indexType==2">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            disableValue: false, //表单是否可以修改
            indexType: 1, //页面类型，1：新增，2：修改，3：查看
            dialogVisible: false,
            fileList: [], //图片列表（用于在上传组件中回显图片）
            baseUrl: this.baseUrl,
            uploadCoverUrl: this.baseUrl + "/live/upload",
            uploadBannerCoverUrl: "",
            form: {
                imageUrl: "",
                sortNum: "",
                status: "",
                targetId: "",
                targetType: ""
            }, //提交表单
            formRules: {
                targetType: [
                    {
                        required: true,
                        message: "请选择广告类型",
                        trigger: "change"
                    }
                ],
                sortNum: [
                    {
                        required: true,
                        message: "请填写排序权重",
                        trigger: "blur"
                    }
                ],
                imageUrl: [
                    {
                        required: true,
                        message: "请填写封面地址",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择广告状态",
                        trigger: "change"
                    }
                ],
                targetId: [
                    {
                        required: true,
                        message: "请选择目标课程",
                        trigger: "change"
                    }
                ]
            }, //表单验证规则
            statusList: [
                {
                    value: 1,
                    name: "上架"
                },
                {
                    value: 2,
                    name: "下架"
                }
            ], //状态集合
            bannerTypeList: [
                {
                    value: 1,
                    name: "点播课程"
                },
                {
                    value: 2,
                    name: "直播课程"
                },
                {
                    value: 3,
                    name: "讲座"
                }
            ], //广告类型集合
            courseList: [] //课程集合
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
            //查询视频集合
            this.httpPost("/video/course/list", {}).then(res => {
                this.courseList = res.data.data;
            });

            //如果是修改
            var id = this.$route.query.id;
            var type = this.$route.query.type;
            if (id != null) {
                //查询广告详情
                var param = {
                    id: id
                };
                this.httpPost("/video/banner/queryByBannerId", param).then(
                    res => {
                        this.form = res.data;
                        var arr = [{ url: this.form.imageUrl }];
                        this.fileList = arr;
                        this.indexType = type;
                        if (type == 3) {
                            this.disableValue = true;
                        }
                    }
                );
            }
        },

        /**
         * 发布视频
         */
        onBannerSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.httpPost("/video/banner/add", this.form).then(res => {
                        this.$message({
                            message: "新增广告成功！",
                            type: "success"
                        });
                        this.$router.push("/index/bannerManage");
                    });
                }
            });
        },

        /**
         * 修改视频
         */
        onBannerUpdate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.id = this.$route.query.id;
                    this.httpPost("/video/banner/update", this.form).then(
                        res => {
                            this.$message({
                                message: "修改广告成功！",
                                type: "success"
                            });
                            this.$router.push("/index/bannerManage");
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
                this.uploadBannerCoverUrl = file.response.data;
                this.form.imageUrl = "/sw-api-uploaded/cover/" + this.uploadBannerCoverUrl; //将返回的文件储存路径赋值coverUrl字段
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
        }
    }
};
</script>


<style scoped>
el-button {
    margin-left: 20px;
    margin-bottom: 30px;
}
</style>
