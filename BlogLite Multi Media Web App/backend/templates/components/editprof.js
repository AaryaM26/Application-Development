const Editprof = {
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
      email: '',
      mobile: '',
      password: '',
      profilePic: null,
      file: null,
      encodedImage: null,
    };
  },
  async created() {
    try {
          const token = sessionStorage.getItem("token");

          
      const response = await fetch('http://127.0.0.1:8080/user/profileInfo', {
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      this.name = data.Name;
      this.email = data.emailId;
      this.mobile = data.mobileNumber;
      this.profilePic = data.imageLink;
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
          this.encodedImage = reader.result;
          const base64Image = this.encodedImage.split(',')[1];
          this.saveProfile(base64Image);
        };
        reader.readAsDataURL(this.file);
      } else {
        this.saveProfile(null);
      }
    },

    async saveProfile(encodedImage) {
      const body = {
        name: this.name,
        emailId: this.email,
        mobileNum: this.mobile,
        password: this.password,
        profileIMG: this.encodedImage ? `${this.encodedImage}` : null,
      };

      Object.keys(body).forEach((key) => {
        if (body[key] === null) {
          delete body[key];
        }
      });
      console.log(body)
      try {
        const response = await fetch('http://127.0.0.1:8080/user/profile', {
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
          this.$router.push('/feed')
        } else {
          alert('Error updating profile.');
        }
      } catch (error) {
        console.error(error);
      }
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePic = reader.result;
      };
      reader.readAsDataURL(this.file);
    },
  },

  template: `
  <section class="vh-100" style="background-color:#10242d">
  <div class="container py-5 h-100">
      <div v-if="loading">Loading...</div>
  <div v-else>
  <form @submit.prevent="updateProfile">
          <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                  
                      <center>
                          <div class="card" style="width: 35rem">
                              <button type="button" class="btn btn-danger"
                                  style="text-align: center; font-family:Trebuchet MS; font-size:18px"> Details
                              </button>
                              <br>
                              <div class="form-outline mb-5">
                                  <div class="row mb-2">
                                      <label for="inputEmail3" class="col-sm-3 col-form-label"
                                          style="font-family:Trebuchet MS; font-size:18px">Name</label>
                                      <div class="col-sm-8">
                                          <input style="box-shadow:0px 0px 8px rgb(206, 28, 85)"
                                              class="form-control" type="text" v-model="name" required />
                                      </div>
                                  </div>
                              </div>
                              <div class="form-outline mb-3">
                                  <div class="row mb-2">
                                      <label for="inputEmail3" class="col-sm-3 col-form-label"
                                          style="font-family:Trebuchet MS; font-size:18px">Email Id</label>
                                      <div class="col-sm-8">
                                          <input style="box-shadow:0px 0px 8px rgb(206, 28, 85)"
                                              class="form-control" type="text" v-model="email" required />
                                      </div>
                                  </div>
                              </div>
                              <div class="form-outline mb-3">
                                  <div class="row mb-2">
                                      <label for="inputEmail3" class="col-sm-3 col-form-label"
                                          style="font-family:Trebuchet MS; font-size:18px">Number</label>
                                      <div class="col-sm-8">
                                          <input style="box-shadow:0px 0px 8px rgb(206, 28, 85)"
                                              class="form-control" type="text" v-model="mobile" required />
                                      </div>
                                  </div>
                              </div>
                              <div class="form-outline mb-2">
                                  <div class="row mb-1">
              
                                      
                                      <span style="float:left"><label for="inputEmail3" class="col-sm-3 col-form-label"
                                      style="font-family:Trebuchet MS; font-size:18px">Profile Picture</label><img v-if="profilePic" :src="profilePic" alt="Profile Picture" style="width:100px;height:80px">
                <input type="file" @change="handleFileUpload"></span>
                
                                  </div>
                              </div>
                              <div class="form-outline mb-3">
                                  <div class="row mb-2">
                                      <label for="inputEmail3" class="col-sm-3 col-form-label"
                                          style="font-family:Trebuchet MS; font-size:18px">Change Password</label>
                                      <div class="col-sm-8">
                                          <input style="box-shadow:0px 0px 8px rgb(206, 28, 85)"
                                              class="form-control" type="password" v-model="password"  />
                                      </div>
                                  </div>
                              </div>
                              <div class="text-center">
            <router-link style="color:white ;font-size:20px" to="/deleteprof"><button type="button" class="btn btn-danger">Delete Profile ?</button></router-link>
    <br><br>
                                  <button class="btn btn-danger btn-lg btn-block" type="submit">Update
                                      Profile</button>
                              </div>
                              <br>
                          </div>
                      </center>
                  
              </div>
  </div>
  </div>
      
  </div>
</section>
  `,
};
