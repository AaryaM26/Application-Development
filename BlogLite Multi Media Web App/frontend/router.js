const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/feed', component: Feed },
    { path: '/myprofile', component: Myprofile },
    { path: '/search', component: Search },
    { path: '/personaldetails', component: Personaldetails },
    { path: '/addpost', component: Addpost },
    { path: '/editprof', component: Editprof },
    { path: '/following', component: Following },
    { path: '/followers', component: Follower },
    { path: '/editpost', component: Editpost },
    { path: '/deleteprof', component: Deleteprof },
    { path: '/deletepost', component: Deletepost },
    { path: '/logout', component: Logout },
    { path: '/*', component: Errorpage },
  ]
  
  const router = new VueRouter({
    routes
  })
  
  new Vue({
    router
    

  }).$mount('#app')