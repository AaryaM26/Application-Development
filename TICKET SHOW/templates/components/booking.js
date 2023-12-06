const Booking = {

    data() {
      return {
        show_id:this.$route.query.show_id,
        show_name:'',
        timing:'',
        tag:'',
        price:'',
        rating:'',
        total_rating:'',
        capacity:'',
        poster_url:'',
        venue_name:'',
        venue_id:'',
        username: sessionStorage.getItem('username'),
        profile_img_url: sessionStorage.getItem('profile_img_url'),
        poster_url: '',
        total_seat: '',
        booked_for:'',
        selectedRating:'',

      };
    },
    mounted() {
      this.showDetails();
    },
    methods: {
      async showDetails() {
        try {
            const token = sessionStorage.getItem("token");
            const show_id= this.$route.query.show_id;
  
            
        const response = await fetch(`http://127.0.0.1:8080/user/showDetails/${show_id}`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
          },
        });
        const data = await response.json();
        this.show_name = data.show_name;
        this.timing = data.timing;
        this.tag = data.tag;
        this.venue_name = data.venue_name;
        this.venue_id = data.venue_id;
        this.price = data.price;
        this.rating = data.rating;
        this.total_rating = data.total_rating;
        this.capacity = data.capacity;
        this.poster_url = data.poster_url;
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
      async ratingShow(show_id){
        console.log("Selected rating:", this.selectedRating);
        const body = {
            new_rating: this.selectedRating,
          };
    
          Object.keys(body).forEach((key) => {
            if (body[key] === null) {
              delete body[key];
            }
          });
          console.log(body)
          try {
            
            const response = await fetch(`http://127.0.0.1:8080/user/showDetails/${show_id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem("token"),
              },
              body: JSON.stringify(body),
            });
    
            const data = await response.json();
            if (data.updated) {
              alert('Thanks for rating!');
            //   window.location.reload();
            } else {
              alert('Error updating rating.');
            }
          } catch (error) {
            console.error(error);
          }
        },
        async createBooking(venue_id,show_id){
            try {
                console.log(venue_id)
                console.log(show_id)
                const token = sessionStorage.getItem("token");
                
      
                if (token==null)
              { window.alert("please login first");
                this.$router.push('/admin_login')
                
              }
                const response = await fetch(`http://127.0.0.1:8080/user/bookShow/${venue_id}/${show_id}`, {
                  
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                  },
                  body: JSON.stringify({
                    total_seat: this.total_seat,
                    booked_for: this.booked_for,
                  }),
                });
                
                if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.message || "Failed to create show.");
                }
      
                this.total_seat = "";
                this.booked_for = "";               
                this.$router.push({ path: '/booking_history'});
                
                alert("Booking done successfully!");
                
              } catch (error) {
                console.error(error);
                alert("Failed to book show.");
              }
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
        
      </div>
      <br>

        
      <div class="main-skills2">
            <div class="card2">
              <i class="fas fa-theater-masks"></i>
              <h3>Show Details:</h3>
            <div class="course-box">
            <div class="course2">
                <div class="boxs2">
            
                    <div v-if="poster_url.length > 0" class="poster2">
                    <h4>{{show_name}}:</h4><br>
                    <img v-bind:src="poster_url"></img><br><br>
                    <p>Venue Name - {{venue_name}}</p>
                    <p>Tag - {{tag}}</p>
                    <p>Rating - {{rating}}/5.0  ({{total_rating}})</p>
                    <p>Timing - {{timing}}</p>
                    <p>Capacity Left - {{capacity}}</p>
                    <p>Price - {{price}}</p>

                    <h5>Rate the movie:</h5>
                        <form class="rate" @change="ratingShow(show_id)">
                        <input type="radio" id="star5" name="rate" value="5" v-model="selectedRating" />
                        <label for="star5" title="text">5 stars</label>
                        <input type="radio" id="star4" name="rate" value="4" v-model="selectedRating" />
                        <label for="star4" title="text">4 stars</label>
                        <input type="radio" id="star3" name="rate" value="3" v-model="selectedRating" />
                        <label for="star3" title="text">3 stars</label>
                        <input type="radio" id="star2" name="rate" value="2" v-model="selectedRating" />
                        <label for="star2" title="text">2 stars</label>
                        <input type="radio" id="star1" name="rate" value="1" v-model="selectedRating" />
                        <label for="star1" title="text">1 star</label>          
                        </form>
                    
                </div>
                    
            </div>
            </div>
            </div>        
        </div>
    
            <div class="box" id="box2">
              <span class="border-line"></span>
              <form @submit.prevent="createBooking(venue_id,show_id)">
                <h2>Booking Details</h2>
                <div class="inputBox">
                  <input type="text" id="total_seat" v-model="total_seat" required="required">
                  <span>Number of Seat</span>
                  <i></i>
                </div>
                <div class="inputBox">
                  <input type="date" id="booked_for" v-model="booked_for" required="required">
                  <span>Booking Date:</span>
                  <i></i>
                </div>
                  <br><br><br>
                <input type="submit" value="Book">
              </form>
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
        </div>
      </div>

    
   
  `
  };