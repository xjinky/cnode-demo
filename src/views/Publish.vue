<template>
<div class="content">
  <main>
    <v-select :items="lists" label="分类"></v-select>
    <v-text-field v-model="title" label="标题" placeholder="标题字数 10字以上" />
    <v-textarea v-model="content" placeholder="输入文本，支持markdown格式" solo :rows="5" :underlineShow="false" />
    <v-btn @click="pubTopic" class="info">发布话题</v-btn>
  </main>
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
  <!--发布提示-->
  <v-layout row justify-center>
    <v-dialog v-model="publish" max-width="600">
      <v-card>
        <v-card-title class="headline">提示信息</v-card-title>
        <v-card-text>{{tips}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" to="/">好的</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</div>
</template>

<script>
import marked from 'marked';

export default {
  data() {
    return {
      accesstoken: '',
      list: 0,
      lists: ['分享', '问答', '招聘'],
      title: '',
      content: '',
      publish: false,
      tips: '发布接口已关闭,请谅解！',
      tab: '',
      dialog: true //默认弹出登录提示框，用户未登录
    }
  },
  methods: {
    pubTopic() {
      if (this.list === 0) {
        this.tab = 'share'
      } else if (this.list === 1) {
        this.tab = 'ask'
      } else if (this.list === 2) {
        this.tab = 'job'
      }
      if (this.title.length >= 10 && this.content && this.accesstoken) {
        let that = this
        that.content = marked(that.content)
        this.axios.post(this.$store.state.svrUrl + 'topics', {
          accesstoken: that.accesstoken,
          title: that.title,
          tab: that.tab,
          content: that.content
        }).then(function(res) {
          that.title = ''
          that.content = ''
          that.tips = '发表成功！'
          that.publish = true
          setTimeout(function() {
            that.publish = false
          }, 1500)
        }).catch(function(err) {
          that.publish = true;
        })
      } else {
        this.publish = true;
      }
    },
    close() {
      this.publish = false;
    }
  },
  created() {
    this.accesstoken = localStorage.getItem("accesstoken");
    if (this.accesstoken) {
      this.dialog = false
    }
  },
  mounted() {
    this.$store.dispatch('changeTabValue', '发布');
  }
}
</script>

<style scoped>
main {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.text {
  width: 100%;
}

.text-content {
  flex: 1;
  background-color: #f7f7f7;
  padding: 1rem;
  overflow-y: auto;
}
</style>
