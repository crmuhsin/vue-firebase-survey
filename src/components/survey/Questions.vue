<template>
<div class="container">
    <div class="row mb-3">
        <div class="col-12">
            <router-link tag="button" class="btn btn-sm btn-warning float-left" :to="{name:'Survey Preview', params:{survey:$route.params.survey}}">Back</router-link>
        </div>
    </div>
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-3">
            <ul class="list-group">
                <li class="list-group-item py-2" draggable="true" @dragstart="drag($event, type.qtype)" v-for="type in qtypeList" :key="type.title" :id="type.title">{{type.title}}</li>
            </ul>
            <button class="btn btn-primary mx-auto btn-block mt-5" type="submit" :disabled="button_disable" @click.prevent="questionSaveUpdate()">{{ buttonText }}</button>
        </div>
        <div class="col-9">
            <h1 class="absoulte-canvas">Canvas</h1>
            <div class="jumbotron canvas" @drop="drop($event)" @dragover="allowDrop($event)">
                <div class="card mb-4" v-for="(item, index) in questions" :key="index">
                    <div class="card-header">
                            <span v-if="updateQuestion[index].indx" class="row">
                                <span class="col">Question No {{index+1}}</span>
                                <input type="text" class="form-control form-control-sm col-8" v-model="item.q_name" placeholder="Enter Survey Question" autofocus @blur="updateQuestionFn(index, false)">
                                <button class="btn btn-secondary btn-sm col ml-1" type="button" @click="updateQuestionFn(index, false)">Update</button>
                            </span>
                            <span v-else class="row">
                                <span class="col">Question No {{index+1}}</span>
                                <h5 class="card-title col-8" @click="updateQuestionFn(index, true)">{{item.q_name||q_name_placeholder}}</h5>
                                <i class="fas fa-edit col" @click="updateQuestionFn(index, true)"></i>
                            </span>
                    </div>
                    <div class="card-body">
                        <span class="card-text">
                            <LongText v-if="item.qtype=='longText'" :setter="true"/>
                            <ShortText v-else-if="item.qtype=='shortText'" :setter="true"/>
                            <CheckBox v-else-if="item.qtype=='checkBox'" :choices="item.qchoices" :setter="true"/>
                            <Radio v-else-if="item.qtype=='radio'" :choices="item.qchoices" :setter="true" @buttonDisable="buttonDisable"/>
                            <Rating v-else-if="item.qtype=='rating'" :choices="item.qchoices" :setter="true"/>
                            <Date v-else-if="item.qtype=='date'" :setter="true"/>
                            <Time v-else-if="item.qtype=='time'" :setter="true"/>
                        </span>
                    </div>
                    <div class="card-footer">
                        <div class="custom-control custom-switch float-right">
                            <input type="checkbox" class="custom-control-input" v-model="item.is_required" :id="'customSwitch'+index">
                            <label class="custom-control-label" :for="'customSwitch'+index">Required</label>
                        </div>
                        <i class="fas fa-trash mr-4 float-right" @click="deleteItem(index)"></i>
                        <i class="fas fa-plus mr-4 float-right" @click="addItem(item.qtype)"></i>
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
import { CheckBox, Date, LongText, Radio, Rating, ShortText, Time } from './../QTypes';

export default {
    components:{
        CheckBox, Date, LongText, Radio, Rating, ShortText, Time
    },
    data(){
        return {
            questions:[],
            questionId: '',
            qtypeList: [
                { qtype:'shortText', title:'Short Text', choices: ''},
                { qtype:'longText', title:'Long Text', choices: ''},
                { qtype:'radio', title:'Multiple Choice', choices: [{r_name:''}]},
                { qtype:'checkBox', title:'Check Box', choices: [{c_name:''}]},
                { qtype:'rating', title:'Rating', choices: {min:0, max:10}},
                { qtype:'date', title:'Date', choices: ''},
                { qtype:'time', title:'Time', choices: ''},
            ],
            q_name_placeholder: "Enter Survey Question", 
            enableToast: false,
            updateQuestion: [],
            loader: false,
            toastText: 'asa',
            buttonText: 'Save',
            error: false,
            isUpdate: false,
            button_disable:false,
            color: ''
        }
    },
    mounted(){
        this.getQuestions();
    },
    methods:{
        allowDrop(ev) {
            ev.preventDefault();
        },
        drag(ev, type) {
            ev.dataTransfer.setData("type", type);
        },
        drop(ev) {
            ev.preventDefault();
            let type = ev.dataTransfer.getData("type");
            this.addItem(type);
        },
        addItem(type) {
            let choices = this.qtypeList.find(f => f.qtype == type).choices;
            this.questions.push({
                q_name: "",
                qtype: type,
                qchoices: choices,
                is_required: true
            });
            this.checkQuestions();
            this.updateQuestion.push({indx:false});
        },
        deleteItem(index) { 
            this.questions.splice(index, 1);
            this.checkQuestions();
        },
        buttonDisable(variable){
            this.button_disable = variable;
        },
        getQuestions(){
            this.loader = true;
            db.collection("questions").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.$route.params.survey == doc.data().slug) {
                        this.questions = JSON.parse(doc.data().fullquestion);
                        this.questionId = doc.id;
                        this.isUpdate = true;
                        this.buttonText = "Update"
                        this.questions.forEach(item => {
                            this.updateQuestion.push({indx:false});
                        });
                    }
                });
                this.loader = false;
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateQuestionFn(index, bool){
            this.updateQuestion[index].indx = bool;
        },
        checkQuestions(){
            let result = this.questions.map(function(item) {return item.q_name;});
            if (result.length == 0) {
                this.toastText = 'At least one item needed';
                this.error = true;
            }
            else if(result.includes('')){
                this.toastText =  "Some Question Names are not set.";
                this.error = true;
                this.button_disable = false;
            }
            else{
                this.error = false;
                this.button_disable = false;
            }
        },
        questionSaveUpdate(){
            this.checkQuestions()
            if (this.error) {
                this.enableToast = true;
                this.color = "red"; 
                setTimeout(() => {
                    this.enableToast = false;
                }, 2000);
                return;
            } else {
                this.loader = true;
                if (this.isUpdate) {
                    this.updateOldQuestions();
                } else {
                    this.saveNewQuestions();                  
                }
            }
        },
        saveNewQuestions(){
            db.collection("questions").add({
                    slug: this.$route.params.survey,
                    fullquestion: JSON.stringify(this.questions)
                })
                .then(docRef => {
                    console.log("Document written with ID: ", docRef.id);
                    this.loader = false;
                    this.enableToast = true;
                    this.color = 'green';
                    this.toastText = "Questions saved successfully."
                    setTimeout(() => {
                        this.$router.push({
                            name:'Survey Preview', 
                            params:{survey:this.$route.params.survey}
                        })
                        this.enableToast = false;
                    }, 3000);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
                
        },
        updateOldQuestions(){
            this.loader = true;
            db.collection("questions").doc(this.questionId).update({
                fullquestion: JSON.stringify(this.questions)
            })
            .then(() => {
                this.loader = false;
                this.enableToast = true;
                this.color = 'green';
                this.toastText = "Questions updated successfully."
                setTimeout(() => {
                    this.$router.push({
                        name:'Survey Preview', 
                        params:{survey:this.$route.params.survey}
                    })
                    this.enableToast = false;
                }, 3000);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    }
}
</script>

<style>
.canvas{
    height: 80vh;
    overflow-y: auto; 
}
.absoulte-canvas{
    position: absolute;
    top:45%;
    left:45%;
}
</style>
