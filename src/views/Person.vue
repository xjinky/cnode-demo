/*
 * @Author: fish119
 * @Date: 2017-05-22 09:21:33
 * @Last Modified by: fish119
 * @Last Modified time: 2017-05-23 16:24:56
 */
/**
<template>
<div class="content">
  <main v-if="isLogin">
    <!-- 个人信息 -->
    <img :src="user_info.avatar_url" alt="user">
    <span class="name">{{user_info.loginname}}</span>
    <div class="timer">
      <span>积分：{{user_info.score}}</span>
      <span>注册时间：{{user_info.create_at | time_ago}}</span>
    </div>

    <!-- 最近主题、回复、收藏 -->
    <section class="info_list">
      <mu-list>
        <!--最近主题-->
        <mu-list-item class="list" v-if="user_info.recent_topics" title="最近主题" toggleNested :open="false">
          <mu-icon class="icon" slot="left" value="insert_drive_file" />
          <mu-list-item :to="{path:'/content',query:{id:item.id}}" v-for="item in user_info.recent_topics" :key="item.id" slot="nested" :title="item.title">
            <mu-icon class="icon" slot="left" value="description" />
          </mu-list-item>
          <span class="count">{{user_info.recent_topics.length}}个</span>
        </mu-list-item>
        <!--最近回复-->
        <mu-list-item class="list" v-if="user_info.recent_replies" title="最近回复" toggleNested :open="false">
          <mu-icon class="icon" slot="left" value="drafts" />
          <mu-list-item :to="{path:'/content',query:{id:item.id}}" v-for="item in user_info.recent_replies" :key="item.id" slot="nested" :title="item.title">
            <mu-icon class="icon" slot="left" value="insert_comment" />
          </mu-list-item>
          <span class="count">{{user_info.recent_replies.length}}个</span>
        </mu-list-item>
        <!--最近收藏-->
        <mu-list-item class="list" v-if="user_info.collect_topics" title="收藏主题" toggleNested :open="false">
          <mu-icon class="icon" slot="left" value="folder" />
          <mu-list-item :to="{path:'/content',query:{id:item.id}}" v-for="item in user_info.collect_topics" :key="item.id" slot="nested" :title="item.title">
            <mu-icon class="icon" slot="left" value="folder_open" />
          </mu-list-item>
          <span class="count">{{user_info.collect_topics.length}}个</span>
        </mu-list-item>
      </mu-list>
    </section>
    <!-- 退出登录按钮 -->
    <mu-raised-button @click="logout" label="退出登录" class="vueco-btn" icon="power_settings_new" primary/>
  </main>

  <main v-else>
    <v-container fluid grid-list-md>
      <v-layout row wrap justify-center>
        <v-flex xs6>
          <v-text-field v-model="userToken" :rules="nameRules" :counter="10" label="Access Token" required></v-text-field>
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
        this.axios.post(url, {
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
      this.axios.get(url).then(function(res) {
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
.name {
  color: #009688;
  font-weight: 700;
  font-size: 24px;
}

.timer {
  display: flex;
  justify-content: space-around;
  width: 60%;
  margin: 1rem 0;
}

main {
  background-color: #f8f8f8;
}

main>img {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  margin: 1rem 0;
}

.info_list {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  margin-bottom: 1rem;
  border-top: 1px solid #009688;
}

.icon {
  color: #009688;
}

.count {
  background-color: #009688;
  color: #fff;
  padding: 0.1rem 0.6rem;
  border-radius: 0.2rem;
  margin-top: 2rem;
}
</style>
