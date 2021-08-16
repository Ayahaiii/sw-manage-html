<template>
    <div class="app-container">
        <el-form
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="120px"
            style="width: 700px;"
            :disabled="disableValue"
        >
            <!--查看显示内容-->
            <el-form-item label="ID">
                <el-input v-model="form.id"/>
            </el-form-item>
            <el-form-item  label="名称">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item  label="地址">
                <el-input v-model="form.address"/>
            </el-form-item>
            <el-form-item  label="联系人">
                <el-input v-model="form.contactPerson"/>
            </el-form-item>
            <el-form-item  label="联系电话">
                <el-input v-model="form.phone"/>
            </el-form-item>
            <el-form-item  label="联系手机">
                <el-input v-model="form.mobile"/>
            </el-form-item>
            <el-form-item  label="联系邮箱">
                <el-input v-model="form.email"/>
            </el-form-item>
            <el-form-item label="应用权限设置">
                <el-switch
                    v-for="item in list"
                    :label="item.id"
                    :key="item.id"
                    :disabled="item.disabled"
                    v-model="item.permission"
                    :active-text="item.title"
                ></el-switch>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.status" clearable placeholder="请选择">
                    <el-option
                        v-for="item in organizationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有效时间">
                <el-col :span="11">
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="form.beginTime"
                        style="width: 100%;"
                    ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—</el-col>
                <el-col :span="10">
                    <el-date-picker
                        type="date"
                        placeholder="选择时间"
                        v-model="form.expirationTime"
                        style="width: 100%;"
                    ></el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onOrganizationUpdate" v-if="indexType==2">确认修改</el-button>
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
            list: [], //应用列表
            organizationList: [
                {
                    id: 1,
                    name: "待审核"
                },
                {
                    id: 2,
                    name: "有效"
                },
                {
                    id: 3,
                    name: "无效"
                }
            ], //机构状态集合
            form: {
                id: 0,
                name: "",
                address: "",
                webUrl: "",
                contactPerson: "",
                phone: "",
                email: "",
                mobile: "",
                adminAccount: "",
                status: null,
                beginTime: "",
                expirationTime: "",
            }, //提交表单
            formRules: {
                name: [
                    {
                        required: true,
                        message: "请填写机构名称",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请填写机构地址",
                        trigger: "blur"
                    }
                ],
                webUrl: [
                    {
                        required: true,
                        message: "请填写机构网址",
                        trigger: "blur"
                    }
                ],
                contactPerson: [
                    {
                        required: true,
                        message: "请填写联系人",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "请填写联系电话",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: "请填写联系邮箱",
                        trigger: "blur"
                    }
                ],
                adminAccount: [
                    {
                        required: true,
                        message: "请填写管理员账号",
                        trigger: "blur"
                    }
                ]
            } //表单验证规则
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
                    "/organization/queryByOrganizationId",
                    param
                ).then(res => {
                    this.form = res.data[0];
                    this.list = res.data[1];
                    for (let x in this.list) {
                        this.list[x].permission = eval(this.list[x].permission.toLowerCase());
                        this.list[x].disabled = eval(this.list[x].disabled.toLowerCase());
                    }
                    this.indexType = type;
                    if (type == 3) {
                        this.disableValue = true;
                    }
                });
            }
        },

      

        /**
         * 修改机构信息
         */
        onOrganizationUpdate() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                     this.form.id = this.$route.query.id;
                     var param = {
                        swOrganization: this.form,
                        swApps: this.list,
                    };
                    this.httpPost("/organization/update", param).then(res => {
                        // console.log(param);
                            this.$message({
                                message: "修改机构信息成功！",
                                type: "success"
                            });
                            this.$router.push("/index/organizationManage");
                        }
                    );
                }
            });
        }
    },
   
};
</script>


<style scoped>
el-button {
    margin-left: 20px;
    margin-bottom: 30px;
}
.title {
    color: #666;
    font-size: 24px;
}
.font {
    color: #e00c0c;
    font-size: 20px;
}
.newFont {
    color: #e00c0c;
}
.bottom {
    margin-left: 120px;
}
</style>
