<template>
    <div class="app-container">
        <!--查看显示内容-->
        <el-row v-if="indexType == 3">
            <div style="height:70px">
                <el-button
                    style="margin-left:40px"
                    type="primary"
                    plain
                    @click="toOtherDetail(1)"
                >评论列表</el-button>
                <el-button type="primary" plain @click="toOtherDetail(2)">评分列表</el-button>
                <el-button type="primary" plain @click="toOtherDetail(3)">预约列表</el-button>
                <el-button type="primary" plain @click="toOtherDetail(4)">收藏列表</el-button>
            </div>
        </el-row>

        <el-form
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="120px"
            style="width: 600px;"
            :disabled="disableValue"
        >
            <el-form-item label="直播名称" prop="title">
                <el-input v-model="form.title"/>
            </el-form-item>
            <el-form-item label="直播类型" prop="type">
                <el-select v-model="form.type" clearable placeholder="请选择">
                    <el-option
                        v-for="item in liveTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="form.author"/>
            </el-form-item>
            <el-form-item label="直播简介" prop="liveAbstract">
                <el-input type="textarea" :rows="10" v-model="form.liveAbstract"/>
            </el-form-item>
            <el-form-item label="讲师简介" prop="authorAbstract">
                <el-input type="textarea" :rows="10" v-model="form.authorAbstract"/>
            </el-form-item>
            <el-form-item label="直播开始时间" prop="beginTime">
                <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item v-if="indexType != 3" label="保利威授权key" prop="secretKey">
                <el-input v-model="form.secretKey"/>
            </el-form-item>
            <el-form-item label="直播地址" prop="liveUrl">
                <el-input v-model="form.liveUrl"/>
            </el-form-item>
            <el-form-item label="课程价格(元)" prop="price">
                <el-input v-model="form.price" type="number"/>
            </el-form-item>
            <el-form-item v-if="indexType != 3" prop="coverUrl" label="直播封面">
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
                    :on-success="handleCoverSuccess"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="form.coverUrl" alt>
                </el-dialog>
            </el-form-item>
            <el-form-item v-if="indexType != 3" label="二维码" prop="qrCode">
                <el-upload
                    ref="upload"
                    :action="uploadCodeUrl"
                    multiple
                    name="file"
                    list-type="picture-card"
                    :limit="1"
                    :on-exceed="onExceed"
                    :file-list="fileCodeList"
                    :before-upload="beforeUpload"
                    :on-preview="handlePreview"
                    :on-success="handleCodeSuccess"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="form.qrCode" alt>
                </el-dialog>
            </el-form-item>
            <!--查看显示内容-->
            <el-form-item v-if="indexType == 3" label="封面">
                <img :src="form.coverUrl" alt width="480px">
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="二维码">
                <img :src="form.qrCode" alt width="480px">
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="评分">
                <el-input v-model="form.score" type="number"/>
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="点评人数">
                <el-input v-model="form.evaluateCount" type="number"/>
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="观看人数">
                <el-input v-model="form.viewCount" type="number"/>
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="预约人数">
                <el-input v-model="form.orderCount" type="number"/>
            </el-form-item>
            <el-form-item v-if="indexType == 3" label="保利威授权key">
                <el-input v-model="form.secretKey"/>
            </el-form-item>
           <el-form-item label="直播回放课程" prop="vdCourseId">
            <template>
                <el-select v-model="form.vdCourseId" clearable filterable placeholder="请选择">
                    <el-option
                        v-for="item in courseList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </template>
              </el-form-item>

            <el-form-item label="是否为机构直播">
                <el-switch v-model="form.ifOrgOwn" :active-value="1" :inactive-value="2"></el-switch>
            </el-form-item>

            <el-form-item v-if="form.ifOrgOwn == 1" label="机构绑定列表">
                <!--机构下拉框-->
                <template>
                    <el-select v-model="orgIndex" clearable filterable placeholder="请选择">
                        <el-option
                            v-for="item in orgList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.index"
                        ></el-option>
                    </el-select>
                </template>
                <el-button
                    style="margin-left:10px;"
                    @click="addOrg()"
                    type="primary"
                    size="small"
                >添加</el-button>

                <!--机构绑定详情表格-->
                <el-table :data="vdLiveOrgList" border style="width: 100%; margin-top:40px;">
                    <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
                    <el-table-column label="机构名称" prop="name" align="center"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="deleteOrg(scope.row.id)" type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit" v-if="indexType==1">确认提交</el-button>
                <el-button type="primary" @click="onUpdate" v-if="indexType==2">确认修改</el-button>
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
            fileCodeList: [], //二维码图片列表（用于在上传组件中回显图片）
            baseUrl: this.baseUrl,
            uploadCoverUrl: this.baseUrl + "/live/upload",
            uploadCodeUrl: this.baseUrl + "/live/uploadCode",
            uploadLiveCoverUrl: "",
            uploadLiveCodeUrl: "",
            form: {
                title: "",
                type: "",
                author: "",
                coverUrl: "",
                qrCode: "",
                liveUrl: "",
                beginTime: "",
                price: 0,
                liveAbstract: "",
                authorAbstract: "",
                orderCount: 0,
                secretKey: "",
                currentCourse:"",//当前选中的课程
            }, //提交表单
            formRules: {
                title: [
                    {
                        required: true,
                        message: "直播名称不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 10,
                        message: "直播名称最大长度不能超过10位",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择直播类型",
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
                liveAbstract: [
                    {
                        required: true,
                        message: "请填写直播简介",
                        trigger: "blur"
                    }
                ],
                authorAbstract: [
                    {
                        required: true,
                        message: "请填写作者简介",
                        trigger: "blur"
                    }
                ],
                beginTime: [
                    {
                        required: true,
                        message: "请填写直播开始时间",
                        trigger: "blur"
                    }
                ],
                price: [
                    {
                        required: true,
                        message: "请填写直播价格",
                        trigger: "blur"
                    }
                ],
                liveUrl: [
                    {
                        required: true,
                        message: "请填写直播地址",
                        trigger: "blur"
                    }
                ],
                secretKey: [
                    {
                        required: true,
                        message: "保利威授权key",
                        trigger: "blur"
                    }
                ]
            }, //表单验证规则
            liveTypeList: [], //直播类型集合
            vdLiveOrgList: [], //课程机构绑定集合
            orgIndex: null, //当前被选中的机构
            orgList: null, //机构列表集合
            courseList:[],
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
            //查询直播类型集合
            this.httpPost("/live/liveType/list", {}).then(res => {
                this.liveTypeList = res.data.data;
            });

            //查询机构集合
            this.httpPost("/video/course/org", {}).then(res => {
                this.orgList = res.data.swOrganizationList;
                //orgList添加下标
                for (var i = 0; i < this.orgList.length; i++) {
                    this.orgList[i].index = i;
                }
            });

            //查询回放课程集合
            this.httpPost("/live/liveDetail/course", {}).then(res => {
                this.courseList = res.data.vdCourseList;
            });

            //如果是修改
            var id = this.$route.query.id;
            var type = this.$route.query.type;
            if (id != null) {
                //查询直播详情
                var param = {
                    id: id
                };
                this.httpPost("/live/liveDetail/query", param).then(res => {
                    this.form = res.data.liveDetail;
                    this.vdLiveOrgList = res.data.vdLiveOrgList;
                    var arr = [
                        {
                            url: this.form.coverUrl
                        }
                    ];
                    this.fileList = arr;
                    var codeArr = [
                        {
                            url: this.form.qrCode
                        }
                    ];
                    this.fileCodeList = codeArr;
                    this.indexType = type;
                    if (type == 3) {
                        this.disableValue = true;
                    }
                });
            }
        },

        /**
         * 发布直播
         */
        onSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.swOrganizationList = this.vdLiveOrgList;
                    this.httpPost("/live/liveDetail/add", this.form).then(
                        res => {
                            this.$message({
                                message: "新增直播成功！",
                                type: "success"
                            });
                            this.$router.push("/index/liveManage");
                        }
                    );
                }
            });
        },

        /**
         * 修改直播
         */
        onUpdate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.id = this.$route.query.id;
                    this.form.swOrganizationList = this.vdLiveOrgList;
                    this.httpPost("/live/liveDetail/update", this.form).then(
                        res => {
                            this.$message({
                                message: "修改直播成功！",
                                type: "success"
                            });
                            this.$router.push("/index/liveManage");
                        }
                    );
                }
            });
        },

        /**
         * 查看详情
         */
        toOtherDetail(command) {
            var path = "";
            switch (command) {
                case 1:
                    //点评列表
                    path = "/index/liveCommentManage";
                    break;
                case 2:
                    //评分列表
                    path = "/index/liveScoreManage";
                    break;
                case 3:
                    //预约列表
                    path = "/index/liveOrderManage";
                    break;
                case 4:
                    //收藏列表
                    path = "/index/liveCollectManage";
                    break;
            }
            this.$router.push({
                path: path,
                query: {
                    liveId: this.$route.query.id,
                    buttonType: 1
                }
            });
        },

        /**
         *封面文件上传成功的钩子函数
         */
        handleCoverSuccess(res, file) {
            //console.log(fileList)
            this.$message({
                type: "info",
                message: "图片上传成功",
                duration: 6000
            });
            if (file.response.code == 0) {
                this.uploadLiveCoverUrl = file.response.data; //将返回的文件储存路径赋值coverUrl字段
                this.form.coverUrl =
                    "/sw-api-uploaded/cover/" + this.uploadLiveCoverUrl;
            }
        },

        /**
         *二维码文件上传成功的钩子函数
         */
        handleCodeSuccess(res, file) {
            this.$message({
                type: "info",
                message: "图片上传成功",
                duration: 6000
            });
            if (file.response.code == 0) {
                this.uploadLiveCodeUrl = file.response.data; //将返回的文件储存路径赋值coverUrl字段
                this.form.qrCode =
                    "/sw-api-uploaded/code/" + this.uploadLiveCodeUrl;
            }
        },

        /**
         * 删除文件之前的钩子函数
         */
        handleRemove(file, fileList) {},

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

        /**
         * 删除机构和学习的关系
         */
        deleteOrg(id) {
            var index = 0;
            for (var i = 0; i < this.vdLiveOrgList.length; i++) {
                if (this.vdLiveOrgList[i].id === id) {
                    index = i;
                    break;
                }
            }
            this.vdLiveOrgList.splice(index, 1);
        },

        /**
         * 新增机构和学习的关系
         */
        addOrg() {
            if (
                this.orgIndex == null ||
                typeof this.orgIndex == "undefined" ||
                this.orgIndex === ""
            ) {
                this.$message({
                    message: "请选择机构",
                    type: "info"
                });
                return;
            }
            //判断是否已经添加过
            if (this.vdLiveOrgList != null && this.vdLiveOrgList != []) {
                for (let item of this.vdLiveOrgList) {
                    if (item.id == this.orgList[this.orgIndex].id) {
                        this.$message({
                            message: "机构已绑定",
                            type: "info"
                        });
                        return;
                    }
                }
            }
            this.vdLiveOrgList.unshift(this.orgList[this.orgIndex]);
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
