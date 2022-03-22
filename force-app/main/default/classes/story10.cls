public with sharing class story10 {
    @AuraEnabled
    public static FD_Detail__c fetchCusType(String fdId){
        FD_Detail__c fdRec= [SELECT Id, Name, Customer_Type__c FROM FD_Detail__c WHERE Id :fdId  ];
        return fdRec;        
    }

}
