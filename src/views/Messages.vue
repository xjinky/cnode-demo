<template>
<div class="content">
  <mu-tabs class="tabs box-shadow" :value="activeTab" @change="handleTabChange">
    <mu-tab value="unread" title="未读消息" />
    <mu-tab value="readed" title="已读消息" />
  </mu-tabs>
  <div class="tab-content" style=" position: relative;">
    <!-- 未读消息列表 -->
    <ul v-if="accesstoken" class="lists" v-show="activeTab === 'unread'">
      <router-link :to="{path:'/content',query:{id:item.topic.id}}" tag="li" class="list" v-for="item in unread_messages" :key="item.id">
        <div class="user">
          <img :src="item.author.avatar_url" alt="user">
          <span>{{item.author.loginname}}</span>
        </div>
        <div class="message_content">
          <h2 v-html="markdownChange(item.reply.content)"></h2>
          <p>来自：《{{item.topic.title}}》</p>
        </div>
        <div class="msg_timer">
          <span>{{item.reply.create_at | time_ago}}</span>
        </div>
      </router-link>
      <li v-if="!unread_messages.length">暂无消息</li>
    </ul>
    <!-- 已读消息列表 -->
    <ul v-if="accesstoken" class="lists" v-show="activeTab === 'readed'">
      <router-link :to="{path:'/content',query:{id:item.topic.id}}" tag="li" class="list" v-for="item in readed_messages" :key="item.id">
        <div class="user">
          <img :src="item.author.avatar_url" alt="user">
          <span>{{item.author.loginname}}</span>
        </div>
        <div class="message_content">
          <h2 v-if="item.reply.content" v-html="markdownChange(item.reply.content)"></h2>
          <h2 v-if="!item.reply.content">此内容已被作者删除</h2>
          <p>来自：《{{item.topic.title}}》</p>
        </div>
        <div v-if="item.reply.content" class="timer">
          <span>{{item.reply.create_at | time_ago}}</span>
        </div>
      </router-link>
      <li v-if="!readed_messages.length">暂无消息</li>
    </ul>
  </div>
</div>
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      activeTab: 'unread',
      accesstoken: '',
      count: null,
      unread_messages: [],
      readed_messages: []
    }
  },
  methods: {
    handleTabChange(val) {
      this.activeTab = val;
    },
    getMessages() {
      let self = this;
      let url = this.$store.state.svrUrl + 'messages?accesstoken=' + this.accesstoken;
      this.axios.get(url).then(function(response) {
        self.unread_messages = response.data.data.hasnot_read_messages;
        self.readed_messages = response.data.data.has_read_messages;
      }).catch(function(err) {
        console.log(err)
      });
    },
    markdownChange(val) {
      return marked(val);
    }
  },
  created() {
    this.$store.dispatch('changeTabValue', '消息');
    this.accesstoken = localStorage.getItem("accesstoken");
    if (this.accesstoken) {
      this.getMessages();
    }
  }
}
</script>

<style>
.tab-content {
  padding-top: 48px;
}

.title {
  text-align: center;
  height: 5rem;
}

.count {
  position: absolute;
  left: 10%;
  top: 20%;
  background-color: #ff5252;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 50%;
}

.lists {
  padding: 1rem;
  overflow-y: auto;
}

.list {
  justify-content: space-between;
  background-color: #f8f8f8;
  padding: 1rem;
  margin-bottom: 1rem;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 6rem;
}

.user>img {
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
}

.user>span {
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
  word-break: normal;
}

.message_content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.message_content>h2 {
  font-weight: 700;
  font-size: 16px;
}

.message_content>p {
  color: #999;
  font-size: 12px;
}

.msg_timer {
  margin-left: 1rem;
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.tips {
  padding: 1rem;
}
</style>
