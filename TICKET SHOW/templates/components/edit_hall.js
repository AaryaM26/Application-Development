const EditHall = {
    async mounted() {
      const token = sessionStorage.getItem('token')
      if (token === null) {
        window.alert('Please login first')
        this.$router.push('/login')
      }
    },
    data() {
      return {
        loading: true,
        hall_capacity: '',
        hall_id: this.$route.query.hall_id,
        adminname: sessionStorage.getItem('adminname'),
        file: null,
        profile_img_url: sessionStorage.getItem('profile_img_url'),
      };
    },
    async created() {
      try {
            const token = sessionStorage.getItem("token");
            const hall_id= this.$route.query.hall_id;
  
            
        const response = await fetch(`http://127.0.0.1:8080/admin/editHall/${hall_id}`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
          },
        });
        const data = await response.json();
        this.hall_capacity = data.hall_capacity;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  
    methods: {
        async updateHall() {
            if (this.file) {
              const reader = new FileReader();
              reader.onload = () => {
                this.saveHall();
              };
              reader.readAsDataURL(this.file);
            } else {
              this.saveHall(null);
            }
          },
      async saveHall() {
        const body = {
          hall_capacity: this.hall_capacity,
        };
  
        Object.keys(body).forEach((key) => {
          if (body[key] === null) {
            delete body[key];
          }
        });
        console.log(body)
        try {
          const hall_id = this.$route.query.hall_id;
          const response = await fetch(`http://127.0.0.1:8080/admin/editHall/${hall_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': sessionStorage.getItem("token"),
            },
            body: JSON.stringify(body),
          });
  
          const data = await response.json();
          if (data.updated) {
            alert('Hall updated successfully!');
            this.$router.push('/admin_dashboard');
          } else {
            alert('Error updating hall.');
          }
        } catch (error) {
          console.error(error);
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
        <h1>Edit</h1>
        <router-link to="/admin_edit_prof"><i class="fas fa-user-cog"></i></router-link>
      </div>

      <div class="main-skills">
        <div class="card">
          <i class="fas fa-theater-masks hall"></i>
          <h3>Edit Hall</h3>
          <p>Change the the information in the given field if you want.</p>
        </div>

        <div class="box" id="box3">
    <span class="border-line"></span>
    <div v-if="loading">Loading...</div>
    <div v-else>
    <form @submit.prevent="updateHall">
      <h2>Edit Hall info</h2>
      <div class="user-details">
      <div class="inputBox">
        <input type="text" id="hall_capacity" v-model="hall_capacity" required="required">
        <span>Hall Capacity</span>
        <i></i>
      </div>
      <div class="links">
      <router-link to="/add_hall">New Hall</router-link>
      </div>
      <input type="submit" value="Save">
    </div>
    </form>
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
  </div>
</div>
    `
  };