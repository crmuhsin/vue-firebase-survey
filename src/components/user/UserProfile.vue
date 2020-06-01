<template>
<div class="container">
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-12 table-responsive mt-3">
            <h2 class="text-center">My Profile</h2>
            <br>
            <div class="row">
                <div class="col-6">
                    <div>Display Name</div>
                    <div>Email</div>
                </div>
                <div class="col-6">
                    <span v-if="updateProfile">
                        <input type="text" class="form-control" v-model="newUser.displayName" autocomplete="off">
                        <input type="text" disabled class="form-control" v-model="newUser.email" autocomplete="off">
                    </span>
                    <span v-else>
                        <div>{{newUser.displayName}}</div>
                        <div>{{newUser.email}}</div>
                    </span>
                </div>
            </div>
        </div>
        <div class="row">
            <button v-if="updateProfile" class="btn btn-primary btn-new"  @click="updateProfileData()">Update Profile</button>
            <button v-else class="btn btn-primary btn-new" @click="updateProfile = true">Edit Profile</button>
        </div>
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" v-if="enableToast">
            <div class="toast-body">
                {{ toastText }}
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {auth} from '@/services';

export default {
    data() {
        return {
            newUser: {},
            updateProfile: false,
            enableToast: true,
            loader: false,
            toastText: 'asa'
        };
    },
    mounted () {
        this.getCurrentUser();
    },
    methods: {
        getCurrentUser(){
            this.loader = true;
            auth.onAuthStateChanged(user => {
                this.newUser.displayName = user.displayName;
                this.newUser.email = user.email;
                this.loader = false;
                console.log(user);
            })
        },
        updateProfileData(){
            this.loader = true;
            auth
            .currentUser
            .updateProfile({
                displayName: this.newUser.displayName
            }).then(() => {
                this.loader = false;
                this.enableToast = true;
                this.color = "success"; 
                this.toastText =  "Profile Updated Successfully.";
                // Update successful.
                this.updateProfile = false;
                setTimeout(() => {
                    this.enableToast = false;
                }, 2000);
            }).catch(function(error) {
            });
        }
    }
};
</script>
<style scoped>

</style>