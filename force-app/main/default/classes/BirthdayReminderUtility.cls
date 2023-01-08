public with sharing class BirthdayReminderUtility {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getBirthdayContacts(String bdateString) {
        Date bday = Date.today();
        if (bdateString != null && !String.isEmpty(bdateString)) {
            
        } 
        return [
            SELECT 
                Id, 
                FirstName,
                LastName,
                Birthdate,
                Birthday_Wishes_Sent__c
            FROM 
                Contact
            WHERE 
                DAY_IN_MONTH(Birthdate) = :bday.day()
                AND CALENDAR_MONTH(Birthdate) = :bday.month() 
            WITH SECURITY_ENFORCED
        ];
    }

    @AuraEnabled
    public static boolean sendBirthdayEmail(List<String> lstIds){
        try {
            List<Contact> lstContacts = new List<Contact>();
            for (String strId : lstIds) {
                lstContacts.add(
                    new Contact(
                        Id = strId,
                        Send_Birthday_Wishes__c = true
                    )
                );
            }
            update lstContacts;
        } catch (Exception e) {
            insert new Log__c(
                Description__c = e.getMessage() + '\n' + e.getLineNumber()
                
            );
            return false;
        }
        return true;
    }
}
