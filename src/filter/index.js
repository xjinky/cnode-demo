import moment from 'moment'

export default {
    install: function (Vue, options) {
        Vue.filter('datefmt', function (input, fmtstring) {
            // 使用momentjs这个日期格式化类库实现日期的格式化功能
            return moment(input).format(fmtstring);
        }),
            Vue.filter('time_ago', function (input, fmtstring) {
                moment.locale('zh-cn');
                return moment(input, fmtstring).fromNow();
            }),
            Vue.filter('tab', function (val) {
                if (val === 'share') {
                    return '分享'
                } else if (val === 'ask') {
                    return '问答'
                } else if (val === 'job') {
                    return '招聘'
                }
            }),
            Vue.filter('comment', function (val) {
                return val.replace('<a href="/user', '<a href="#/user');
            })
    }
}
