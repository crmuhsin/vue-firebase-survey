<template>
<div class="container">
	<div class="row">
		<div class="col-lg-10 col-xl-9 mx-auto">
			<div class="card card-signin flex-row my-5">
				<div class="card-img-left d-none d-md-flex">
					<!-- Background image for card set in CSS! -->
				</div>
				<div class="card-body">
					<h5 class="card-title text-center">Register</h5>
					<form class="form-signin">
						<div class="alert alert-danger" v-if="error">
							<span>{{error}}</span>
						</div>
						<div class="form-label-group">
							<input type="text" id="inputUserame" class="form-control" placeholder="Username" v-model="formData.username" name="username" autocomplete="off">
							<label for="inputUserame">Username</label>
						</div>
						<div class="form-label-group">
							<input type="text" id="inputEmail" class="form-control" placeholder="Email address"  v-model="formData.email" name="email" autocomplete="off">
							<label for="inputEmail">Email address</label>
						</div>
						<hr>
						<div class="form-label-group">
							<input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="formData.password" name="password" autocomplete="off">
							<label for="inputPassword">Password</label>
						</div>
						<div class="form-label-group">
							<input type="password" id="inputConfirmPassword" class="form-control" placeholder="Password" name="password_conf" v-model="formData.password_conf" autocomplete="off">
							<label for="inputConfirmPassword">Confirm password</label>
						</div>
						<button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit" @click.prevent="register()">Register</button>
						<p class="d-block text-center mt-2 small">Already a member, please <a href="login">Sign In</a></p>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import {auth} from '@/services';

export default {
	data(){
		return {
			formData: {
				username: "",
				email: "",
				password: "",
				password_conf: ""
			},
			error: '',
		}
	},
	methods:{
		register(){
			auth
			.createUserWithEmailAndPassword(this.formData.email, this.formData.password)
			.then(() => {
				setTimeout( () => this.$router.push({name:'Login'}), 3000);
				
			})
			.catch(error => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode == 'auth/email-already-in-use') {
					this.error = 'Email Already in use.';
				}
				else if (errorCode == 'auth/invalid-email') {
					this.error = 'Invalid Email.';
				}
				else if (errorCode == 'auth/weak-password') {
					this.error = 'The password is too weak.';
				} else {
					this.error = errorMessage;
				}
			});
        }
	}

}
</script>

<style scoped>
html,
body {
	height: 100%;
}

body {
	display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
} 
.card-signin {
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-signin .card-title {
  margin-bottom: 2rem;
  font-weight: 300;
  font-size: 1.5rem;
}

.card-signin .card-img-left {
  width: 45%;
  background: scroll center url('https://source.unsplash.com/WEQbe2jBg40/414x512');
  background-size: cover;
}

.card-signin .card-body {
  padding: 2rem;
}

@import '../../assets/floating-label.css';

</style>