const AddShow = {
    data() {
      return {
        venues: [],
        halls: [],
        show_name:"",
        timing: '',
        tag:'',
        price:'',
        admin_id:sessionStorage.getItem('admin_id'),
        adminname:sessionStorage.getItem('adminname'),
        profile_img_url: sessionStorage.getItem('profile_img_url'),
        image: null,
        poster_url: "",
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
      async onChange(){
        try {
            var venue_id = document.getElementById("venue_selection").value;
            const token = sessionStorage.getItem("token");
  
            if (token==null)
            { window.alert("please login first");
              this.$router.push('/admin_login')
              
            }
            const response = await fetch(`http://127.0.0.1:8080/admin/addHall/${venue_id}`, {
              
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
            this.halls = data.result;
            
            // this.$router.push({ path: '/admin_dashboard'});
            
          } catch (error) {
            console.error(error);
            alert("Failed to choose venue.");
          }
     },
     async onChange1(){
        var venue_id = document.getElementById("venue_selection").value;
        var hall_id = document.getElementById("hall_selection").value;
     },
  
      async decodeBase64Image(profile_img_url) {
        console.log(profile_img_url)
  
        return profile_img_url
      },
      async createShow() {
        try {
          var venue_id = document.getElementById("venue_selection").value;
          var hall_id = document.getElementById("hall_selection").value;
          const token = sessionStorage.getItem("token");
          
          let poster_url = "";
          if (this.image) {
            // convert the image to Base64-encoded string
            poster_url = await this.getBase64(this.image);
          }

          if (token==null)
        { window.alert("please login first");
          this.$router.push('/admin_login')
          
        }
          const response = await fetch(`http://127.0.0.1:8080/admin/addShow/${venue_id}/${hall_id}`, {
            
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              show_name: this.show_name,
              timing: this.timing,
              tag: this.tag,
              price: this.price,
              poster_url: poster_url,
            }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create show.");
          }

          this.show_name = "";
          this.timing = "";
          this.tag = "";
          this.price = "";
          this.poster_url="";
          
          this.$router.push({ path: '/admin_dashboard'});
          
          alert("Show created successfully!");
          
        } catch (error) {
          console.error(error);
          alert("Failed to create show.");
        }
      },
      async getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },
      onFileChange(e) {
        this.image = e.target.files[0];
        this.poster_url = URL.createObjectURL(this.image);
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
              <h3>Add Show</h3>
              <p>Fill the form to create the show.</p>
              <br><br>
              <center>
              <div class="custom-select" style="width:200px;">
                
                  <select id="venue_selection" @change="onChange()">
                    <option>Select Venue:</option>
                    <option v-for="(venue, index) in venues" :key="index" :value="venue.venue_id">{{venue.venue_name}}</option>
                  </select>
                
              </div>
              <br><br><br>
              <div class="custom-select" style="width:200px;">
                
                  <select id="hall_selection" @change="onChange1()">
                    <option>Select Hall:</option>
                    <option v-for="(hall, index) in halls" :key="index" :value="hall.hall_id">Hall No.{{index+1}} {{hall.hall_capacity}}</option>
                  </select>
                
              </div>
              </center>
            </div>
    
            <div class="box" id="box5">
              <span class="border-line"></span>
              <form @submit.prevent="createShow">
                <h2>Add Show</h2>
                <div class="inputBox">
                  <input type="text" id="show_name" v-model="show_name" required="required">
                  <span>Show Name</span>
                  <i></i>
                </div>
                <div class="inputBox">
                  <input type="text" id="timing" v-model="timing" required="required">
                  <span>Timing</span>
                  <i></i>
                </div>
                <div class="inputBox">
                  <input type="text" id="tag" v-model="tag" required="required">
                  <span>Tag</span>
                  <i></i>
                </div>
                <div class="inputBox">
                  <input type="text" id="price" v-model="price" required="required">
                  <span>Price</span>
                  <i></i>
                </div>
                <div class="inputBox">
                  <input type="file"accept="image/*" @change="onFileChange" />
                  <img :src="poster_url" v-if="poster_url" style="width:100px;height:100px;" />
                  <span>Poster</span>
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