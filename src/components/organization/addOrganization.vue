<template>
    <div class="app-container">
        <div>
            <h3 class="title">申请机构账号</h3>
            <p>
                <font class="font">感谢您选择智社！</font>
            </p>
            <p>
                个人用户可以
                <font class="newFont">免费注册</font>成为智社个人用户，使用智社提供的免费应用服务。如个人用户需要使用部分面向组织的应用服务，则首先需要先申请一个机构账号，并通过该机构账号邀请成为该机构的成员。
            </p>
            <br>
        </div>
        <el-form
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="120px"
            style="width: 700px;"
            :disabled="disableValue"
        >
            <el-form-item label="机构名称" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="机构地址" prop="address">
                <el-input v-model="form.address"/>
            </el-form-item>
            <el-form-item label="机构网址" prop="webUrl">
                <el-input v-model="form.webUrl"/>
            </el-form-item>
            <el-form-item label="联系人" prop="contactPerson">
                <el-input v-model="form.contactPerson"/>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone"/>
            </el-form-item>
            <el-form-item label="联系邮箱" prop="email">
                <el-input v-model="form.email"/>
            </el-form-item>
            <el-form-item label="管理员账号" prop="adminAccount">
                <el-input v-model="form.adminAccount" placeholder="此处填写智社网注册的个人用户邮箱、手机或用户名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onOrganizationSubmit">确认提交</el-button>
            </el-form-item>
        </el-form>
        <p class="bottom">申请成功后，根据实际情况，机构用户可被授予最长不超过3个月的免费试用期。</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
                expirationTime: ""
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
         * 提交机构
         */
        onOrganizationSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.httpPost("/organization/add", this.form).then(res => {
                        if (res.code == 10010) {
                            this.$message({
                                message: "新增机构失败！",
                                type: "error"
                            });
                        } else {
                            this.$message({
                                message: "新增机构成功！",
                                type: "success"
                            });
                        }
                        this.$router.push("/index/organizationManage");
                    });
                }
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
