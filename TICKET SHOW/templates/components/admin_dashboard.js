const AdminDashboard = {

  data() {
    return {
      venue: [],
      show: [],
      hall: [],
      adminname:"",
      admin_id:0,
      name:"",
      email_id:"",
      profile_img_url:'',
    };
  },
  mounted() {
    this.adminProfile();
  },
  methods: {
    async adminProfile() {
      try {
        const token = sessionStorage.getItem("token");
        console.log(token)
        if (token==null)
        { window.alert("please login first");
          this.$router.push('/admin_login')
          
        }
        const response = await fetch("http://127.0.0.1:8080/admin/admin_profile", {
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
        console.log(data)
        this.venue = data.result;
        this.show = data.result1;
        this.hall = data.result2;
        this.adminname=data.adminname;
        this.admin_id=data.admin_id;
        this.name=data.name;
        this.email_id=data.email_id;
        this.profile_img_url=data.profile_img_url;
        console.log(this.show)
        sessionStorage.setItem("profile_img_url",this.profile_img_url);
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
    async deleteVenue(venue_id) {
      const token = sessionStorage.getItem('token')
      console.log(venue_id)
  
      const response = await fetch(`http://127.0.0.1:8080/admin/deleteVenue/${venue_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      const data = await response.json();
          console.log("data",data)
  
      if (response.status === 200) {
        alert('Venue deleted successfully!')
        
        window.location.reload();
      } else {
        alert('Failed to delete venue')
      }
    },

    async deleteShow(show_id) {
      const token = sessionStorage.getItem('token')
  
      const response = await fetch(`http://127.0.0.1:8080/admin/deleteShow/${show_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      const data = await response.json();
          console.log("data",data)
  
      if (response.status === 200) {
        alert('Show deleted successfully!')
        
        window.location.reload();
      } else {
        alert('Failed to delete show')
      }
    },

    async deleteHall(hall_id) {
      const token = sessionStorage.getItem('token')
    
      const response = await fetch(`http://127.0.0.1:8080/admin/deleteHall/${hall_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      const data = await response.json();
          console.log("data",data)
  
      if (response.status === 200) {
        
        alert('Hall deleted successfully!')
        
        window.location.reload();
      } else {
        alert('Failed to delete hall')
      }
    },

  },
  template: `
  <div class="dashboard">
  <div class="container">
    <nav><ul>
      <li class="sidebar"><router-link to="/admin_profile" class="logo">
        <div v-if = "profile_img_url.length > 0">
        <img v-bind:src="profile_img_url">
        </div>
        <div v-else>
        <img src=../static/logo.png alt="">
        </div>
        <span class="nav-item">{{adminname}}</span>
        </router-link></li>

      <li class="sidebar"><router-link to="/admin_dashboard">
        <i class="fas fa-home"></i>
        <span class="nav-item">Home</span>
        </router-link></li>

      <li class="sidebar"><router-link to="/admin_profile">
        <i class="fas fa-user"></i>
        <span class="nav-item">Profile</span>
        </router-link></li>
     
     
      
      <li class="sidebar"><router-link to="/admin_edit_prof">
        <i class="fas fa-cogs"></i>
        <span class="nav-item">Settings</span>
        </router-link></li>

      

      <li class="sidebar"><router-link to="/login" class="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span class="nav-item">Logout</span>
        </router-link></li>
    </ul>
    </nav>

    <section class="main">
      <div  class="main-top">
        <h1>Add</h1>
        <router-link to="/admin_edit_prof"><i class="fas fa-user-cog"></i></router-link>
      </div>

      <div class="main-skills">
        <div class="card">
          <i class="fa fa-location-arrow"></i>
          <h3>Add Venue</h3>
          <p>Create new Venue</p>
          <router-link to="/add_venue"><button>Add</button></router-link>
        </div>

        <div class="card">
          <i class="fas fa-theater-masks"></i>
          <h3>Add Hall</h3>
          <p>Create new Hall</p>
          <router-link to="/add_hall"><button>Add</button></router-link>
        </div>

        <div class="card">
          <i class="fas fa-file-video"></i>
          <h3>Add Show</h3>
          <p>Create new Show</p>
          <router-link to="/add_show"><button>Add</button></router-link>
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
            <router-link :to="{ path: '/edit_venue', query: { venue_id: venue.venue_id } }"><button>Edit</button></router-link>
            <router-link to=""><button @click="deleteVenue(venue.venue_id)">Delete</button></router-link>
            <i class="fa fa-location-arrow venue"></i>
          </div>
        </div>
      </div>
    </section>

    <section class="main-course">
      <h1>Shows</h1>
      <div class="course-box">
        <div class="course">
          <div class="boxs" v-for="(show, index) in show" :key="index">
            <h3>{{show.show_name}}</h3>
            <p>Venue Name - {{show.venue_name}}</p>
            <p>Rating - {{show.rating}}/5.0  ({{show.total_rating}})</p>
            <p>Timing - {{show.timing}}</p>
            <p>Tag - {{show.tag}}</p><br>
            <h4>Poster</h4>
            <div v-if = "show.poster_url.length > 0" class="poster">
            <img v-bind:src="show.poster_url"></img>
            </div>
            <router-link :to="{ path: '/edit_show', query: { show_id: show.show_id } }"><button>Edit</button></router-link>
            <router-link to=""><button @click="deleteShow(show.show_id)">Delete</button></router-link>
            <i class="fas fa-file-video show"></i>
          </div>
        </div>
      </div>
    </section>

    <section class="main-course">
      <h1>Halls</h1>
      <div class="course-box">
        <div class="course">
          <div class="boxs" v-for="(hall, index) in hall" :key="index">
            <h3>Hall No.: {{index+1}}</h3>
            <p>Venue Name - {{hall.venue_name}}</p>
            <p>Hall Capacity - {{hall.hall_capacity}}</p>
            <p>Status - {{hall.status}}</p>
            <router-link :to="{ path: '/edit_hall', query: { hall_id: hall.hall_id } }"><button>Edit</button></router-link>
            <router-link to=""><button @click="deleteHall(hall.hall_id)">Delete</button></router-link>
            <i class="fas fa-theater-masks hall"></i>
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