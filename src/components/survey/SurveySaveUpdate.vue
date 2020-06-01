<template>
<div class="container">
    <router-link tag="button" class="btn btn-sm btn-warning float-left ml-2" :to="{name:'Dashboard'}">Back</router-link>
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-9 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">New Survey</h5>
					<form class="form">
						<div class="alert alert-danger" v-if="error">
							<span>{{error}}</span>
						</div>
						<div class="mb-2">
							<label for="inputSurveyname">Survey Name</label>
							<input type="text" id="inputSurveyname" class="form-control" placeholder="Survey Name" v-model="survey.surveyname" autocomplete="off">
						</div>
						<div class="mb-2">
							<label for="inputSurveyslug">Survey Slug</label>
							<input type="text" id="inputSurveyslug" class="form-control" placeholder="Survey Slug" v-model="survey.surveyslug" autocomplete="off">
						</div>
						<button class="btn btn-primary mx-auto" type="submit" @click.prevent="checkUniqueSlugAndSave()">{{ buttonText }}</button>
					</form>
				</div>
			</div>
		</div>
        <div class="toast show" :style="'background-color:'+color" role="alert" aria-live="assertive" aria-atomic="true" v-if="enableToast">
            <div class="toast-body">
                {{ toastText }}
            </div>
        </div>
	</div>
</div>
</template>

<script>
import {db, auth} from '@/services';
import { validators } from '@/services/validators';

export default {
    data() {
        return {
            user: {},
            survey: {},
            enableToast: false,
            loader: false,
            toastText: '',
            buttonText: 'Save',
            error: ''
        };
    },
    mounted () {
        this.user = auth.currentUser;
        // if(this.$route.params.survey){
        //     this.getSurveys()
        //     this.buttonText = 'Update'
        // }
    },
    methods: {
        checkUniqueSlugAndSave(){
            this.error = validators.surveyForm(this.survey);
            if (this.error === '') {
                db.collection('surveys').get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.data().slug == this.survey.surveyslug ) {
                            this.error = "Slug already Taken.";
                            return;
                        }
                    });
                    this.surveySaveUpdate();
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                });
            }
        },
        surveySaveUpdate(){
			if (this.error === '') {
                this.loader = true;

                db.collection("surveys").add({
                    surveyname: this.survey.surveyname,
                    slug: this.survey.surveyslug,
                    userid: this.user.uid,
                    username: this.user.displayName
                })
                .then(docRef => {
                    console.log("Document written with ID: ", docRef.id);
                    this.loader = false;
                    this.enableToast = true;
                    this.color = 'green';
                    this.toastText = "Survey saved successfully."
                    setTimeout(() => {
                        this.enableToast = false;
                    }, 3000);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
                
			}
		}
    }
};
</script>

<style scoped>
</style>