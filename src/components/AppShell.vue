<template>
<div class="container-fluid">
	<nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
		<router-link tag="a" class="navbar-brand col-sm-3 col-md-2 mr-0" :to="{name:'Dashboard'}">Survey</router-link>
		<div class="dropdown">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Menu
			</button>
			<div class="dropdown-menu dropdown-menu-right" v-if="logged">
				<router-link tag="div" class="dropdown-item clickable" :to="{name:'Survey List'}">Response</router-link>
				<router-link tag="div" class="dropdown-item clickable" :to="{name:'Profile'}">My Profile</router-link>
				<div class="dropdown-item clickable" @click="logout">Sign out</div>
			</div>
			<div class="dropdown-menu dropdown-menu-right" v-else>
				<router-link tag="div" class="dropdown-item clickable" :to="{name:'Register'}">Register</router-link>
				<router-link tag="div" class="dropdown-item clickable" :to="{name:'Login'}">Login</router-link>
			</div>
		</div>
	</nav>
	<main role="main">
		<div class="mt-1 col-12">
			<router-view class="animated fadeIn"></router-view>
		</div>
	</main>
</div>
</template>
<script>
import { auth } from '@/services';

export default {
	name: 'appshell',
	data() {
		return {
			// logged: true
		}
	},
	methods: {
		logout(){
			auth
			.signOut()
			.then(() => {
				// Sign-out successful.
				localStorage.clear();
				setTimeout( () => this.$router.push({name:'Login'}), 1000);
			})
		}
	},
	computed:{
		logged(){
			return localStorage.getItem('user') ? true : false;
		}
	}
}
</script>

<style scoped>
.toast {
    color: black;
}
</style>
