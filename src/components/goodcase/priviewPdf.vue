<template>
  <div class="app-container" style="height:650px;">
      <iframe :src="url" width="100%" height="100%">
      </iframe>
  </div>
</template>

<script>
  export default {
    data() {
      return {
          url: "/manage/static/pdfjs/generic/web/viewer.html?file=/sw-api-uploaded/goodCase/" + this.$route.query.url,
      }; 
    },
    created() {
        // console.log("/static/pdfjs/generic/web/viewer.html?file=/sw-api-uploaded/goodCase/" + this.$route.query.url)
    },
    methods: {}
  };
</script>


<style scoped>

</style>
