const Myprofile = {

  data() {
    return {
      pageTitle: "My Profile",
      profile: {},
      posts: [],
      isFollowing :false,
      isMe: false,
      userid:0,
      showFullCaption: false
    };
  },
  
  async mounted() {
    const otherUserID = this.$route.query.otherUserID;
      await this.getOtherUserProfile(otherUserID);
      const token = sessionStorage.getItem('token')
    if (token === null) {
      window.alert('Please login first')
      this.$router.push('/login')
    }

  },

  
  methods: {

    
    async getOtherUserProfile(otherUserID) {
      try {
        const token = sessionStorage.getItem("token");

          if (token==null)
          { window.alert("please login first");
            this.$router.push('/login')
            
          }
        const response = await fetch(`http://127.0.0.1:8080/user/profile?otherUserID=${otherUserID}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch user profile.");
        }

        const data = await response.json();
        console.log("data",data)
        if(data.error){
          window.alert(data.error)
          this.$router.push('/feed')
        }
        this.profile = data;
        console.log("profile")
        console.log(this.profile)
        this.posts = data.result;
        this.isFollowing =data.following;
        console.log(this.isFollowing)
        this.userid = data.myuserid;
        
        console.log(this.isMe)

      } catch (error) {
        console.error(error);
        // Handle error here
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

          body: JSON.stringify({ isFollowing: this.isFollowing })
        });

        console.log(this.isFollowing)
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to toggle follow.");
        }
    
        
        if(this.isFollowing=="true"){
          this.isFollowing="false";
        }
        else{
          this.isFollowing="true";
        }
        console.log(this.isFollowing)
        if (this.isFollowing=="true") {
          // Increment follower count if isFollowing is true
          this.profile.followerCount += 1;
        } else {
          // Decrement follower count if isFollowing is false
          this.profile.followerCount -= 1;
        }
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    },
     
    

  },
  
  template: `
  <div>
  <div class="container-fluid" style="background-color: #10242d; height:100px;">
  <p style="text-align:left ;font-size: 25px">
      <b style="font-family:Trebuchet MS; font-size:25px;color:#e4ebef">Hello</b>
      <span style="float:right ;font-size: 15px">
      <a><router-link style="color:white ;font-size:20px" to="/feed">Feed</router-link></a>
      <a><router-link style="color:white ;font-size:20px" to="/search">Search</router-link></a>
      
      <a href="#" @click="getOtherUserProfile(userid) " style="color:white ;font-size:20px"><router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: userid } }">My Profile</router-link></a>
      <a><router-link style="color:white ;font-size:20px" to="/addpost">Add Post</router-link></a>
      <a><router-link style="color:white ;font-size:20px;" to="/logout">Logout</router-link></a>
      </span>
  </p>
</div>
     <div class="py-5">
          <div class="container text-center">
              <div class="row">
                  <div class="col">
                      <p style="text-align:left">
                          
                          <img  v-bind:src="profile.imageLink" class="card-img-top" style="width:100px;height:100px;" alt="Profile Photo"/>
                          </p>
                  </div>
                  <div class="col" style="font-family:Trebuchet MS;color:black ;font-size:30px"><b>Total Blogs <br> {{ profile.totalPost }}</b></div>
                  
                  <div class="col" style="font-family:Trebuchet MS;color:black ;font-size:30px"><router-link :to="{ path: '/following', query: { otherUserID: profile.userId } }" style="font-family:Trebuchet MS;color:black ;font-size:30px">Following <br> {{ profile.followingCount }}</router-link></div>
                  <div class="col" style="font-family:Trebuchet MS;color:black ;font-size:30px"><router-link :to="{ path: '/followers', query: { otherUserID: profile.userId } }" style="font-family:Trebuchet MS;color:black ;font-size:30px">Followers <br>{{ profile.followerCount }} </router-link></div>
                  <div class="card-body" style="text-align:left">
                      <h5 class="card-title">@{{ profile.username }}</h5>
                      <p class="card-text">{{ profile.Name }}</p>
                      
                      
                      <div v-if="profile.isMyProfile=='true'">
                      <router-link style="color:white ;font-size:20px" to="/editprof"><button type="button" class="btn btn-danger" @click="">Edit Profile</button></router-link>
                      
                      </div>
                      <div v-if="profile.isMyProfile=='false'">

                      <button v-if="isFollowing=='false'" type="button" class="btn btn-success" @click="toggleFollow(profile.userId)">Follow</button>
                      <button v-if="isFollowing=='true'" type="button" class="btn btn-danger" @click="toggleFollow(profile.userId)">Unfollow</button>
                      </div><br><br>
                      
                      <p><b> Blogs </b></p>
                <div v-if="profile.isMyProfile=='true'">
                
                <div class="container mt-3">
                <center>
                <div v-if="posts.length === 0">
                  <p>No Blogs uploaded yet!</p>
                  <router-link style="color:Black ;font-size:20px" to="/addpost">Add Post</router-link>
                </div>
    
                <br><div class="row row-cols-3 ">
							  <div v-for="(post, index) in posts" :key="index">
                <div class="col">

                <div class="card" style="width: 18rem;">

                
                <div class="btn-group">
                <button class="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 18rem;">
                  {{profile.username}}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="width: 18rem;">
                <router-link style="color:black ;font-size:20px" :to="{ path: '/editpost', query: { blog_id: post.blogId } }"><a class="dropdown-item" >edit</a></router-link>
                <router-link style="color:black ;font-size:20px" :to="{ path: '/deletepost', query: { blog_id: post.blogId } }"><a class="dropdown-item" >delete</a></router-link>
                
                </div>
              </div>

                

                <img  v-bind:src="post.imageLink" class="card-img-top"  alt="post.title"/>
<br>
                <div class="card-body">
                  <h5 class="card-title">{{ post.title }}</h5>

                  
                  <div v-if="post.caption.length > 200">
                  <p class="card-text">
                    {{ showFullCaption ? post.caption : post.caption.substring(0, 200) + '...' }}
                    <a href="#" v-on:click.prevent="showFullCaption = !showFullCaption">
                      {{ showFullCaption ? 'Read less' : 'Read more' }}
                    </a>
                  </p>
                </div>
                <div v-else>
                  <p class="card-text">{{ post.caption }}</p>
                </div>



                  <p class="card-text">{{ post.timeStamp }}</p>
                  
                </div>
              </div>
              </div>
              </div>
              </div>
              </center>
              </div>
              </div>


              <div v-if="profile.isMyProfile=='false'"> 
              <div class="container mt-3">
                <center>
                <div v-if="posts.length === 0">
                  <p>No Blogs uploaded yet!</p>
                  
                </div>
                <br><div class="row row-cols-3 ">
              

              <div v-for="(post, index) in posts" :key="index">
              <div class="col">
              <div class="card" style="width: 18rem;">
              <button type="button" class="btn btn-danger" style="text-align:left">{{ profile.username }}</button>

              
              <img  v-bind:src="post.imageLink" class="card-img-top"  alt="post.title"/>
<br>
              <div class="card-body">
                <h5 class="card-title">{{ post.title }}</h5>
                
                <div v-if="post.caption.length > 200">
                  <p class="card-text">
                    {{ showFullCaption ? post.caption : post.caption.substring(0, 200) + '...' }}
                    <a href="#" v-on:click.prevent="showFullCaption = !showFullCaption">
                      {{ showFullCaption ? 'Read less' : 'Read more' }}
                    </a>
                  </p>
                </div>
                <div v-else>
                  <p class="card-text">{{ post.caption }}</p>
                </div>
                <p class="card-text">{{ post.timeStamp }}</p>
                
              </div>
            </div>

            </div>
            </div>
              </div>
              </center>
              </div>
            </div>
          </div>
      </div>
</div>
`
};