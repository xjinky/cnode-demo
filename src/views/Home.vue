<template>
<div>
  <v-toast style="bottom:50%;text-align: center;" v-if="toast" :message="toastMsg" @close="hideToast" />
  <v-tabs v-model="active" color="cyan" fixed-tabs dark slider-color="yellow">
    <v-layout justify-space-between>
      <v-tab ripple v-for="(item,index) in items" :key="index" @change="handleTabChange(item.tag)"> {{ item.title }}</v-tab>
    </v-layout>
  </v-tabs>
  <v-layout row>
    <v-flex xs12 sm12>
      <v-card>
        <v-list subheader two-line>
          <div v-for="(item,index) in topics" :key="index" avatar>
            <router-link style="text-decoration:none;color:#000" :to="{path:'/content',query:{id:item.id}}">
              <v-list-tile>
                <v-list-tile-avatar>
                  <img :src="item.author.avatar_url">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <span>
                    <v-icon small>person</v-icon>&nbsp;{{item.author.loginname}}&nbsp;&nbsp;&nbsp;&nbsp;
                    <v-icon small>remove_red_eye</v-icon>&nbsp;{{item.visit_count}}&nbsp;/&nbsp;
                    <v-icon small>comment</v-icon>&nbsp;{{item.reply_count}}
                  </span>
                </v-list-tile-content>
                <v-list-tile-action>
                  <span>{{item.create_at | time_ago('YYYY-MM-DD HH:mm:ss')}}</span>
                </v-list-tile-action>
              </v-list-tile>
            </router-link>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  <div class="text-xs-center text-md-center" style="padding-top:30px;padding-bottom:80px;" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
    <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
  </div>
</div>
</template>

<script>
import appHeader from "../components/Header";
import bottomNavigation from "../components/BottomNavigation";
export default {
  components: {
    appHeader,
    bottomNavigation
  },
  data() {
    return {
      items: [{
          tag: 'all',
          title: "全部",
        }, {
          tag: 'good',
          title: "精华"
        },
        // {
        //   tag: 'weex',
        //   title: "weex"
        // },
        {
          tag: 'share',
          title: '分享'
        },
        {
          tag: 'ask',
          title: '问答'
        },
        {
          tag: 'job',
          title: '招聘'
        }
      ],
      activeTab: "all",
      page: 1,
      toastMsg: "",
      toast: false,
      topics: null,
      scroller: null,
      loading: false,
      refreshing: false,
      active: null,
      busy: false
    };
  },
  mounted() {
    this.$store.dispatch("changeTabValue", "首页");
    this.scroller = this.$el;
    this.getTopics("all");
  },
  methods: {
    handleTabChange(val) {
      this.loading = false;
      this.activeTab = val;
      this.getTopics();
    },
    getTopics() {
      this.page = 1;
      let url = this.$store.state.svrUrl + "topics?tab=" + this.activeTab + "&page=" + this.page;
      const self = this;
      self.refreshing = true;
      this.$ajax
        .get(url)
        .then(function(res) {
          if (res.status == 200) {
            self.topics = [];
            self.topics = res.data.data;
          } else {
            self.showToast("获取数据失败，请稍后重试");
          }
          self.refreshing = false;
        })
        .catch(function(err) {
          console.log(err);
          self.refreshing = false;
        });
    },
    loadMore() {
      this.page++;
      let url = this.$store.state.svrUrl + "topics?tab=" + this.activeTab + "&page=" + this.page;
      this.busy = true;
      const self = this;
      self.loading = true;
      setTimeout(() => {
        this.$ajax
          .get(url)
          .then(function(res) {
            if (res.status == 200) {
              self.topics = self.topics.concat(res.data.data);
            } else {
              self.showToast("获取数据失败，请稍后重试");
              self.page--;
            }
            self.loading = false;
          })
          .catch(function(err) {
            self.loading = false;
            console.log(err);
            self.page--;
          });
        self.busy = false;
      }, 1000)
    },
    showToast(msg) {
      this.toastMsg = msg;
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast = false;
      }, 1500);
    },
    hideToast() {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    },
    toUser(val) {
      this.$router.push("/user/" + val);
    }
  },
};
</script>

<style scoped>

</style>
