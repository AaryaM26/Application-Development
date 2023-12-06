const Addpost = {
  mounted() {
    const token = sessionStorage.getItem('token')
    if (token === null) {
      window.alert('Please login first')
      this.$router.push('/login')
    }
  },
    data() {
      return {
        title: "",
        content: "",
        image: null,
        imageURL: "",
        isPublic: false,
        useriid:sessionStorage.getItem('userId'),
      };
    },
    methods: {
      async createBlog() {
        try {
          const token = sessionStorage.getItem("token");

          if (token==null)
        { window.alert("please login first");
          this.$router.push('/login')
          
        }
          let imageURL = "";
          if (this.image) {
            // convert the image to Base64-encoded string
            imageURL = await this.getBase64(this.image);
          }
          
  
          const response = await fetch("http://127.0.0.1:8080/user/blog", {
            
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              title: this.title,
              content: this.content,
              imageURL: imageURL,
              isPublic: this.isPublic,
            }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create blog.");
          }

          this.title = "";
          this.content = "";
          this.image = null;
          this.imageURL = "";
          this.isPublic = false;
          
          this.$router.push({ path: '/myprofile', query: { otherUserID: this.useriid } });
          
          alert("Blog created successfully!");
          
        } catch (error) {
          console.error(error);
          alert("Failed to create blog.");
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
        this.imageURL = URL.createObjectURL(this.image);
      },
    },

    
    template: `
    <section class="vh-100" style="background-color: #10242d">
    <span style="float:right ;font-size: 15px">
    <a><router-link style="color:white ;font-size:20px" :to="{ path: '/myprofile', query: { otherUserID: useriid } }">My Profile</router-link></a>
      <a><router-link style="color:white ;font-size:20px" to="/feed">Feed</router-link></a>
    </span>
    <div class="container py-5 h-1000">
      <form @submit.prevent="createBlog">
        <div class="row d-flex justify-content-center align-items-center h-500">
          <div class="col-15 col-md-10 col-lg-10 col-xl-5">
            <div class="shadow-lg shadow-warning mb-5 bg-white rounded" style="border-radius: 3rem; width-100px">
              <div class="card-body p-10 text-center">
              <p style="color:white">...</p>
                <h3 style="font-family:Trebuchet MS; font-size:40px;color:#10242d" class="mb-5">Add a Blog/Post</h3>
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
                        v-model="content" required></textarea>
                    </div>
					<br><br><br><br>
					<div>

                        <span style="float:left ;font-size: 15px"><label class="col-sm-2 col-form-label" style="font-family:Trebuchet MS;font-size:18px;">Image:</label></span>
                        <input class="col-sm-15" type="file" accept="image/*" @change="onFileChange" />
                        <img :src="imageURL" v-if="imageURL" style="width:100px;height:100px;" />
                     </div>
                        <div>
                        <span style="float:left ;font-size: 15px"><label class="col-sm-2 col-form-label" style="font-family:Trebuchet MS;font-size:18px;">Public:</label></span>
                        <br>  
                        <input class="col-sm-2" type="checkbox" v-model="isPublic" style="float:left ;" />
                          
                        </div>
                    <div class="text-center">
                      <button style="font-family:Trebuchet MS" class="btn btn-danger btn-lg btn-block"
                        type="submit">Save</button>
                        <p style="color:white">...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </form>
    </div>
  </section>
    
    `,
  };