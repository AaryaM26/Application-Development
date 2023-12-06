const UserLogin = {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handleSubmit() {
        fetch("http://127.0.0.1:8080/user/login", {
            method: 'GET',
            
            headers:{
              Authorization:'Basic '+ btoa(this.username + ":" + this.password)
            }
          })
            .then(response => response.json())
            .then(data => {


              console.log('Success:', data);

              if(data.code != 200){
                console.log(data.user_id)
                this.registrationFailed = true;
                if(data.error != null){
                    this.error = data.error;
                }else{
                    this.error = "Ah Snap! API System Error Occurred";
                }
                window.alert(this.error);
            }
            else{
              console.log(data.code)
              sessionStorage.setItem("token", data.token);
              sessionStorage.setItem("user_id", data.user_id);
              sessionStorage.setItem("username", this.username);

              this.savedIconClass = "text-success";
              this.$router.push('/user_dashboard')
            }
              
      
            })
            .catch((error) => {
              console.error('Error:', error);
              this.savedIconClass = "text-danger";
            })
      }
  
    },
    template: `
    <div class="login">
    <div class="box">
    <span class="border-line"></span>
    <form @submit.prevent="handleSubmit">
      <h2>User Login</h2>
      <div class="inputBox">
        <input type="text" id="username" v-model="username" required="required">
        <span>User Name</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="password" id="password" v-model="password" required="required">
        <span>Password</span>
        <i></i>
      </div>
      <div class="links">
      <router-link to="/user_register">User Registration</router-link>
      </div>
      <input type="submit" value="Login">
    </form>
  </div>
  </div>
    `
  }