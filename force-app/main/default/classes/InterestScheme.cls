public with sharing class InterestScheme {
    @AuraEnabled(cacheable=true)
    public static List<Interest_Schemes__c> InterestSchemeFetch(String cusType, String depType, Integer tnrDay, Integer tnrMonth, Integer fdAmount, String fdId) {
        System.debug('Deposit Type::' + depType);
        System.debug('Customer Type::' + cusType);
        System.debug('Tenor in Days::' + tnrDay);
        System.debug('Tenor in Months::' + tnrMonth);
        System.debug('FD Amount::' + fdAmount);

        List<Interest_Schemes__c> listScheme = new  List<Interest_Schemes__c>();
        listScheme = [SELECT Id, Name, Customer_Type__c, Deposit_Type__c, Interest_Rate__c, From_Amount__c, To_Amount__c, Tenor_From_Days__c, 	Tenor_To_Days__c, 	Tenor_From_Months__c, Tenor_To_Months__c 
        FROM Interest_Schemes__c
        WHERE Customer_Type__c=:cusType AND Deposit_Type__c=:depType AND From_Amount__c<:fdAmount AND To_Amount__c>=:fdAmount AND Tenor_From_Days__c<=:tnrDay AND Tenor_To_Days__c>=:tnrDay AND Tenor_From_Months__c<=:tnrMonth AND Tenor_To_Months__c>=:tnrMonth];
        return listScheme;
    }
}
