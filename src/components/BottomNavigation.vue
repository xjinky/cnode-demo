<template>
<v-card flat>
    <v-bottom-nav :value="bottomNav" fixed @change="handleChange">
        <v-layout justify-space-between>
            <v-btn color="teal" flat value="home" to="/">
                <span>首页</span>
                <v-icon>home</v-icon>
            </v-btn>

            <v-btn color="teal" flat value="publish" to="/publish">
                <span>发布</span>
                <v-icon>publish</v-icon>
            </v-btn>

            <v-btn color="teal" flat value="messages" to="/messages">
                <span>消息</span>
                <v-icon>message</v-icon>
            </v-btn>

            <v-btn color="teal" flat value="person" to="/person">
                <span>我的</span>
                <v-icon>person</v-icon>
            </v-btn>
        </v-layout>
    </v-bottom-nav>
</v-card>
</template>
<script>
export default {
    data() {
        return {}
    },
    computed: {
        bottomNav() {
            return this.$store.state.tabValue;
        }
    },
    methods: {
        handleChange(val) {
            this.$store.dispatch('changeTabValue', val);
        }
    }
};
</script>
