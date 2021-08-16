<template>
	<div class="app-container">
		<el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;" :disabled="disableValue">
			<el-form-item label="课程名称" prop="courseId">
                  <div v-if="this.$route.query.type == 1">
                   <el-input v-model="this.$route.query.courseTitle" disabled />
                 </div>	
                 <div v-if="this.$route.query.type == 2 || this.$route.query.type == 3">
                   <el-input v-model="this.$route.query.vdCourseTitle" disabled />
                 </div>	
                
			</el-form-item>
			<el-form-item label="视频标题" prop="title">
				<el-input v-model="form.title" maxlength="10" />
			</el-form-item>
			<el-form-item label="视频简介" prop="videoAbstract">
				<el-input type="textarea" :rows="10" v-model="form.videoAbstract" maxlength="800" />
			</el-form-item>
			<el-form-item label="排序权重" prop="sortNum">
				<el-input v-model="form.sortNum" maxlength="3" />
			</el-form-item>
			<el-form-item v-if="indexType != 3" label="视频路径" prop="url" maxlength="255">
				<el-input v-model="form.url" />
			</el-form-item>
			<!--查看显示内容-->
			<el-form-item v-if="indexType == 3" label="视频">
				<video width="480" height="340" controls="controls">
					<source :src="form.url" type="video/mp4">你的浏览器不支持H5视频播放。
				</video>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onVideoSubmit" v-if="indexType==1">确认提交</el-button>
				<el-button type="primary" @click="onVideoUpdate" v-if="indexType==2">确认修改</el-button>
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
			form: {
                courseId: this.$route.query.videoId,
				title: "",
				videoAbstract: "",
				url: "",
				coursetitle: "",
				sortNum:null,
			}, //提交表单
			formRules: {
				courseId: [
					{
						required: true,
						message: "请选择课程",
						trigger: "blur"
					}
				],
				title: [
					{
						required: true,
						message: "请填写视频标题",
						trigger: "blur"
					}
				],
				videoAbstract: [
					{
						required: true,
						message: "请填写视频简介",
						trigger: "blur"
					}
				],
				url: [
					{
						required: true,
						message: "请填写视频地址",
						trigger: "blur"
					}
				]
			}, //表单验证规则
			
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
				//查询视频详情
				var param = {
					id: id
				};
				this.httpPost("/video/queryByVideoId", param).then(res => {
                    this.form = res.data;
					this.indexType = type;
					if (type == 3) {
						this.disableValue = true;
					}
				});
			}
		},

		/**
		 * 发布视频
		 */
		onVideoSubmit: function() {
			this.$refs["form"].validate(valid => {
				if (valid) {
					this.httpPost("/video/add", this.form).then(res => {
						this.$message({
							message: "新增视频成功！",
							type: "success"
						});
						this.$router.push("/index/videoManage?courseId="+this.form.courseId+"&buttonType="+1+"&courseTitle="+this.$route.query.courseTitle);
					});
				}
			});
		},

		/**
		 * 修改视频
		 */
		onVideoUpdate() {
			this.$refs["form"].validate(valid => {
				if (valid) {
					this.form.id = this.$route.query.id;
					this.httpPost("/video/update", this.form).then(res => {
						this.$message({
							message: "修改视频成功！",
							type: "success"
						});
						this.$router.push("/index/videoManage");
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
</style>
