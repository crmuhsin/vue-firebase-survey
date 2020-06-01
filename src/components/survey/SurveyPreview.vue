<template>
<div class="container">
    <div class="row mb-1">
        <div class="col-12">
            <router-link tag="button" class="btn btn-sm btn-warning float-left" :to="{name:'Dashboard'}">Back</router-link>
            <!-- <ShareSurvey @shareData="updateToast"/> -->
            <router-link tag="button" class="btn btn-sm btn-outline-success float-right mr-2" :to="{name:'Questions', params:{survey:$route.params.survey}}">Edit</router-link>
        </div>
    </div>
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-sm-12 col-lg-9 mx-auto">
            <h3><p><label>Survey Names</label></p></h3>
            <span v-if="updateSurvey" class="row mx-auto">
                <input type="text" id="inputSurveyname" class="form-control col-8" v-model="survey.surveyname" autocomplete="off" autofocus>
                <button class="btn btn-secondary btn-sm ml-1 col-2" type="submit" @click="saveUpdateSurvey()">Update</button>
            </span>
            <span @click="updateSurvey=true" v-else>
                <h4 class="text-muted float-left">{{survey.surveyname}}</h4>
                <i class="fas fa-edit ml-5 float-left"></i>
            </span>
            <br><hr>
            <h2>Preview</h2>
            <div class="jumbotron canvas">
                <div class="card mb-4" v-for="(item, index) in questions" :key="index">
                    <div class="card-body">
                        <span class="card-text">Question {{index+1}}</span>
                        <span class="card-text">
                            {{item.q_name}}
                            <span class="required" v-if="item.is_required">*</span>
                        </span>
                        <span class="card-text">
                            <LongText v-if="item.qtype=='longText'" :setter="false"/>
                            <ShortText v-else-if="item.qtype=='shortText'"  :setter="false"/>
                            <CheckBox v-else-if="item.qtype=='checkBox'" :choices="item.qchoices"  :setter="false"/>
                            <Radio v-else-if="item.qtype=='radio'" :choices="item.qchoices"  :setter="false"/>
                            <Rating v-else-if="item.qtype=='rating'" :choices="item.qchoices" :setter="false"/>
                            <Date v-else-if="item.qtype=='date'" :setter="false"/>
                            <Time v-else-if="item.qtype=='time'" :setter="false"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="toast show" :style="'background-color:'+color" role="alert" aria-live="assertive" aria-atomic="true" v-if="enableToast">
        <div class="toast-body">
            {{ toastText }}
        </div>
    </div>
</div>
</template>

<script>
import {db} from '@/services';
import { validators } from '@/services/validators';
import { CheckBox, Date, LongText, Radio, Rating, ShortText, Time } from './../QTypes';
import ShareSurvey from './ShareSurvey';

export default {
    components:{
        CheckBox, Date, LongText, Radio, Rating, ShortText, Time, ShareSurvey
    },
    data() {
        return {
            survey: {},
            questions:[],
            surveyname: '',
            docid: '',
            enableToast: false,
            loader: true,
            toastText: '',
            buttonText: 'Save',
            error: "",
            color: 'blue',
            updateSurvey: false
        };
    },
    mounted () {
        this.getSingleSurvey();
        this.getQuestions();
    },
    methods: {
        updateToast(variable){
            this.enableToast = true;
            this.color = variable.color;
            this.toastText = variable.toastText;
            setTimeout(() => {
                this.enableToast = false;
            }, 1000);
        },
        getQuestions(){
            this.loader = true;
            db.collection("questions").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.$route.params.survey == doc.data().slug) {
                        this.questions = JSON.parse(doc.data().fullquestion);
                        // this.questionid = doc.id;
                        console.log(this.questions);
                    }
                });
                this.loader = false;
            })
            .catch(error => {
                console.log(error)
            })
        },
        getSingleSurvey(){
            db.collection("surveys").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.$route.params.survey == doc.data().slug) {
                        this.survey = doc.data();
                        this.docid = doc.id;
                    }
                });
                this.loader = false;
                this.survey.surveyname = this.survey.surveyname.charAt(0).toUpperCase() + this.survey.surveyname.slice(1)
            });
        },
        saveUpdateSurvey(){
            this.loader = true;
            db.collection("surveys").doc(this.docid).update({
                surveyname: this.survey.surveyname
            })
            .then(() => {
                this.updateSurvey = false;
                this.loader = false;
                this.enableToast = true;
                this.color = 'green';
                this.toastText = "Survey updated successfully."
                setTimeout(() => {
                    this.enableToast = false;
                    this.getSingleSurvey();
                }, 1000);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    }
};
</script>

<style scoped>
.required{
    color: red;
}
.canvas{
    height: 50vh;
    overflow-y: auto; 
}
</style>