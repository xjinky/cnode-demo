<template>
<div class="content">
  <!--标题区-->
  <header class="md_header">
    <h2>
      <span class="tag" v-if="data.top">置顶</span>
      <span class="tag" v-else-if="data.good">精华</span> {{data.title}}
    </h2>

    <v-layout row align-center>
      <v-flex xs8 sm4>
        <span>
            <v-avatar size="22">
              <img :src="data.author.avatar_url">
            </v-avatar>
            {{ data.author.loginname }}&nbsp;
          </span>
        <span>发布于 {{data.create_at | time_ago('YYYY-MM-DD HH:mm:ss')}}&nbsp;&nbsp;</span>
        <span>{{ data.visit_count }}次浏览&nbsp;</span>
      </v-flex>
      <v-flex xs4 sm8>
        <span>
            <v-checkbox @change="favorTopic"
              v-if="accesstoken"
              v-model="favorite"
              :label="favorite_txt"
            />
          </span>
      </v-flex>
    </v-layout>
  </header>
  <!-- 内容区 -->
  <article class="md_content" v-html="data.content"></article>
  <!-- 评论区 -->
  <v-layout style="padding-bottom:60px;" v-if="data.replies.length">
    <v-flex xs12 sm12>
      <v-list subheader>
        <v-subheader inset>{{data.replies.length}}条回复</v-subheader>
        <div v-for="(item,index) in data.replies" :key="index">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <router-link :to="'/user/'+item.author.loginname" :src="item.author.avatar_url" tag="img" alt="user"></router-link>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <!-- <span>{{index+1}}楼 • {{item.create_at | datefmt('YYYY-MM-DD HH:mm:ss')}}</span> -->
              <span>{{item.author.loginname}}&nbsp;&nbsp;</span>
              <v-list-tile-sub-title v-html="item.content"></v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple @click="like(index)" v-if="item.ups.length && !accesstoken">
                <v-icon small color="grey lighten-1">thumb_up</v-icon>
                <span>{{item.ups.length}}</span>
              </v-btn>
              <v-btn icon ripple @click="like(index)" v-if="accesstoken">
                <v-icon small color="grey lighten-1">thumb_up</v-icon>
                <span>{{item.ups.length}}</span>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </div>
      </v-list>
      <p class="text-md-center text-xs-center" style="padding-top:1rem;">已经到底了啊</p>
    </v-flex>
  </v-layout>
  <!-- 添加回复区-->
  <v-container fluid grid-list-md style="padding-bottom:100px;display:none;">
    <v-layout row wrap>
      <v-subheader>添加回复</v-subheader>
      <v-flex xs12>
        <v-textarea placeholder="请输入回复内容.." v-model="reply" outline name="input-7-4"></v-textarea>
        <v-btn @click="submit_reply" color="info">回复</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
export default {
  data() {
    return {
      accesstoken: "",
      data: {
        author: {},
        replies: {}
      },
      favorite: false,
      single_reply: "",
      reply: "",
      tips: "",
      showReplyDialog: false
    };
  },
  computed: {
    favorite_txt: function() {
      return this.favorite ? "取消收藏" : "收藏";
    }
  },
  methods: {
    //获取帖子内容
    getTopic() {
      const id = this.$route.query.id;
      let that = this;
      let url = this.$store.state.svrUrl + "/topic/" + id;
      this.$ajax
        .get(url)
        .then(function(response) {
          that.data = response.data.data;
          that.data.replies.map(function(item) {
            item.reply_show = false;
            item.cteate_at = moment(item.cteate_at, "YYYYMMDD").fromNow();
          });
        })
        .catch(function(err) {});
      if (this.accesstoken) {
        this.isFavorited();
      }
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.showReplyDialog = false;
    },
    // 添加评论
    submit_reply() {
      if (this.reply && this.reply.length > 0) {
        let id = this.$route.query.id;
        let that = this;
        this.$ajax
          .post(this.$store.state.svrUrl + "topic/" + id + "/replies", {
            accesstoken: that.accesstoken,
            content: that.reply
          })
          .then(function(res) {
            if (res.status == 200 && res.data.success == true) {
              that.showReplyMsg(that, "回复成功");
              that.getTopic();
              that.reply = "";
            } else {
              that.showReplyMsg(that, "回复失败，请确认无误后再试");
            }
          })
          .catch(function(err) {
            that.showReplyMsg(that, "回复失败，请确认无误后再试");
          });
      } else {
        this.showReplyMsg(this, "请输入回复内容...");
      }
    },
    //收藏主题
    favorTopic() {
      let id = this.$route.query.id;
      let that = this;
      let f_method = this.favorite ? "collect" : "de_collect";
      this.$ajax.post(this.$store.state.svrUrl + "topic_collect/" + f_method, {
        accesstoken: that.accesstoken,
        topic_id: id
      });
    },
    //判断帖子是否已被收藏
    isFavorited() {
      //收藏
      let that = this;
      this.$ajax
        .get(this.$store.state.svrUrl + "topic_collect/" + that.loginname)
        .then(function(response) {
          // 获取收藏主题数组
          let arr = response.data.data;
          //本页主题id
          let collect_id = that.data.id;
          //find 本页主题是否在已收藏列表
          arr.find(function(item) {
            if (item.id === collect_id) {
              that.favorite = true;
            }
          });
        });
    },
    //为评论点赞
    like(index) {
      //data.replies
      let that = this;
      this.$ajax
        .post(
          this.$store.state.svrUrl +
          "reply/" +
          that.data.replies[index].id +
          "/ups", {
            accesstoken: that.accesstoken
          }
        )
        .then(function(res) {
          if (res.data.error_msg) {
            that.showReplyMsg(that, res.data.error_msg);
          } else {
            if (res.data.action == "down") {
              that.data.replies[index].ups.splice(0, 1);
            } else {
              that.data.replies[index].ups.push("-1");
            }
          }
        });
    },
    //显示/关闭 对评论进行回复的对话框
    showReplyToComment(index, isShow) {
      this.single_reply = isShow ?
        "@" + this.data.replies[index].author.loginname + " " :
        "";
      let arr = this.data.replies;
      arr[index].reply_show = isShow;
      this.$set(arr, index, arr[index]);
    },
    //对评论进行回复
    replyToComment(reply) {
      let id = this.$route.query.id;
      let that = this;
      this.$ajax
        .post(this.$store.state.svrUrl + "topic/" + id + "/replies", {
          accesstoken: that.accesstoken,
          content: that.single_reply,
          reply_id: reply.id
        })
        .then(function(response) {
          that.showReplyMsg(that, "回复成功");
          that.getTopic();
          that.single_reply = "";
        })
        .catch(function(error) {
          that.showReplyMsg(that, "回复失败，请确认无误后重试");
        });
    },
    showReplyMsg(that, msg) {
      that.tips = msg;
      that.showReplyDialog = true;
      setTimeout(function() {
        that.showReplyDialog = false;
      }, 1500);
    }
  },
  created() {
    this.accesstoken = localStorage.getItem("accesstoken");
    this.loginname = localStorage.getItem("loginname");
    this.getTopic();
  }
};
</script>

<style>
.favorite-box .mu-checkbox-label {
  color: #009688;
}
</style>

<style scoped>
.content {
  justify-content: flex-start;
}

.title {
  height: 5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.md_header {
  padding: 1rem;
}

.md_header h1 {
  font-weight: 700;
}

.md_header .label span:before {
  content: "•";
  padding: 0 0.5rem;
}

.md_header .label span {
  font-size: 12px;
  color: #838383;
  font-weight: 400;
  padding: 0 0.2rem;
}

.tag {
  background-color: #009688;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 0.2rem;
}

.favorite-box {
  font-size: 20px;
  font-weight: 700;
}

.md_content {
  padding: 1rem;
  border-top: 1px solid #e5e5e5;
  margin-bottom: 2rem;
}

.md_content h1,
.md_content h2,
.md_content h3,
.md_content h4,
.md_content h5,
.md_content h6 {
  font-weight: 700;
}

.md_content p {
  font-size: 15px;
  line-height: 1.7em;
  overflow: auto;
}

.md_content h2 {
  font-size: 26px;
  margin: 30px 0 15px;
  border-bottom: 1px solid #eee;
}

.md_content h3 {
  margin: 30px 0 15px;
  border-bottom: 1px solid #eee;
  font-size: 24.5px;
}

.md_content pre {
  font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
  font-size: 14px;
  border-radius: 0;
  padding: 1rem;
  border: 0;
  margin: 1rem 0;
  border-width: 1px 0;
  background: #f7f7f7;
}

.md_content ul {
  list-style-type: disc;
  margin: 0 0 1rem 2rem;
}

.md_content ol {
  list-style: decimal;
  margin-left: 2em;
}

.md_content li {
  line-height: 2.5rem;
}

.md_content a {
  display: block;
}

.md_content img {
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  border: 0;
}


/*评论区样式*/

.replies>li {
  padding: 1rem;
}

.replies>li:first-child {
  background-color: #f6f6f6;
}

.reply {
  width: 100%;
  border-top: 1px solid #f0f0f0;
}

.reply>.msg {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  flex-wrap: nowrap;
}

.reply>p {
  margin-bottom: 2rem;
}

.author>img {
  width: 3rem;
  height: 3rem;
  vertical-align: top;
}

.author>.name {
  color: #666;
  font-weight: 700;
}

.author>.timer {
  color: #08c;
}

.msg>.ups {
  display: flex;
  align-items: center;
  color: #009688;
}

.ups>span {
  margin-left: 0.5rem;
}

.textsms {
  margin-left: 1rem;
  color: #009688;
}

.reply_show {
  animation: reply_show 1s ease;
}

@keyframes reply_show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
