const UserEditprof = {
    mounted() {
      const token = sessionStorage.getItem('token')
      if (token === null) {
        window.alert('Please login first')
        this.$router.push('/login')
      }
    },
    data() {
      return {
        loading: true,
        name: '',
        email_id: '',
        password: '',
        mobile_no:'',
        username:'',
        file: null,
        profile_img_url: sessionStorage.getItem('profile_img_url'),
      };
    },
    async created() {
      try {
            const token = sessionStorage.getItem("token");
  
            
        const response = await fetch('http://127.0.0.1:8080/user/user_profile', {
          headers: {
            'x-access-token': token,
          },
        });
        const data = await response.json();
        console.log(data)
        this.name = data.name;
        this.email_id = data.email_id;
        this.username = data.username;
        this.mobile_no = data.mobile_no;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  
    methods: {
        async updateProfile() {
            if (this.file) {
              const reader = new FileReader();
              reader.onload = () => {
                this.saveProfile();
              };
              reader.readAsDataURL(this.file);
            } else {
              this.saveProfile(null);
            }
          },
      async saveProfile() {
        const body = {
          name: this.name,
          email_id: this.email_id,
          mobile_no: this.mobile_no,
          username: this.username,
          password: this.password,
        };
  
        Object.keys(body).forEach((key) => {
          if (body[key] === null) {
            delete body[key];
          }
        });
        console.log(body)
        try {
          const response = await fetch('http://127.0.0.1:8080/user/user_editProfile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': sessionStorage.getItem("token"),
            },
            body: JSON.stringify(body),
          });
  
          const data = await response.json();
  
          if (data.updated) {
            alert('Profile updated successfully!');
            this.$router.push('/user_profile')
          } else {
            alert('Error updating profile.');
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
      <div  class="main-top">
        <h1>Edit</h1>
        <router-link to="/user_edit_prof"><i class="fas fa-user-cog"></i></router-link>
      </div>

      <div class="main-skills">
        <div class="card">
          <i class="fa fa-id-card"></i>
          <h3>Edit Profile</h3>
          <p>Change the the information in the given field if you want.</p>
        </div>

        <div class="box" id="box6">
    <span class="border-line"></span>
    <div v-if="loading">Loading...</div>
    <div v-else>
    <form @submit.prevent="updateProfile">
      <h2>Edit Profile Info</h2>
      <div class="user-details">
      <div class="inputBox">
        <input type="text" id="name" v-model="name" required="required">
        <span>Name</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="text" id="email_id" v-model="email_id" required="required">
        <span>Email Id</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="text" id="mobile_no" v-model="mobile_no" required="required">
        <span>Mobile Number</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="text" id="username" v-model="username" required="required">
        <span>User Name</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="password" id="password" v-model="password">
        <span>Change Password</span>
        <i></i>
      </div>
      <div class="links">
      <router-link to="/user_register">New Register</router-link>
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