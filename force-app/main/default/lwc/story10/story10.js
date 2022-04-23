import { api, LightningElement, track, wire } from 'lwc';
import fetchCusTypeLocal from '@salesforce/apex/story10.fetchCusType'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import FdDetailLocal from '@salesforce/schema/FD_Detail__c'
import depositTypeLocal from '@salesforce/schema/FD_Detail__c.Deposit_Type__c'
import payFreqTypeLocal from '@salesforce/schema/FD_Detail__c.Payout_Frequency__c'
import fetchIntScheme from '@salesforce/apex/InterestScheme.InterestSchemeFetch';

export default class Story10 extends LightningElement {

    @api recordId;
    @track customerOptions=[]
    selectedCusType=''
    @track DepositTypeOptions= []
    selectedDepType=''
    payFreqData
    @track payFreqOptions=[]
    selectedPayFreq=''
    tenorInMonths = ''
    tenorInDays = ''
    FdAmount = 0
    @track listScheme =[]
    selectedIntRate
    selectedIntSchmRecId


    @wire(fetchCusTypeLocal, {
        fdId: '$recordId'
    })wiredData({error,data}){
        if(data){
            let option = [];
            option.push({label:data.Customer_Type__c, value:data.Customer_Type__c})
            this.customerOptions=option;
            console.log('Option is ' + JSON.stringify(this.customerOptions))
        }
        else if(error){
            console.error('Error is ' + JSON.stringify(error))
        }
    }

    CustomerTypeChange(event){
        console.log('Selected customer type is ' + event.detail.value)
        this.selectedCusType=event.detail.value
    }


    @wire(getObjectInfo, {objectApiName:FdDetailLocal})
    fdObjectInfo

    @wire( getPicklistValues, { recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId', fieldApiName:depositTypeLocal } )
    wiredDataDep( { error, data } ) {        
        if (data) {             
            let options = [];            
            data.values.forEach(element => {     //forEach(function)(element){}
                options.push({label: element.label ,value: element.value} );
            });
            this.DepositTypeOptions = options;      
            console.log( 'Options are ' + JSON.stringify( this.DepositTypeOptions ) );
        }else if( error ) {
            console.error( JSON.stringify(error) );
        }
    }


    @wire( getPicklistValues, { recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId', fieldApiName: payFreqTypeLocal} )
    wiredDataPay( { error, data } ) {        
        if (data)          
            this.payFreqData=data
            
        if( error ) {
            console.error( JSON.stringify(error) );
        }
    }


    DepositTypeChange(event){
        console.log('Selected Deposit type::' + event.detail.value)
        this.selectedDepType=event.detail.value
        let keyArray = this.payFreqData.controllerValues[event.target.value]
        this.payFreqOptions = this.payFreqData.values.filter(opt=>opt.validFor.includes(keyArray))
    }


    payFreqChange(event){
        console.log('selected Payout Freq is '  + event.detail.value)
        this. selectedPayFreq = event.detail.value

    }

    get tenorMonthOptions(){
        let options = []
        for(var i = 0; i<85; i++){
            options.push({label:i.toString(), value:i.toString()})
        }

        return options
    }

    tenorMonthChange(event){
        console.log('Selected Tenor in Months is::' + event.detail.value )
        this.tenorInMonths = event.detail.value
    }


    get tenorDayOptions(){
        let options = []
        for(var j = 0; j< 30; j++){
            options.push({label:j.toString(), value:j.toString()})
        }
        return options
    }

    tenorDayChange(event){
        console.log('Selected Tenor in Days is::' + event.detail.value)
        this.tenorInDays = event.detail.value
    }


    fdAmountChange(event){
        console.log('Selected FD Amount is :: ' + event.detail.value)
        this.FdAmount = event.detail.value
        
    }


    InterestSchemeChange(event){
        var schemeRecId=event.detail.value
        for(var i=0; i<this.listScheme.length; i++){
            if(schemeRecId==this.listScheme[i].value){
                this.selectedIntSchmRecId=schemeRecId
                this.selectedIntRate=this.listScheme[i].InterestRate
                break;
            }
        }
    }


    handleFetchScheme(event){
        let isValid = true
        let inputFields = this.template.querySelectorAll('.fetchSchemeFields')
        inputFields.forEach(inputField=>{
            if(!inputField.checkValidity()){
                inputField.reportValidity();
                isValid = false;
            }
        });
        if(isValid){
            fetchIntScheme({
                cusType:this.selectedCusType,
                depType:this.selectedDepType,
                tnrDay:this.tenorInDays,
                tnrMonth:this.tenorInMonths,
                fdAmount:this.fdAmount,
                fdId:this.recordId
            }).then(result =>{
                var lstSch=[]
                if(result){
                    for(var cnt=0; cnt<result.length; cnt++){
                        var tempObj = {};
                        tempObj.label = result[cnt].Name;
                        tempObj.value = result[cnt].Id;
                        tempObj.InterestRate =result[cnt].Interest_Rate__c;
                        lstSch.push(tempObj);
                    }
                }
                this.listScheme = lstSch;
                console.log('Scheme records::'+ JSON.stringify(this.listScheme));
            }) .catch(error=>{
                console.error('Error::'+ error.message)
            })
        }
    };

    save(event){
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fetchSchemeFields');
        inputFields.forEach(inputField=>{
            if(!inputField.checkValidity()){
                inputField.reportValidity();
                isValid = false;
            }
        });

        inputFields = this.template.querySelectorAll('.clsForSaveButton');
        inputFields.forEach(inputField=>{
            if(!inputField.checkValidity()){
                inputField.reportValidity();
                isValid = false;
            }
        });

        return isValid;