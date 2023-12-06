const Deleteprof = {
  mounted() {
    const token = sessionStorage.getItem('token')
    if (token === null) {
      window.alert('Please login first')
      this.$router.push('/login')
    }
  },
    methods: {
      async deleteProfile() {
        try {
          const token = sessionStorage.getItem("token");

          if (token==null)
          { window.alert("please login first");
            this.$router.push('/login')
            
          }
          const response = await fetch('http://127.0.0.1:8080/user/deleteProfile', {
            method: 'DELETE',
            headers: {
              'x-access-token': token,
            },
          });
          const data = await response.json();
          console.log(data)
          if (response.status === 200) {
            alert('Profile deleted successfully!');
            sessionStorage.clear();
            this.$router.push('/login');
          } else {
            alert('Error deleting profile.');
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    
    template: `
      <div>
      <div class="container-fluid" style="background-color: #10242d; text-white ;height:720px;">
      <h1 class="text-center" style="color:white ;;font-size:50px">Are you sure you want to delete your profile?</h1>
  
      <center><button type="button" class="btn btn-danger" @click="deleteProfile" >Yes, delete my profile</button>
      <router-link style="color:black ;font-size:20px" to="/feed"><button type="button" class="btn btn-danger" >No, Go to my feed</button></router-link>
      </center>
      </div>
      </div>
    `,
  };
  