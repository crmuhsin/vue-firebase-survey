import Vue from 'vue';
import App from './App';
import 'bootstrap';
import router from './router';
import '../public/bootstrap.min.css';
import '../public/dashboard.css';

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  const user = localStorage.getItem("user")
  if (to.meta.requriesAuth) {
    if (user) {
      next()
    } else {
      next({
        name: 'Login'
      })
    }
  }
  next()
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  render: h => h(App) 
})

