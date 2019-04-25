<template>
<div class="content">
  <main>
    <!-- 个人信息 -->
    <v-layout row >
      <v-flex shrink justify-space-around>
        <img :src="user_info.avatar_url" alt="user">
      </v-flex>
      <v-flex grow>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>
            <v-card-text>
              <p>用户名：{{user_info.loginname}}</p>
              <p>积分：{{user_info.score}}</p>
              <p>注册时间：{{user_info.create_at | time_ago}}
                <v-btn @click="logout" color="secondary">退出登录</v-btn>
              </p>
            </v-card-text>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- 最近主题、回复、收藏 -->
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-card>
          <v-list>
            <v-subheader>最近创建的话题：</v-subheader>
            <v-divider></v-divider>
            <v-layout v-for="(item, index) in user_info.recent_topics" :key="index">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="user_info.avatar_url">
                </v-list-tile-avatar>
                <router-link style="text-decoration:none;color:#000;" :to="{path:'/content',query:{id:item.id}}">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </router-link>
              </v-list-tile>
            </v-layout>
            <v-subheader>最近参与的话题：</v-subheader>
            <v-divider></v-divider>
            <v-layout v-for="(item, index) in user_info.recent_replies" :key="index">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="user_info.avatar_url">
                </v-list-tile-avatar>
                <router-link style="text-decoration:none;color:#000;" :to="{path:'/content',query:{id:item.id}}">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </router-link>
              </v-list-tile>
            </v-layout>
            <v-subheader>最近收藏的话题：</v-subheader>
            <v-layout v-for="(item, index) in user_info.collect_topics" :key="index">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="user_info.avatar_url">
                </v-list-tile-avatar>
                <router-link style="text-decoration:none;color:#000;" :to="{path:'/content',query:{id:item.id}}">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </router-link>
              </v-list-tile>
            </v-layout>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </main>
</div>
</template>
<script>
export default {
  data() {
    return {
      user_info: {}
    }
  },
  methods: {
    getUser() {
      let that = this
      let author_name = this.$route.query.user
      let url = 'https://cnodejs.org/api/v1' + this.$route.path;
      this.$ajax.get(url).then(function(response) {
        that.user_info = response.data.data
      })
    },
    goBack() {
      this.$router.go(-1);
    },
    logout() {
      localStorage.setItem('accesstoken', '')
      localStorage.setItem('user_id', '')
      localStorage.setItem('loginname', '')
      this.isLogin = false;
    }
  },
  created() {
    this.getUser();
  }
}
</script>

<style scoped>

</style>