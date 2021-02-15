import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/sellerpage',
    component:() => import('../views/SellerPage')
  },
  {
    path:'/trendpage',
    component:() => import('../views/TrendPage.vue')
  },
  {
    path:'/mappage',
    component:() => import('../views/MapPage.vue')
  },
  {
    path:'/rankpage',
    component:() => import('../views/RankPage.vue')
  },
  {
    path:'/hotpage',
    component:() => import('../views/HotPage.vue')
  },
  {
    path:'/stockpage',
    component:() => import('../views/StockPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
