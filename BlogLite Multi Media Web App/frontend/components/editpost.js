const Editpost = {
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
            title: '',
            caption: '',
            profilePic: '',
            isPublic: false,
            useriid:sessionStorage.getItem('userId'),
            file: null,
            encodedImage: null,
          };
        },
        async created() {
          try {
          const token = sessionStorage.getItem("token");

          
            const blogID = this.$route.query.blog_id;
            console.log(blogID)
            console.log("blogID")

            const response = await fetch(`http://127.0.0.1:8080/user/blog?blog_id=${blogID}`, {
              headers: {
                'x-access-token': token,
              },
            });
            const data = await response.json();
            this.title = data.title;
            this.caption = data.caption;
            this.imageLink = data.profilePic;
            
           
            this.loading = false;
            if(data.isPublic==1){
              console.log('integer')
              this.isPublic=true
            }
            else{
              this.isPublic=false
            }
            console.log(data)
            
          } catch (error) {
            console.error(error);
          }
        },
      
        methods: {
          async updatePost() {
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
              title: this.title,
              caption: this.caption,
              isPublic: this.isPublic,
              
              imageLink: this.encodedImage ? `${this.encodedImage}` : null,
            };
      
            Object.keys(body).forEach((key) => {
              if (body[key] === null) {
                delete body[key];
              }
            });
            console.log(body)
            
            try {
              const blogID = this.$route.query.blog_id; 
              console.log(blogID) 
              const response = await fetch(`http://127.0.0.1:8080/user/blog?blog_id=${blogID}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': sessionStorage.getItem("token"),
                },
                body: JSON.stringify(body),
              });
      
              const data = await response.json();
              console.log("hi")
              console.log(data)
      
              if (data.created) {
                alert('Profile updated successfully!');
                this.$router.push({ path: '/myprofile', query: { otherUserID: this.useriid } });
              } 
              else {
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
        <section class="vh-100" style="background-color: #10242d">
        <span style="float:right ;font-size: 15px">
        <a><router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: useriid } }">My Profile</router-link></a>
          <a><router-link style="color:white ;font-size:20px" to="/feed">Feed</router-link></a>
        </span>
      
        <div class="container py-5 h-1000">
          <div v-if="loading">Loading...</div>
                <div v-else>
                  <form @submit.prevent="updatePost">
        
        
            <div class="row d-flex justify-content-center align-items-center h-500">
              <div class="col-15 col-md-10 col-lg-10 col-xl-5">
                <div class="shadow-lg shadow-warning mb-5 bg-white rounded" style="border-radius: 3rem; width-100px">
                  <div class="card-body p-10 text-center"><p style="color:white">...</p>
                    <h3 style="font-family:Trebuchet MS; font-size:40px;color:#10242d" class="mb-5">Edit Blog</h3>
                    <div class="form-outline mb-4">
                      <div class="row mb-2">
                        <label for="inputEmail3" class="col-sm-3 col-form-label"
                          style="font-family:Trebuchet MS; font-size:18px;">Title</label>
                        <div class="col-sm-8">
    
                          <input style="box-shadow:0px 0px 10px rgb(206, 28, 85)" class="form-control" type="text"
                            v-model="title" required />
    
                        </div>
                      </div>
                    </div>
                    <div class="form-outline mb-5">
                      <div class="row mb-4">
                        <label class="col-sm-3 col-form-label"
                          style="font-family:Trebuchet MS;font-size:18px;">Content</label>
                        <div class="col-sm-8">
    
                          <textarea style="box-shadow:0px 0px 10px rgb(206, 28, 85);height:70px" class="form-control"
                            v-model="caption" required></textarea>
                        </div>
              <br><br><br><br>
              <div>
    
                            <span style="float:left ;font-size: 15px"><label class="col-sm-2 col-form-label" style="font-family:Trebuchet MS;font-size:18px;">Image:</label></span>
                            <input type="file" @change="handleFileUpload">
                <img v-if="profilePic" :src="profilePic" alt="Profile Picture" width="100">
                      
                         </div>
                            <div>
                            <span style="float:left ;font-size: 15px"><label class="col-sm-2 col-form-label" style="font-family:Trebuchet MS;font-size:18px;">Public:</label></span>
                            <br>  
                            <input class="col-sm-2" type="checkbox" v-model="isPublic" style="float:left ;" />
                            
                              </span>
                            </div>
                        <div class="text-center">
                          <button style="font-family:Trebuchet MS" class="btn btn-danger btn-lg btn-block"
                            type="submit">Update Post</button><p style="color:white">...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </form>
        </div>
        </div>
      </section>
        `,
      };
      