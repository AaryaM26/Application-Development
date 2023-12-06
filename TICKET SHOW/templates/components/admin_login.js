const AdminLogin = {
    data() {
      return {
        adminname: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handleSubmit() {
        fetch("http://127.0.0.1:8080/admin/login", {
            method: 'GET',
            
            headers:{
              Authorization:'Basic '+ btoa(this.adminname + ":" + this.password)
            }
          })
            .then(response => response.json())
            .then(data => {


              console.log('Success:', data);

              if(data.code != 200){
                console.log(data.admin_id)
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
              sessionStorage.setItem("admin_id", data.admin_id);
              sessionStorage.setItem("adminname",this.adminname);

              this.savedIconClass = "text-success";
              this.$router.push('/admin_dashboard')
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
      <h2>Admin Login</h2>
      <div class="inputBox">
        <input type="text" id="adminname" v-model="adminname" required="required">
        <span>Admin Name</span>
        <i></i>
      </div>
      <div class="inputBox">
        <input type="password" id="password" v-model="password" required="required">
        <span>Password</span>
        <i></i>
      </div>
      <div class="links">
      <router-link to="/admin_register">Admin Registration</router-link>
      </div>
      <input type="submit" value="Login">
    </form>
  </div>
  </div>
    `
  }