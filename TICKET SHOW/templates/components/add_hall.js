const AddHall = {
    data() {
      return {
        venues: [],
        hall_capacity:"",
        venue_id:'',
        admin_id:sessionStorage.getItem('admin_id'),
        adminname:sessionStorage.getItem('adminname'),
        profile_img_url: sessionStorage.getItem('profile_img_url'),
      };
    },

    mounted() {
      this.chooseVenue();
    },
    methods: {
      async chooseVenue() {
        try {
          const token = sessionStorage.getItem("token");

          if (token==null)
          { window.alert("please login first");
            this.$router.push('/admin_login')
            
          }
          const response = await fetch(`http://127.0.0.1:8080/admin/addVenue`, {
            
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          });


          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to choose venue.");
          }

          const data = await response.json();
          this.venues = data.result;
          
          // this.$router.push({ path: '/admin_dashboard'});
          
        } catch (error) {
          console.error(error);
          alert("Failed to choose venue.");
        }
      },
      async decodeBase64Image(profile_img_url) {
        console.log(profile_img_url)
  
        return profile_img_url
      },
      async onChange(){
         var venue_id = document.getElementById("venue_selection").value;
         console.log(venue_id)
      },
      async createHall() {
        try {
          var venue_id = document.getElementById("venue_selection").value;
          const token = sessionStorage.getItem("token");
          
          console.log(venue_id)
          if (token==null)
        { window.alert("please login first");
          this.$router.push('/admin_login')
          
        }
          const response = await fetch(`http://127.0.0.1:8080/admin/addHall/${venue_id}`, {
            
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              hall_capacity: this.hall_capacity,
            }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create hall.");
          }

          this.hall_capacity = "";
          
          this.$router.push({ path: '/admin_dashboard'});
          
          alert("Hall created successfully!");
          
        } catch (error) {
          console.error(error);
          alert("Failed to create hall.");
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
              <i class="fas fa-theater-masks"></i>
              <h3>Add Hall</h3>
              <p>Fill the form to create the hall.</p>
              <br><br>
              <center>
              <div class="custom-select" style="width:200px;">
                
                  <select id="venue_selection" @change="onChange()">
                    <option>Select Venue:</option>
                    <option v-for="(venue, index) in venues" :key="index" :value="venue.venue_id">{{venue.venue_name}}</option>
                  </select>
                
              </div>
              </center>
            </div>
    
            <div class="box" id="box2">
              <span class="border-line"></span>
              <form @submit.prevent="createHall">
                <h2>Add Hall</h2>
                <div class="inputBox">
                  <input type="text" id="hall_capacity" v-model="hall_capacity" required="required">
                  <span>Hall Capacity</span>
                  <i></i>
                </div>
                  <br><br><br>
                <input type="submit" value="Create">
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
    }