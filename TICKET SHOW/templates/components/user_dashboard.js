const UserDashboard = {

    data() {
      return {
        venue: [],
        show: [],
        latest: [],
        poster: [],
        rated: [],
        username:"",
        user_id:0,
        name:"",
        email_id:"",
        mobile_no: "",
        profile_img_url:'',
        searchString:'',
      };
    },
    mounted() {
      this.userProfile();
    },
    methods: {
      async userProfile() {
        try {
          const token = sessionStorage.getItem("token");
          console.log(token)
          if (token==null)
          { window.alert("please login first");
            this.$router.push('/user_login')
            
          }
          const response = await fetch("http://127.0.0.1:8080/user/user_profile", {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          });
  
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch admin feed.");
          }
  
          const data = await response.json();
          this.venue = data.venues;
          this.poster = data.poster;
          this.rated = data.rated;
          this.show = data.shows;
          this.latest = data.latest;
          this.username=data.username;
          this.user_id=data.user_id;
          this.name=data.name;
          this.email_id=data.email_id;
          this.mobile_no=data.mobile_no;
          this.profile_img_url=data.profile_img_url;
          sessionStorage.setItem("profile_img_url",this.profile_img_url);
          console.log("hi")
        } catch (error) {
          console.error(error);
          
        }
      },
      async decodeBase64Image(profile_img_url) {
        console.log(profile_img_url)
  
        return profile_img_url
      },
      async decodeBase64Image(poster_url) {
        console.log(poster_url)
  
        return poster_url
      },
    //   async deleteVenue(venue_id) {
    //     const token = sessionStorage.getItem('token')
    //     console.log(venue_id)
    
    //     const response = await fetch(`http://127.0.0.1:8080/admin/deleteVenue/${venue_id}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'x-access-token': token,
    //       },
    //     })
    //     const data = await response.json();
    //         console.log("data",data)
    
    //     if (response.status === 200) {
    //       alert('Venue deleted successfully!')
          
    //       window.location.reload();
    //     } else {
    //       alert('Failed to delete venue')
    //     }
    //   },
  
    //   async deleteShow(show_id) {
    //     const token = sessionStorage.getItem('token')
    
    //     const response = await fetch(`http://127.0.0.1:8080/admin/deleteShow/${show_id}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'x-access-token': token,
    //       },
    //     })
    //     const data = await response.json();
    //         console.log("data",data)
    
    //     if (response.status === 200) {
    //       alert('Show deleted successfully!')
          
    //       window.location.reload();
    //     } else {
    //       alert('Failed to delete show')
    //     }
    //   },
  
    //   async deleteHall(hall_id) {
    //     const token = sessionStorage.getItem('token')
    
    //     const response = await fetch(`http://127.0.0.1:8080/admin/deleteHall/${hall_id}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'x-access-token': token,
    //       },
    //     })
    //     const data = await response.json();
    //         console.log("data",data)
    
    //     if (response.status === 200) {
    //       alert('Hall deleted successfully!')
          
    //       window.location.reload();
    //     } else {
    //       alert('Failed to delete hall')
    //     }
    //   },
  
    },
    template: `
    <div class="dashboard">
  <div class="container">
    <nav>
      <ul>
        <li class="sidebar">
          <router-link to="/user_profile" class="logo">
            <div v-if="profile_img_url.length > 0">
              <img v-bind:src="profile_img_url">
            </div>
            <div v-else>
              <img src=../static/logo.png alt="">
            </div>
            <span class="nav-item">{{username}}</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/user_dashboard">
            <i class="fas fa-home"></i>
            <span class="nav-item">Home</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/user_profile">
            <i class="fas fa-user"></i>
            <span class="nav-item">Profile</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/get_shows">
            <i class="fas fa-file-video"></i>
            <span class="nav-item">Shows</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/get_venues">
            <i class="fas fa fa-location-arrow"></i>
            <span class="nav-item">Venues</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/booking_history">
            <i class="fas fa fa-ticket"></i>
            <span class="nav-item">Booking History</span>
          </router-link>
        </li>

        <li class="sidebar">
          <router-link to="/user_edit_prof">
            <i class="fas fa-cogs"></i>
            <span class="nav-item">Settings</span>
          </router-link>
        </li>

        

        <li class="sidebar">
          <router-link to="/login" class="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-item">Logout</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <section class="main">
      <div class="main-top">
        <router-link to="/user_edit_prof">
          <i class="fas fa-user-cog"></i>
        </router-link>
        <div class="search-bar">
          <input type="text" placeholder="Search for movies" v-model="searchString">
          <router-link :to="{ path: '/show_search', query: { searchString: searchString } }"><button><i class="fas fa-search">  Search</i></button></router-link>
        </div>
      </div>
      <br>

      <div class="main-skills1">
        <div class="card1">
        <router-link to="/get_shows"><img src=../static/banner.png></router-link>
        </div>
      </div>

      <section class="main-course">
        <h1>Popular Shows</h1>
        <br>
        <div class="course-box1">
          <div class="course">
            <div class="boxs1" v-for="(show, index) in poster" :key="index">
              <div class="poster1">
                <img v-bind:src="show.poster_url">
                <router-link :to="{ path: '/booking', query: { show_id: show.show_id } }"><button class="show-button">Book</button></router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="main-skills1">
        <div class="card1">
        <router-link to="/get_shows"><img src=../static/banner2.jpg></router-link>
        </div>
      </div>

      <section class="main-course">
        <h1>Latest Shows</h1>
        <div class="course-box">
          <div class="course">
            <div class="boxs" v-for="(show, index) in latest" :key="index">
              <h3>{{show.show_name}}</h3>
              <p>Rating - {{show.rating}}/5 ({{show.total_rating}})</p>
              <h4>Poster</h4>
              <div v-if="show.poster_url.length > 0" class="poster">
                <img v-bind:src="show.poster_url"></img>
              </div>
              <router-link :to="{ path: '/booking', query: { show_id: show.show_id } }"><button>Book</button></router-link>
              <i class="fas fa-file-video show"></i>
            </div>
          </div>
        </div>
      </section>

      <div class="main-skills1">
        <div class="card1">
        <router-link to="/get_shows"><img src=../static/banner4.png></router-link>
        </div>
      </div>

      <section class="main-course">
        <h1>Top rated Shows</h1>
        <div class="course-box">
          <div class="course">
            <div class="boxs" v-for="(show, index) in rated" :key="index">
              <h3>{{show.show_name}}</h3>
              <p>Rating - {{show.rating}}/5 ({{show.total_rating}})</p>
              <h4>Poster</h4>
              <div v-if="show.poster_url.length > 0" class="poster">
                <img v-bind:src="show.poster_url"></img>
              </div>
              <router-link :to="{ path: '/booking', query: { show_id: show.show_id } }"><button>Book</button></router-link>
              <i class="fas fa-file-video show"></i>
            </div>
          </div>
        </div>

      <section class="main-course">
        <h1>Shows</h1>
        <div class="course-box">
          <div class="course">
            <div class="boxs" v-for="(show, index) in show" :key="index">
              <h3>{{show.show_name}}</h3>
              <p>Rating - {{show.rating}}/5 ({{show.total_rating}})</p>
              <h4>Poster</h4>
              <div v-if="show.poster_url.length > 0" class="poster">
                <img v-bind:src="show.poster_url"></img>
              </div>
              <router-link :to="{ path: '/booking', query: { show_id: show.show_id } }"><button>Book</button></router-link>
              <i class="fas fa-file-video show"></i>
            </div>
          </div>
        </div>
      </section>

      <div class="main-skills1">
        <div class="card1">
        <router-link to="/get_venues"><img src=../static/banner3.png></router-link>
        </div>
      </div>

      <section class="main-course">
        <h1>Venues</h1>
        <div class="course-box">
          <div class="course">
            <div class="boxs" v-for="(venue, index) in venue" :key="index">
              <h3>{{venue.venue_name}}</h3>
              <p>Place - {{venue.place}}</p>
              <p>Location - {{venue.location}}</p>
              <router-link :to="{ path: '/venue_shows', query: { venue_id: venue.venue_id } }"><button>Visit</button></router-link>
              <i class="fa fa-location-arrow venue"></i>
            </div>
          </div>
        </div>
      </section>
      <footer class="footer">
        <div class="social-icons">
          <a href="https://www.linkedin.com/in/farhan17/" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-linkedin"></i>
          </a>
          <a href="https://github.com/MdFarhan00" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-github"></i>
          </a>
          <a href="https://www.instagram.com/zeroyd_2000/" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">Version 1.0.0</a>
          
          <!-- Add more social media icons as needed -->
        </div>
      </footer>
    </section>

  </div>
</div>

  `
  };