<template>
  <div class="content">
    <main>
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
      <mu-raised-button @click="goBack" label="返 回" class="vueco-btn" primary/>
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
      let url = 'https://www.vue-js.com/api/v1' + this.$route.path;
      this.axios.get(url).then(function (response) {
        that.user_info = response.data.data
      })
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.getUser();
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