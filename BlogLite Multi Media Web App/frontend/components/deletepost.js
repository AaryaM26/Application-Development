const Deletepost = {
  mounted() {
    const token = sessionStorage.getItem('token')
    if (token === null) {
      window.alert('Please login first')
      this.$router.push('/login')
    }
  },
  
  methods: {
    async deletePost() {
      const token = sessionStorage.getItem('token')
      const blogId = this.$route.query.blog_id
      console.log(blogId)
  
      const response = await fetch(`http://127.0.0.1:8080/user/deletePost?blog_id=${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      const data = await response.json();
          console.log("data",data)
  
      if (response.status === 200) {
        alert('Post deleted successfully!!!!')
        
        this.$router.push('/feed')
      } else {
        alert('Failed to delete post')
      }
    },
  },

  template: `
    <div>
      <div class="container-fluid" style="background-color: #10242d; text-white; height:720px;">
        <h1 class="text-center" style="color:white; font-size:100px">Delete Post?</h1>
        <center>
          <button type="button" class="btn btn-danger" @click="deletePost" >Yes</button>
          <router-link style="color:black; font-size:20px" to="/feed"><button type="button" class="btn btn-danger" >No</button></router-link>
        </center>
      </div>
    </div>
  `
}