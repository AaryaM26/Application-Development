const Login = {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handleSubmit() {
        fetch("http://127.0.0.1:8080/user/logReg", {
            method: 'GET',
            
            headers:{
              Authorization:'Basic '+ btoa(this.email + ":" + this.password)
            }
          })
            .then(response => response.json())
            .then(data => {


              console.log('Success:', data);

              if(data.code != 200){
                console.log(data.userId)
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
              sessionStorage.setItem("userId", data.userId);

              this.savedIconClass = "text-success";
              this.$router.push('/feed')
            }
              
      
            })
            .catch((error) => {
              console.error('Error:', error);
              this.savedIconClass = "text-danger";
            })
      }
  
    },
    template: `
    <section class="vh-100" style="background-color:#10242d">
        <div class="container py-5 h-100">
		<form @submit.prevent="handleSubmit">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="card shadow-2-strong" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">
                  <h3 class="mb-5" style="font-family:Trebuchet MS; font-size:40px;">Login</h3>
                  <div class="form-outline mb-4">
                    <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)"class="form-control" type="text" id="username" placeholder="Username" v-model="email" type="text" required>
                  </div>
                  <div class="form-outline mb-4">
                    <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)"class="form-control" type="password" id="password" placeholder="Password" v-model="password" type="password" required>
                  </div>
                  <div class="text-center">
                    <p>Not a member? <router-link to="/register">Register</router-link></p>
                  <button class="btn btn-danger btn-lg btn-block" type="submit">Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
		</form>
		</div>
      </section>
    `
  }