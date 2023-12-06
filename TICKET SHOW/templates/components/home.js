const Home = {
    template: `
 <div class="login">
    <div class="align-middle">
        <div id="content">
        </div>
        <div>
        <center>
        

        <h1 class="text-center" style="color:white ;font-size:60px">Welcome</h1>
        <div class="brand">
        <img src="../static/brand.png"></img>
        </div>
        </center>
        <center>
        <router-link style="color:black ;font-size:20px" to="/login"><button class="buttons">Login Page</button></router-link>
        <router-link style="color:black ;font-size:20px" to="/register"><button class="buttons">Registration Page</button></router-link>
        </center>
        </div>
    </div>
</div>
    `
  }