<template>
<div class="container">
    <div class="loader" v-if="loader"></div>
    <div class="row" v-else>
        <div class="col-12 table-responsive mt-3">
            <h2 class="text-center">My Survey List</h2>
            <router-link tag="button" class="btn btn-primary btn-new" :to="{name:'New Survey'}">
                New Survey
            </router-link>
            <div class="float-right form-inline mb-3">
                <input class="form-control form-control-sm" type="search" placeholder="Search" v-model="searchText" @input="searchTable">
            </div>
            <table class="table table-bordered table-striped text-center" id="jumbo">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Survey Name</th>
                    <th>Slug</th>
                    <th>Created By</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody v-if="surveys.length>0" class="canvas">
                    <tr v-for="(item, index) in surveys" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.surveyname }}</td>
                        <td>{{ item.slug }}</td>
                        <td>{{ item.username }}</td>
                        <td>
                            <router-link tag="button" class="btn btn-primary btn-sm fixed-width mr-3" :to="{name:'Survey Preview', params:{survey:item.slug}}">View</router-link>
                            <router-link tag="button" class="btn btn-success btn-sm fixed-width mr-3" :to="{name:'Response List', params:{survey:item.slug}}">Responses</router-link>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5">Nothing to show.</td>
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
import { searchFn } from '@/services/search';

export default {
    data() {
        return {
            surveys: [],
            searchSurveys: [],
            enableToast: false,
            loader: false,
            toastText: 'asa',
            buttonText: 'Save',
            error: "",
            searchText:''
        };
    },
    mounted () {
        this.getSurveys()
    },
    methods: {
        getSurveys(){
            this.loader = true;

            db.collection("surveys").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().userid == localStorage.getItem('user')) {
                        this.surveys.push(doc.data());
                    }
                });

                this.loader = false;
            })
            // .catch((err) => {
            //     console.log('Error getting documents', err);
            // });
        },
        searchTable() {
            this.surveys = searchFn.mySearch(this.searchText, this.searchSurveys);
        }
    }
};
</script>

<style scoped>
.fixed-width {
  width: 100px;
}
.btn-new {
  width: 115px;
}
.canvas{
    overflow-y: auto;
}
@media (max-width: 768px) {
  .fixed-width{
    width: 100%;
  }
}
</style>