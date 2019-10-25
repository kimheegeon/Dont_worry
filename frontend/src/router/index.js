import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import SendMail from '@/components/SendMail'
import onlyMobile from '@/components/onlyMobile'
import Search from '@/components/Search'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Main',
      name: 'Main',
      component: Main
    },
    {
      path: '/SendMail',
      name: 'SendMail',
      component: SendMail
    },
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    {
      path: '/onlyMobile',
      name: 'onlyMobile',
      component: onlyMobile
    }
  ]
})
