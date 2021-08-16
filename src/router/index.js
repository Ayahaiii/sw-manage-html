import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Index from '@/components/index'
import courseManage from '@/components/video/courseManage'
import videoManage from '@/components/video/videoManage'
import courseTypeManage from '@/components/video/courseTypeManage'
import courseNoteManage from '@/components/video/courseNoteManage'
import courseScoreManage from '@/components/video/courseScoreManage'
import courseCommentManage from '@/components/video/courseCommentManage'
import videoPlayRecordManage from '@/components/video/videoPlayRecordManage'
import courseBuyRecordManage from '@/components/video/courseBuyRecordManage'
import payOrderManage from '@/components/video/payOrderManage'
import bannerManage from '@/components/video/bannerManage'
import courseDetail from '@/components/video/courseDetail'
import videoDetail from '@/components/video/videoDetail'
import courseTypeDetail from '@/components/video/courseTypeDetail'
import courseNoteDetail from '@/components/video/courseNoteDetail'
import courseScoreDetail from '@/components/video/courseScoreDetail'
import courseCommentDetail from '@/components/video/courseCommentDetail'
import videoPlayRecordsDetail from '@/components/video/videoPlayRecordsDetail'
import courseBuyRecordDetail from '@/components/video/courseBuyRecordDetail'
import bannerDetail from '@/components/video/bannerDetail'
import liveManage from '@/components/live/liveManage'
import liveDetail from '@/components/live/liveDetail'
import liveCommentManage from '@/components/live/liveCommentManage'
import liveScoreManage from '@/components/live/liveScoreManage'
import liveOrderManage from '@/components/live/liveOrderManage'
import liveTypeManage from '@/components/live/liveTypeManage'
import liveTypeDetail from '@/components/live/liveTypeDetail'
import livePlayRecordManage from '@/components/live/livePlayRecordManage'
import liveBuyRecordManage from '@/components/live/liveBuyRecordManage'
import liveCollectManage from '@/components/live/liveCollectManage'
import organizationManage from '@/components/organization/organizationManage'
import organizationDetail from '@/components/organization/organizationDetail'
import goodCaseManage from '@/components/goodcase/goodCaseManage'
import goodCaseDetail from '@/components/goodcase/goodCaseDetail'
import addOrganization from '@/components/organization/addOrganization'
import priviewPdf from '@/components/goodcase/priviewPdf'
import videoDetailManage from '@/components/video/videoDetailManage'
import videoDetailAdd from '@/components/video/videoDetailAdd' 
import fdResourceManage from '@/components/fdResource/fdResourceManage'
import fdResourceDetail from '@/components/fdResource/fdResourceDetail'
import newsManage from '@/components/news/newsManage'
import newsDetail from '@/components/news/newsDetail'
import searchNewsDetail from '@/components/news/searchNewsDetail'
import organizationExamineManage from '@/components/organizationExamine/organizationExamineManage'
import fdOrganizationDetail from '@/components/organizationExamine/fdOrganizationDetail'
import searchFdOrganizationDetail from '@/components/organizationExamine/searchFdOrganizationDetail'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: '/index/courseManage',
      children: [{
          path: '/index/courseManage',
          name: 'courseManage',
          component: courseManage
        },
        {
          path: '/index/videoManage',
          name: 'videoManage',
          component: videoManage
        },
        {
          path: '/index/courseTypeManage',
          name: 'courseTypeManage',
          component: courseTypeManage
        },
        {
          path: '/index/courseNoteManage',
          name: 'courseNoteManage',
          component: courseNoteManage
        },
        {
          path: '/index/courseScoreManage',
          name: 'courseScoreManage',
          component: courseScoreManage
        },
        {
          path: '/index/courseCommentManage',
          name: 'courseCommentManage',
          component: courseCommentManage
        },
        {
          path: '/index/videoPlayRecordManage',
          name: 'videoPlayRecordManage',
          component: videoPlayRecordManage
        },
        {
          path: '/index/courseBuyRecordManage',
          name: 'courseBuyRecordManage',
          component: courseBuyRecordManage
        },
        {
          path: '/index/payOrderManage',
          name: 'payOrderManage',
          component: payOrderManage
        },
        {
          path: '/index/courseDetail',
          name: 'courseDetail',
          component: courseDetail
        },
        {
          path: '/index/bannerManage',
          name: 'bannerManage',
          component: bannerManage
        },
        {
          path: '/index/videoDetail',
          name: 'videoDetail',
          component: videoDetail
        },
        {
          path: '/index/courseTypeDetail',
          name: 'courseTypeDetail',
          component: courseTypeDetail
        },
        {
          path: '/index/courseNoteDetail',
          name: 'courseNoteDetail',
          component: courseNoteDetail
        },
        {
          path: '/index/courseScoreDetail',
          name: 'courseScoreDetail',
          component: courseScoreDetail
        },
        {
          path: '/index/courseCommentDetail',
          name: 'courseCommentDetail',
          component: courseCommentDetail
        },
        {
          path: '/index/videoPlayRecordsDetail',
          name: 'videoPlayRecordsDetail',
          component: videoPlayRecordsDetail
        },
        {
          path: '/index/courseBuyRecordDetail',
          name: 'courseBuyRecordDetail',
          component: courseBuyRecordDetail
        },
        {
          path: '/index/bannerDetail',
          name: 'bannerDetail',
          component: bannerDetail
        },
        {
          path: '/index/liveManage',
          name: 'liveManage',
          component: liveManage
        },
        {
          path: '/index/liveDetail',
          name: 'liveDetail',
          component: liveDetail
        },
        {
          path: '/index/liveCommentManage',
          name: 'liveCommentManage',
          component: liveCommentManage
        },
        {
          path: '/index/liveScoreManage',
          name: 'liveScoreManage',
          component: liveScoreManage
        },
        {
          path: '/index/liveOrderManage',
          name: 'liveOrderManage',
          component: liveOrderManage
        },
        {
          path: '/index/liveTypeManage',
          name: 'liveTypeManage',
          component: liveTypeManage
        },
        {
          path: '/index/liveTypeDetail',
          name: 'liveTypeDetail',
          component: liveTypeDetail
        },
        {
          path: '/index/livePlayRecordManage',
          name: 'livePlayRecordManage',
          component: livePlayRecordManage
        },
        {
          path: '/index/liveBuyRecordManage',
          name: 'liveBuyRecordManage',
          component: liveBuyRecordManage
        },
        {
          path: '/index/liveCollectManage',
          name: 'liveCollectManage',
          component: liveCollectManage
        },
        {
          path: '/index/organizationManage',
          name: 'organizationManage',
          component: organizationManage
        },
        {
          path: '/index/organizationDetail',
          name: 'organizationDetail',
          component: organizationDetail
        },
        {
          path: '/index/goodCaseManage',
          name: 'goodCaseManage',
          component: goodCaseManage
        },
        {
          path: '/index/goodCaseDetail',
          name: 'goodCaseDetail',
          component: goodCaseDetail
        },
        {
          path: '/index/addOrganization',
          name: 'addOrganization',
          component: addOrganization
        },
        {
          path: '/index/priviewPdf',
          name: 'priviewPdf',
          component: priviewPdf
        },
        {
          path: '/index/videoDetailManage',
          name: 'videoDetailManage',
          component: videoDetailManage
        },
        {
          path: '/index/videoDetailAdd',
          name: 'videoDetailAdd',
          component: videoDetailAdd
        },
        {
          path: '/index/fdResourceManage',
          name: 'fdResourceManage',
          component: fdResourceManage
        },
        {
          path: '/index/fdResourceDetail',
          name: 'fdResourceDetail',
          component: fdResourceDetail
        },
        {
          path: '/index/newsManage',
          name: 'newsManage',
          component: newsManage
        },
        {
          path: '/index/newsDetail',
          name: 'newsDetail',
          component: newsDetail
        },
        {
          path: '/index/searchNewsDetail',
          name: 'searchNewsDetail',
          component: searchNewsDetail
        },
        {
          path: '/index/organizationExamineManage',
          name: 'organizationExamineManage',
          component: organizationExamineManage
        },
        {
          path: '/index/fdOrganizationDetail',
          name: 'fdOrganizationDetail',
          component: fdOrganizationDetail
        },
        {
          path: '/index/searchFdOrganizationDetail',
          name: 'searchFdOrganizationDetail',
          component: searchFdOrganizationDetail
        },
      ]
    },

  ]
})