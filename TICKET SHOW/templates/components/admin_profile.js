const AdminProfile = {
    mounted() {
      const token = sessionStorage.getItem('token')
      if (token === null) {
        window.alert('Please login first')
        this.$router.push('/admin_login')
      }
    },
      data() {
        return {
          adminname: "",
          name: "",
          email_id:"",
          profile_img_url:'',
          adminname:sessionStorage.getItem('adminname'),
          admin_id:sessionStorage.getItem('admin_id'),
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
            this.adminname=data.adminname;
            this.name=data.name;
            this.email_id=data.email_id;
            this.profile_img_url=data.profile_img_url;
            console.log(data)
          } catch (error) {
            console.error(error);
            
          }
        },
        
        async decodeBase64Image(profile_img_url) {
          console.log(profile_img_url)
    
          return profile_img_url
        },

        async deleteProfile() {
          const token = sessionStorage.getItem('token')
      
          const response = await fetch(`http://127.0.0.1:8080/admin/deleteAdmin`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          })
          const data = await response.json();
              console.log("data",data)
      
          if (response.status === 200) {
            alert('Admin deleted successfully!')
            
            this.$router.push('/')
          } else {
            alert('Failed to delete admin')
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
        <h1>Personal Details:</h1>
        <router-link to="/admin_edit_prof"><i class="fas fa-user-cog"></i></router-link>
      </div>

      <div class="main-skills">
        <div class="card">
          <i class="fa fa-id-card"></i><br><br>
          
          <div v-if = "profile_img_url.length > 0" class="logo1">
          <img v-bind:src="profile_img_url">
          <span class="nav-item">{{name}}</span>
          </div>
          <div v-else class="logo1">
          <img src=../static/logo.png alt="">
          <span class="nav-item">{{name}}</span>
          </div>
          <i class='fa fa-envelope-square'>  Email ID: {{email_id}}</i>
          <i class='fa fa-user-o'>  Admin Name: {{adminname}}</i>
          <router-link to="/admin_edit_prof"><button>Edit Profile</button></router-link>
          <router-link to=""><button @click="deleteProfile()">Delete Profile</button></router-link>
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