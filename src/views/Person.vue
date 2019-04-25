<template>
<div>
  <main v-if="isLogin">
    <!-- 个人信息 -->
      <v-layout row justify-space-between>
        <v-flex shrink>
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
    <v-layout row>
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

  <main v-else>
    <v-container fluid style="padding-top:100px;">
      <v-layout row wrap justify-center>
        <v-flex xs6>
          <v-text-field v-model="userToken" :counter="36" label="Access Token" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn @click="login" block color="info">登录</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</div>
</template>

<script>
export default {
  data() {
    return {
      userToken: '',
      error: '',
      user: {},
      user_info: {},
      isLogin: false
    }
  },
  computed: {},
  methods: {
    login() {
      if (this.userToken.length == 36) {
        this.error = '';
        const self = this;
        let url = this.$store.state.svrUrl + 'accesstoken'
        this.$ajax.post(url, {
          accesstoken: self.userToken
        }).then(function(res) {
          if (res.status == 200 && res.data.success) {
            self.error = '';
            localStorage.setItem("accesstoken", self.userToken);
            localStorage.setItem('loginname', res.data.loginname);
            self.isLogin = true;
            self.getUserInfo();
          } else {
            self.error = '请输入正确的Access Token'
          }
        }).catch(function(err) {
          console.log(err);
          this.error = '请输入正确的Access Token'
        })
      } else {
        this.error = '请输入正确的Access Token'
      }
    },
    getUserInfo() {
      const self = this;
      let url = this.$store.state.svrUrl + '/user/' + localStorage.getItem("loginname");
      this.$ajax.get(url).then(function(res) {
        if (res.status == 200) {
          self.user_info = res.data.data;
        } else {
          console.log(res.status)
        }
      }).catch(function(err) {
        console.log(err)
      });
    },
    logout() {
      localStorage.setItem('accesstoken', '')
      localStorage.setItem('user_id', '')
      localStorage.setItem('loginname', '')
      this.isLogin = false;
    }
  },
  mounted() {
    this.$store.dispatch('changeTabValue', '我的');
    this.userToken = localStorage.getItem("accesstoken")
    this.isLogin = localStorage.getItem("accesstoken").length == 36;
    if (this.isLogin)
      this.getUserInfo();
  }
}
</script>

<style scoped>

</style>
