/*
 * @Author: fish119 
 * @Date: 2017-05-22 14:20:40 
 * @Last Modified by: fish119
 * @Last Modified time: 2017-05-22 15:02:31
 */
<template>
<div class="content">
  <main>
    <v-select-field class="text" v-model="list" :labelFocusClass="['label-foucs']" label="选择板块">
      <v-menu-item v-for="text,index in lists" :key="index" :value="index" :title="text" />
    </v-select-field>
    <v-text-field v-model="title" class="text" label="标题" hintText="标题字数 10字以上" />
    <v-text-field v-model="content" class="text text-content" hintText="输入文本，支持markdown格式" multiLine :rows="5" :underlineShow="false" />
    <v-raised-button @click="pubTopic" label="发布话题" class="vueco-btn" icon="near_me" primary/>
  </main>
  <!--登录提示-->
  <v-layout row justify-center>
    <v-btn color="primary" dark @click.stop="dialog = true">
      提示信息
    </v-btn>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline">提示信息</v-card-title>

        <v-card-text>请先登录
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" flat="flat" to="/">
            取消
          </v-btn>

          <v-btn color="green darken-1" flat="flat" to="/person">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-dialog :open="!accesstoken" title="提示：">
    请先登录
    <mu-flat-button slot="actions" primary to="/" label="取消" />
    <mu-flat-button slot="actions" primary to="/person" label="确定" />
  </v-dialog>
  <!--发布提示-->
  <mu-dialog :open="publish" title="提示：">
    {{tips}}
    <mu-flat-button slot="actions" primary @click="close" label="确定" />
  </mu-dialog>
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
      tips: '请正确输入内容',
      tab: '',
      dialog: false
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
