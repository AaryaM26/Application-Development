const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/user_login', component: UserLogin },
    { path: '/admin_login', component: AdminLogin },
    { path: '/register', component: Register },
    { path: '/user_register', component: UserRegister },
    { path: '/admin_register', component: AdminRegister },
    { path: '/admin_dashboard', component: AdminDashboard },
    { path: '/admin_profile', component: AdminProfile },
    { path: '/add_venue', component: AddVenue },
    { path: '/add_hall', component: AddHall },
    { path: '/add_show', component: AddShow },
    { path: '/admin_edit_prof', component: AdminEditprof },
    { path: '/edit_venue', component: EditVenue },
    { path: '/edit_hall', component: EditHall },
    { path: '/edit_show', component: EditShow },
    { path: '/user_dashboard', component: UserDashboard },
    { path: '/get_shows', component: GetShows },
    { path: '/get_venues', component: GetVenues },
    { path: '/venue_shows', component: VenueShows },
    { path: '/user_profile', component: UserProfile },
    { path: '/user_edit_prof', component: UserEditprof },
    { path: '/booking', component: Booking },
    { path: '/booking_history', component: BookingHistory },
    { path: '/show_search', component: ShowSearch },
    { path: '/venue_search', component: VenueSearch },
  ]
  
  const router = new VueRouter({
    routes
  })
  
  new Vue({
    router
    

  }).$mount('#app')