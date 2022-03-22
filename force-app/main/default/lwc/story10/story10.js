import { api, LightningElement, wire } from 'lwc';
import fetchCusTypeLocal from '@salesforce/apex/story10.fetchCusType'
export default class Story10 extends LightningElement {

    @api recordId;
    customerOptions;
    @wire(fetchCusTypeLocal, {
        fdId: '$recordId'
    })wiredData({error,data}){
        if(data){
            let option = [];
            option.push({label:data.Customer_Type__c, value:data.Customer_Type__c})
            this.customerOptions=option;
            console.log('Option is '+JSON.stringify(this.customerOptions))
        }
    }



}
