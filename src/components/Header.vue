<template>
    <div>
        <v-navigation-drawer v-model="drawer" :mini-variant="mini" absolute light temporary>
            <v-list class="pa-1">
                <v-list-tile v-if="mini" @click.stop="mini = !mini">
                    <v-list-tile-action>
                        <v-icon>chevron_right</v-icon>
                    </v-list-tile-action>
                </v-list-tile>

                <v-list-tile avatar tag="div">
                    <v-list-tile-avatar>
                        <img src="https://randomuser.me/api/portraits/men/85.jpg">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>John Leider</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon @click.stop="mini = !mini">
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>

            <v-list class="pt-0" dense>
                <v-divider light></v-divider>

                <v-list-tile v-for="item in items" :key="item.title">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar dark color="cyan">
            <v-btn icon @click="goBack" v-if="isTopic">
                <v-icon dark>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-side-icon v-else></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">Vue.js中文社区</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>more_vert</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                drawer: null,
                items: [{
                    title: 'Home',
                    icon: 'dashboard'
                },
                    {
                        title: 'About',
                        icon: 'question_answer'
                    }
                ],
                mini: false,
                right: null
            }
        },
        computed: {
            isTopic: function () {
                return this.$route.path == '/content'
            },
            title: function () {
                if (this.$route.path.indexOf('/user/') == -1) {
                    return this.$store.state.titleMap.get(this.$route.path);
                } else {
                    return this.$store.state.titleMap.get('/user');
                }
            }
        },
        methods: {
            goBack() {
                if (this.isTopic) {
                    this.$router.go(-1);
                }
            }
        }
    }
</script>