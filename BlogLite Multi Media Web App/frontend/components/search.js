const Search = {
  mounted() {
    // ...
  },
  data() {
    return {
      searchString: '',
      users: [],
      isFollowing: false,
      useriid: sessionStorage.getItem('userId'),
      currentSearchString: ''
    };
  },
  
  methods: {
    async searchUsers() {
      try {
        const token = sessionStorage.getItem('token');
        if (token == null) {
          window.alert("please login first");
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8080/user/search?search_string=${this.searchString}`, {
          headers: {
            'x-access-token': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.users = data.result;
        this.currentSearchString = this.searchString;
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
    
        // toggle the 'isFollowing' variable
        this.isFollowing = !this.isFollowing;
    
        // update the user's 'isFollowing' property in the 'users' array
        const userIndex = this.users.findIndex(user => user.userId === userId);
        if (userIndex > -1) {
          this.users[userIndex].isFollowing = this.isFollowing.toString();
        }

        // Reload the search results with the same search string
        this.searchString = this.currentSearchString;
        this.searchUsers();
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    }
    
  },
  watch: {
    searchString: {
      handler(newVal) {
        // Call searchUsers method whenever the value of searchString changes
        this.searchUsers();
      },
      // Call the searchUsers method with a delay of 500ms to avoid calling it too frequently
      // when the user is typing quickly
      debounce: 500,
    },
  },
    template: `
    <section class="vh-100" style="background-color: #10242d ;height:800px;">
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
                                <h3 style="font-family:Trebuchet MS; font-size:40px;color:#10242d" class="mb-5">Search :</h3>

                                <div class="input-group">
                                    <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" v-model="searchString" @keyup.enter="searchUsers"/>
                                    <button type="button" class="btn btn-outline-danger" @click="searchUsers">Search</button>
                                </div>
                                <br>


                                <div class="form-outline mb-4">
                                    <div class="row mb-3">
                                    <div v-for="user in users" :key="user.userId">
                                    <span>
                                    <div v-if="user.isMe=='false'">
                                    <img :src="user.dpLink" alt="Profile picture" style="width:35px;height:35px;">
                                    <router-link style="color:black ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: user.userId } }">
                                    <label for="inputEmail3" class="col-sm-2 col-form-label">{{ user.username }}</label>
                                    </router-link>&nbsp &nbsp
                                    
                          <button v-if="user.isFollowing=='false'" type="button" class="btn btn-success" @click="toggleFollow(user.userId)">Follow</button>
                          <button v-if="user.isFollowing=='true'" type="button" class="btn btn-danger" @click="toggleFollow(user.userId)">Unfollow</button>
                          </div></span>
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