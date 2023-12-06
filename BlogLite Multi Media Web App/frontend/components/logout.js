const Logout = {
  mounted() {
    const token = sessionStorage.getItem('token')
    if (token === null) {
      window.alert('Please login first')
      this.$router.push('/login')
    }
  },
    methods: {
        handleLogout() {
          sessionStorage.clear();
          this.$router.push('/login');
        }
      },
    template: `
    <div>
      <div class="container-fluid" style="background-color: #10242d; text-white ;height:720px;">
      <h1 class="text-center" style="color:white ;;font-size:50px">Sure you want to Logout?</h1>
      <center><button type="button" class="btn btn-danger" @click="handleLogout" >Yes, LogOut</button>
      <router-link style="color:black ;font-size:20px" to="/feed"><button type="button" class="btn btn-danger" >No, Go to my feed</button></router-link>
      </center>
      </div>
      </div>


    `
  }