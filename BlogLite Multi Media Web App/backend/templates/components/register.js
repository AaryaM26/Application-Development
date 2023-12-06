const Register = {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      mobileNumber: '',
      name: '',
    }
  },

  methods: {
    async createNewUser() {
      try {
        if (this.password !== this.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const data = {
          username: this.username,
          password: this.password,
          emailId: this.email,
          mobileNumber: this.mobileNumber,
          name: this.name,
        }

        const response = await fetch('http://127.0.0.1:8080/user/logReg', {
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
  },
  

    template: `
    <section class="vh-100" style="background-color:#10242d">
    <div class="container py-5 h-100">
      <form @submit.prevent="createNewUser">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card shadow-2-strong" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">
                <h3 class="mb-3" style="font-family:Trebuchet MS; font-size:40px;">Register</h3>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="text" id="username"
                    placeholder="Username" v-model="username" required />
                </div>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="password"
                    id="password" placeholder="Password" v-model="password" required />
                </div>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="password"
                    id="password" placeholder="Confirm Password" v-model="confirmPassword" required />
                </div>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="email" id="Email"
                    placeholder="Email" v-model="email" required />
                </div>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="tel" id="mobileNum"
                    placeholder="Mobile Number" v-model="mobileNumber" required />
                </div>
                <div class="form-outline mb-3">
                  <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="text" id="name"
                    placeholder="Name" v-model="name" required />
                </div>
                <div class="text-center">
                <p>Already have an account? <router-link to="/login">Login</router-link></p>
                  <button class="btn btn-danger btn-lg btn-block" type="submit">Register</button>
                </div>
              </div>
            </div>
          </div>
      </form>
    </div>
  </section>
    `
  




  }