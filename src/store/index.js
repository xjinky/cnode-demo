import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutation';
import actions from './action'

Vue.use(Vuex);

const path_title_array = [
    ['/', 'Vue.js中文社区'],
    ['/publish', '发布'],
    ['/messages', '消息中心'],
    ['/person', '个人中心'],
    ['/content', '阅读帖子'],
    ['/login', '登录'],
    ['/user', '用户信息']
];
const state = {
    svrUrl: 'https://cnodejs.org/api/v1/',
    titleMap: new Map(path_title_array),
    tabValue: '首页'
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})