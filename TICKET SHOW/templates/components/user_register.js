const UserRegister = {
    data() {
      return {
        name: '',
        email_id: '',
        mobile_no: '',
        username: '',
        password: '',
        confirmPassword: '',
        image: null,
        profile_img_url: "",
      }
    },
  
    methods: {
      async createNewUser() {
        try {
          if (this.password !== this.confirmPassword) {
            throw new Error('Passwords do not match')
          }
          let profile_img_url = "";
          if (this.image) {
            // convert the image to Base64-encoded string
            profile_img_url = await this.getBase64(this.image);
          }
  
          const data = {
            name: this.name,
            email_id: this.email_id,
            mobile_no: this.mobile_no,
            username: this.username,
            password: this.password,
            profile_img_url: profile_img_url,
          }
  
          const response = await fetch('http://127.0.0.1:8080/user/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
  
          const responseData = await response.json()
  
          if (response.status === 200) {
            alert(responseData.message)
            this.$router.push('/login')
          } else {
            throw new Error(responseData.error)
          }
        } catch (error) {
          console.log(error)
          alert(error.message)
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
        if (this.image.size>1048576){
          alert("File is too big! Upload image upto 1MB");
        }
        if (this.image.size<1048576){
          this.profile_img_url = URL.createObjectURL(this.image);
        }
      },
    },
    
  
      template: `
      <div class="login">
      <div class="box" id="box4">
    <span class="border-line"></span>
    <form @submit.prevent="createNewUser">
      <h2>User Registration</h2>
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
        <input type="file"accept="image/*" @change="onFileChange" />
        <img :src="profile_img_url" v-if="profile_img_url" style="width:100px;height:100px;" />
        <span>Profile Image</span>
        <i></i>
      </div>

      <div class="inputBox">
        <input type="password" id="password" v-model="password" required="required">
        <span>Password</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="password" id="confirmPassword" v-model="confirmPassword" required="required">
        <span>Confirm Password</span>
        <i></i>
      </div>
      <div class="links">
      <router-link to="/user_login">User Login</router-link>
      </div>
      <input type="submit" value="Register">
    </form>
  </div>
  </div>
      `
    
  
  
  
  
    }