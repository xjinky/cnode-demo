<template>
<div class="content">
  <v-tabs color="cyan" v-model="active" :value="activeTab" grow dark slider-color="yellow">
    <v-layout>
      <v-tab ripple v-for="(item,index) in tabs" :key="index" @change="handleTabChange(item.tag)">{{ item.title }}</v-tab>
    </v-layout>
  </v-tabs>
  <!--登录提示-->
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline">提示信息</v-card-title>
        <v-card-text>请先登录</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" to="/">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" to="/person">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <!-- 未读消息列表 -->
    <v-layout wrap row v-if="accesstoken" v-show="activeTab === 'unread'">
      <v-flex xs3 sm3 v-for="(item,index) in unread_messages" :key="index">
        <v-card>
          <img :src="item.author.avatar_url" alt="user">
          <v-card-title primary-title>
            <div>
              <p class="text-md-center">{{ item.author.loginname }}</p>
              <!-- <h2 v-if="item.reply.content" v-html="markdownChange(item.reply.content)"></h2> -->
              <!-- <h2 class="text-md-center" v-if="!item.reply.content">此内容已被作者删除</h2> -->
              <p class="text-md-center">来自：《{{item.topic.title}}》</p>
              <span>{{item.reply.create_at | time_ago}}</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn block :to="{path:'/content',query:{id:item.topic.id}}" color="info">查看</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="accesstoken" class="lists" v-show="activeTab === 'unread'">
      <v-flex row>
        <p class="text-md-center text-xs-center" v-if="!unread_messages.length">暂无消息</p>
      </v-flex>
    </v-layout>
  <!-- 已读消息列表 -->
  <v-layout row v-if="accesstoken" v-show="activeTab === 'readed'">
    <v-flex xs12 sm12>
      <v-card>
        <v-list subheader two-line>
          <div v-for="(item,index) in readed_messages" :key="index">
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="item.author.avatar_url" alt="user">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.author.loginname"></v-list-tile-title>
                <!-- <h2 v-if="item.reply.content" v-html="markdownChange(item.reply.content)"></h2> -->
                <!-- <h2 class="text-md-center" v-if="!item.reply.content">此内容已被作者删除</h2> -->
                <p class="text-md-center">来自：《{{item.topic.title}}》</p>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn block :to="{path:'/content',query:{id:item.topic.id}}" color="info">查看</v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </div>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
    <v-layout v-if="accesstoken" class="lists" v-show="activeTab === 'readed'">
      <v-flex row>
        <p class="text-md-center text-xs-center" v-if="!readed_messages.length">暂无消息</p>
      </v-flex>
    </v-layout>
</div>
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      dialog:true,
      activeTab: 'unread',
      active: null,
      accesstoken: '',
      count: null,
      tabs: [{
          tag: 'unread',
          title: '未读消息'
        },
        {
          tag: 'readed',
          title: '已读消息'
        }
      ],
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
      this.$ajax.get(url).then(function(response) {
        self.unread_messages = response.data.data.hasnot_read_messages;
        self.readed_messages = response.data.data.has_read_messages;
      }).catch(function(err) {});
    },
    markdownChange(val) {
      return marked(val);
    }
  },
  created() {
    this.$store.dispatch('changeTabValue', '消息');
    this.accesstoken = localStorage.getItem("accesstoken");
    if (this.accesstoken) {
      this.dialog = false;
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
