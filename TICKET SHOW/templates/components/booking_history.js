const BookingHistory = {

    data() {
      return {
        booking: [],
        username: sessionStorage.getItem('username'),
        profile_img_url: sessionStorage.getItem('profile_img_url'),
        poster_url: '',
      };
    },
    mounted() {
      this.bookingProfile();
    },
    methods: {
      async bookingProfile() {
        try {
          const token = sessionStorage.getItem("token");
          console.log(token)
          if (token==null)
          { window.alert("please login first");
            this.$router.push('/user_login')
            
          }
          const response = await fetch("http://127.0.0.1:8080/user/user_profile", {
            headers: {
               method: 'GET',
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
          this.booking = data.result;
          
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
  
      async deleteBooking(booking_id) {
        const token = sessionStorage.getItem('token')
    
        const response = await fetch(`http://127.0.0.1:8080/user/deleteBooking/${booking_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        const data = await response.json();
            console.log("data",data)
    
        if (response.status === 200) {
          alert('Ticket deleted successfully!')
          
          window.location.reload();
        } else {
          alert('Failed to delete ticket')
        }
      },
  
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
      </div>
      <br>

        
      <section class="main-course">
      <h1>Booking History</h1>
      <div class="course-box">
        <div class="course2">
          <div class="boxs2" v-for="(booking, index) in booking" :key="index">
            
            <div v-if="booking.poster_url.length > 0" class="poster2">
            <h4>{{booking.show_name}}:</h4><br><br>
              <img v-bind:src="booking.poster_url"></img>
            </div>
            <center><h4>Venue Name - {{booking.venue_name}}</h4><br>
            <h5>Date - {{booking.booked_for}}</h5>
            <h5>Time - {{booking.timing}}</h5>
            <h5>No. of Seats - {{booking.total_seat}}</h5></center>
            <router-link to=""><button @click="deleteBooking(booking.booking_id)">Delete</button></router-link>
          </div>
        </div>
      </div>
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
      

    </section>

  </div>
  </div>

    
   
  `
  };