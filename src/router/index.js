import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Publish from '../views/Publish'
import Messages from '../views/Messages'
import Person from '../views/Person'
import Content from '../views/Content'
import User from '../views/User'


Vue.use(VueRouter)
const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/publish', name: 'Publish', component: Publish },
    { path: '/messages', name: 'Messages', component: Messages },
    { path: '/person', name: 'Person', component: Person },
    { path: '/content', name: 'Content', component: Content },
    { path: '/user/:id', name: 'User', component: User }
];
const router = new VueRouter({
    routes,
})
export default router;
