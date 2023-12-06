const Follower= {
    data() {
      return {
        users: [],
        isFollowing: false,
        useriid:sessionStorage.getItem('userId'),
      };
    },
    async mounted() {
      const otherUserID = this.$route.query.otherUserID;
  
        await this.getFollowingUsers(otherUserID);
  
    },
  
    methods: {
      async getFollowingUsers(otherUserID) {
        try {
          const token = sessionStorage.getItem("token");

          if (token==null)
        { window.alert("please login first");
          this.$router.push('/login')
          
        }
          
          const response = await fetch(`http://127.0.0.1:8080/user/follower?otherUserID=${otherUserID}`, {
            headers: {
              'x-access-token': token
            }
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("data",data)
        if(data.error){
          window.alert(data.error)
          this.$router.push('/feed')
        }
          this.users = data.result;
          console.log(this.users);
        } catch (error) {
          console.error(error);
          // Handle error
        }
      },
      async toggleFollow(userId) {
        try {
          const response = await fetch(`http://127.0.0.1:8080/user/following?otherUserID=${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify({ isFollowing: !this.isFollowing })
          });
      
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to toggle follow.");
          }
      
          // Find the user in the array and update the isFollowing property
          const userIndex = this.users.findIndex(user => user.followerId === userId);
          if (userIndex > -1) {
            this.users[userIndex].isFollowing = !this.users[userIndex].isFollowing;
          }
      
          // Fetch the updated user data and update the component
          await this.getFollowingUsers(this.$route.query.otherUserID);
        } catch (error) {
          console.error(error);
          // Handle error here
        }
      }
    },
    template: `
      <section class="vh-100" style="background-color: #10242d">
        <span style="float:right ;font-size: 15px">
        <a><router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: useriid } }">My Profile</router-link></a>
          <a><router-link style="color:white ;font-size:20px" to="/feed">Feed</router-link></a>
        </span>
        <div class="container py-5 h-800">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="shadow-lg shadow-warning p-3 mb-5 bg-white rounded" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">
                  <div class="form-outline mb-4">
                    <h3 style="font-family:Trebuchet MS; font-size:40px;color:#10242d" class="mb-5">Followers:</h3>
                    <div class="form-outline mb-4">
                      <div class="row mb-3">
                      <div v-for="user in users" :key="user.id" tyle="color:black">
                      <img :src="user.dpLink" alt="Profile picture" style="width:50px;height:50px;">
                      <span><router-link style="color:black ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: user.followerId } }">
                      <label for="inputEmail3" style="color:black" class="col-sm-2 col-form-label">{{ user.follower_name}}</label>
                      </router-link></span>&nbsp &nbsp
          
                      <button v-if="user.isFollowing=='false'" type="button" class="btn btn-success" @click="toggleFollow(user.followerId)">Follow</button>
                      <button v-if="user.isFollowing=='true'" type="button" class="btn btn-danger" @click="toggleFollow(user.followerId)">Unfollow</button>
                    </div>
                      </div>
                    </div> 
                  </div>
                </div>
                  </div>
              </div>
              </div>
          </div>
      </section>
    `
  }