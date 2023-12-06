const AddVenue = {
    mounted() {
      const token = sessionStorage.getItem('token')
      if (token === null) {
        window.alert('Please login first')
        this.$router.push('/admin_login')
      }
    },
      data() {
        return {
          venue_name: "",
          place: "",
          location:"",
          adminname:sessionStorage.getItem('adminname'),
          admin_id:sessionStorage.getItem('admin_id'),
          profile_img_url:sessionStorage.getItem('profile_img_url'),
        };
      },
      methods: {
        async createVenue() {
          try {
            const token = sessionStorage.getItem("token");
  
            if (token==null)
          { window.alert("please login first");
            this.$router.push('/admin_login')
            
          }
            const response = await fetch("http://127.0.0.1:8080/admin/addVenue", {
              
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
              },
              body: JSON.stringify({
                venue_name: this.venue_name,
                place: this.place,
                location: this.location,
              }),
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to create venue.");
            }
  
            this.venue_name = "";
            this.place = "";
            this.location = "";
            
            this.$router.push({ path: '/admin_dashboard'});
            
            alert("Venue created successfully!");
            
          } catch (error) {
            console.error(error);
            alert("Failed to create venue.");
          }
        },
        async decodeBase64Image(profile_img_url) {
          console.log(profile_img_url)
    
          return profile_img_url
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
          <p>Fill the form to create the venue.</p>
        </div>

        <div class="box">
    <span class="border-line"></span>
    <form @submit.prevent="createVenue">
      <h2>Add Venue</h2>
      <div class="inputBox">
        <input type="text" id="venue_name" v-model="venue_name" required="required">
        <span>Venue Name</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="text" id="place" v-model="place" required="required">
        <span>Place</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="text" id="location" v-model="location" required="required">
        <span>Location</span>
        <i></i>
      </div>
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