<template>
	<div class="app-container">
		<el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 600px;" :disabled="disableValue">
			<el-form-item label="要点内容" prop="content">
				<el-input type="textarea" :rows="10" v-model="form.content" maxlength="800" />
			</el-form-item>
			<el-form-item label="所处视频时间" prop="videoTime">
				<el-time-picker
					v-model="form.videoTime"
					placeholder="选择时间">
				</el-time-picker>
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
			indexType: null, //页面类型，1：新增，2：修改，3：查看
			form: {
                vdVideoId: this.$route.query.videoId,
				content:null,
				videoTime:new Date(2016, 9, 0, 0, 1)
			}, //提交表单
			formRules: {
				content: [
					{
						required: true,
						message: "请填写概要",
						trigger: "blur"
					}
				],
				videoTime: [
					{
						required: true,
						message: "请选择时间",
						trigger: "blur"
					}
				],
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
			this.indexType = type;
			if (id != null) {
				//查询视频详情
				var param = {
					id: id
				};
				this.httpPost("/video/detail/search", param).then(res => {
					this.form = res.data;
					var arr = this.form.videoTime.split(":");
					var date = new Date();
					date.setHours(arr[0]);
					date.setMinutes(arr[1]);
					date.setSeconds(arr[2]);
					this.form.videoTime = date;
					if (type == 3) {
						this.disableValue = true;
					}
				});
			}
		},

		/**
		 * 发布视频概要
		 */
		onVideoSubmit: function() {
			this.$refs["form"].validate(valid => {
				if (valid) {
					this.form.videoTime = this.formatVideoTime(this.form.videoTime);
					this.httpPost("/video/detail/add", this.form).then(res => {
						this.$message({
							message: "新增视频成功！",
							type: "success"
						});
						this.$router.go(-1);
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
					this.form.videoTime = this.formatVideoTime(this.form.videoTime);
					this.httpPost("/video/detail/update", this.form).then(res => {
						this.$message({
							message: "修改成功！",
							type: "success"
						});
						this.$router.go(-1);
					});
				}
			});
		},

		/**
		 * 概要时间格式化
		 */
		formatVideoTime(time){
			var hour = time.getHours();
			var min = time.getMinutes();
			var seconds = time.getSeconds();
			if(hour<10){
				hour = "0"+hour;
			}
			if(min<10){
				min = "0"+min;
			}
			if(seconds<10){
				seconds = "0"+seconds;
			}
			return hour+":"+min+":"+seconds;
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
