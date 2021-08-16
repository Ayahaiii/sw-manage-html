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
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone"/>
            </el-form-item>
            <!-- <el-form-item label="经度" prop="lat">
                <el-input v-model="form.lat" type="number"/>
            </el-form-item>
            <el-form-item label="纬度" prop="lon">
                <el-input v-model="form.lon" type="number"/>
            </el-form-item>-->
            <!-- <el-form-item label="定位类型" prop="posType">
                <el-select v-model="form.posType" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in posTypeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="是否是资源" prop="isFdresource">
                <el-select v-model="form.isFdresource" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in isFdresourceList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="form.address"/>
            </el-form-item>
            <el-form-item label="编辑人" prop="editor">
                <el-input v-model="form.editor"/>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
                <div class="edit_container">
                    <quill-editor v-model="form.intro" ref="myQuillEditor" class="editer"></quill-editor>
                </div>
            </el-form-item>
            <el-form-item label="负责人" prop="principal" style="margin-top:120px">
                <el-input v-model="form.principal"/>
            </el-form-item>
            <el-form-item prop="image" label="logo">
                <el-upload
                    ref="upload"
                    :action="uploadImageUrl"
                    multiple
                    name="file"
                    list-type="picture-card"
                    :limit="1"
                    :on-exceed="onExceed"
                    :file-list="fileList"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="form.image" alt>
                </el-dialog>
            </el-form-item>
            <el-form-item label="网址" prop="webUrl">
                <el-input v-model="form.webUrl"/>
            </el-form-item>
            <el-form-item label="成立时间" prop="setUpTime">
                <el-date-picker v-model="form.setUpTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="机构规模" prop="size">
                <el-select v-model="form.size" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in sizeList"
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
            fileList: [], //图片列表（用于在上传组件中回显图片）
            baseUrl: this.baseUrl,
            uploadImageUrl: this.baseUrl + "/fdOrganization/upload",
            uploadFdOrganizationUrl: "",
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
                image: ""
            }, //提交表单
            formRules: {
                name: [
                    {
                        required: true,
                        message: "名称不能为空",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择机构类型",
                        trigger: "change"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请填写地址",
                        trigger: "blur"
                    }
                ],
                intro: [
                    {
                        required: true,
                        message: "请填写机构简介",
                        trigger: "blur"
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
            posTypeList: [
                {
                    value: 1,
                    name: "gps"
                },
                {
                    value: 2,
                    name: "基站"
                },
                {
                    value: 3,
                    name: "百度"
                },
                {
                    value: 4,
                    name: "高德"
                }
            ], //定位类型集合
            isFdresourceList: [
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 2,
                    name: "否"
                }
            ], //是否是资源集合
            sizeList: [
                {
                    value: 1,
                    name: "0-10"
                },
                {
                    value: 2,
                    name: "10-20"
                },
                {
                    value: 3,
                    name: "20-50"
                },
                {
                    value: 4,
                    name: "50-100"
                },
                {
                    value: 5,
                    name: "100-300"
                },
                {
                    value: 6,
                    name: "300以上"
                }
            ], //机构规模集合
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
            //如果是修改
            var id = this.$route.query.id;
            var type = this.$route.query.type;
            if (id != null) {
                //查询机构详情
                var param = {
                    id: id
                };
                this.httpPost(
                    "/fdOrganization/queryByFdOrganizationId",
                    param
                ).then(res => {
                    this.form = res.data;
                    var arr = [
                        {
                            url: this.form.image
                        }
                    ];
                    this.fileList = arr;
                    this.indexType = type;
                    if (type == 3) {
                        this.disableValue = true;
                    }
                });
            }
        },
        /**
         * 添加机构
         */
        onSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.httpPost("/fdOrganization/add", this.form).then(
                        res => {
                            if (typeof res == "undefined") {
                                return;
                            }
                            this.$message({
                                message: "新增机构成功！",
                                type: "success"
                            });
                            this.$router.push(
                                "/index/organizationExamineManage"
                            );
                        }
                    );
                }
            });
        },

        /**
         * 修改机构
         */
        onUpdate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.id = this.$route.query.id;
                    this.httpPost("/fdOrganization/update", this.form).then(
                        res => {
                              if (typeof res == "undefined") {
                                return;
                            }
                            this.$message({
                                message: "机构修改成功！",
                                type: "success"
                            });
                            this.$router.push(
                                "/index/organizationExamineManage"
                            );
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
                this.uploadFdOrganizationUrl = file.response.data;
                this.form.image =
                    "/sw-api-uploaded/fdOrganization/" +
                    this.uploadFdOrganizationUrl; //将返回的文件储存路径赋值coverUrl字段
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
