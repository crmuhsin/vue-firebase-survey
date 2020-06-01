<template>
<div class="container">
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-12">
            <div class="float-right form-inline my-3">
                <input class="form-control form-control-sm" type="search" placeholder="Search" v-model="searchText" @input="searchTable">
            </div>
            <div class="float-left my-3">
                <h2 class="muted">List of responses for</h2>
                <h3 class="text-primary">{{singleSurvey.surveyname}}</h3>
            </div>
            <table class="table table-bordered table-striped text-center">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Responder</th>
                        <th>Email</th>
                        <th>Respond On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in responses" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.responder }}</td>
                        <td>{{ item.email }}</td>
                        <!-- <td>{{ item.created_at }}</td> -->
                        <td v-if="item.created_at">{{ formatDate(item.created_at) }}</td>
                        <td>
                            <button class="btn btn-success btn-sm mr-3" @click="getSingleResponse(item.responseId)">Result in PDF</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
import {db} from '@/services';
import moment from 'moment';
import { searchFn } from '@/services/search';
import pdf from '@/services/html2pdf';

export default {
    data() {
        return {
            responses: [],
            searchResponses: [],
            singleSurvey:{},
            enableToast: false,
            loader: false,
            toastText: '',
            buttonText: 'Save',
            error: '',
            searchText:''
        };
    },
    mounted () {
        this.getSingleSurvey()
        this.getResponses()
    },
    methods: {
        formatDate(date){
            return moment(new Date(date.toDate())).format("DD MMM YYYY hh:mm")
        },
        getSingleSurvey(){
            this.loader = true;
            db.collection("surveys").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.$route.params.survey == doc.data().slug) {
                        this.singleSurvey = doc.data();
                        this.docid = doc.id;
                        this.loader = false;
                        this.singleSurvey.surveyname = this.singleSurvey.surveyname.charAt(0).toUpperCase() + this.singleSurvey.surveyname.slice(1)
                    }
                });
            });
        },
        getResponses(){
            this.loader = true;
            db.collection("responses").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.$route.params.survey == doc.data().slug) {
                        let res = doc.data();
                        this.responses.push({responseId: doc.id, ...res});
                    }
                });
                this.searchResponses = this.responses;              
                this.loader = false;
            });
        },
        getSingleResponse(responseId){
            let singleResponse = this.responses.find(r => r.responseId == responseId);
            let res = JSON.parse(singleResponse.responses);

            let texts = [];
            texts.push({
                text : 'Name: ' + singleResponse.responder, 
                alignment: 'left', 
                lineHeight: 1.3
            },{
                text : 'Email: ' + singleResponse.email, 
                alignment: 'left', 
                lineHeight: 3
            },{
                text: this.singleSurvey.surveyname,
                fontSize: 22, 
                bold: true, 
                alignment: 'center', 
                lineHeight: 2
            })
            res.forEach((element, index) => {
                texts.push({
                    text: index+1 +'. '+element.question,
                    lineHeight: 1.2
                }, {
                    text: element.answer|| 'No Answer given', 
                    lineHeight: 1.7, 
                    margin: [20, 0]
                },)
            });
            this.createPdf(texts);
        },
        createPdf(texts){
            let docDefinition = {
                header: function(currentPage) { 
                    return [{ 
                        text: currentPage.toString(), 
                        alignment: (currentPage % 2) ? 'right' : 'left', 
                        fontSize: 9, 
                        margin: [30,40] 
                    }]
                },
                footer: [{ 
                    text: this.singleSurvey.surveyname, 
                    alignment: 'right', 
                    fontSize: 8, 
                    margin: [30,40] 
                }],
                pageOrientation: 'portrait',
                content: texts,
                pageMargins: 72,
                pageSize: 'A4'
            };
            pdf.maker(docDefinition)
        },
        searchTable(){
            this.responses = searchFn.mySearchRes(this.searchText, this.searchResponses);
        }
    }
};
</script>

<style scoped>
</style>