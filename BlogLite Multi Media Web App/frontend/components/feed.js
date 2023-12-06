const Feed = {

  data() {
    return {
      followerFeed: [],
      username:"",
      userid:0,
      showFullCaption: false
    };
  },
  mounted() {
    this.getFollowerFeed();
  },
  methods: {
    async getFollowerFeed() {
      try {
        const token = sessionStorage.getItem("token");
        console.log(token)
        if (token==null)
        { window.alert("please login first");
          this.$router.push('/login')
          
        }
        const response = await fetch("http://127.0.0.1:8080/user/feed", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch user feed.");
        }

        const data = await response.json();
        this.followerFeed = data.message;
        this.username=data.username;
        this.userid=data.userid
        console.log(data)
      } catch (error) {
        console.error(error);
        
      }
    },
    async decodeBase64Image(imageLink) {
      console.log(imageLink)

      return imageLink
    }
  },
  template: `
 <div>
  <div class="container-fluid" style="background-color: #10242d; text-white ;height:150px;">
  <p style="text-align:left ;font-size: 25px">
     <b style="font-family:Trebuchet MS; font-size:25px;color:#e4ebef">Hello {{username}}</b>
     <span style="float:right ;font-size: 15px">
     <a><router-link style="color:white ;font-size:20px" to="/feed">Feed</router-link></a>
     <a><router-link style="color:white ;font-size:20px" to="/search">Search</router-link></a>
     <a><router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: userid } }">My Profile</router-link></a>
     <a><router-link style="color:white ;font-size:20px" to="/addpost">Add Post</router-link></a>
     <a><router-link style="color:white ;font-size:20px;" to="/logout">Logout</router-link></a>
     </span>
  </p>
  <h1 class="text-center" style="color:white ;">Welcome to Bloglite!</h1>
</div>
   <br>
   <center>

   <div v-if="followerFeed.length === 0">
      <p>You are not following anyone. <br> or people you are following have not posted anything</p>
    </div>
    </center>

   <div v-for="(feed, index) in followerFeed" :key="index" >
   <center>
   <div class="card" style="width: 35rem">
   <router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: feed.userId } }">
       <button type="button" class="btn btn-danger" style="text-align:left;width: 35rem">
       
       {{ feed.username }}
       </button></router-link>
       <p style="text-align:center">
       
           
           <div v-if = "feed.imageLink.length > 0"><img  v-bind:src="feed.imageLink" class="card-img-top"  alt="Card image cap" style="width:555px"/>
           </div>
           <div class="card-body" style="text-align:center">
           <h5 class="card-title">{{ feed.title }}</h5>
           <div v-if="feed.caption.length > 200">
             <p class="card-text">
               {{ showFullCaption ? feed.caption : feed.caption.substring(0, 200) + '...' }}
               <a href="#" v-on:click.prevent="showFullCaption = !showFullCaption">
                 {{ showFullCaption ? 'Read less' : 'Read more' }}
               </a>
             </p>
           </div>
           <div v-else>
             <p class="card-text">{{ feed.caption }}</p>
           </div>
           <p>{{ feed.timeStamp }}</p>
         </div>
   </div>
</center> <br>
</div>

</div>
    
  </div>
`
};