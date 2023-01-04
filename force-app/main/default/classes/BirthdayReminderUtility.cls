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
                Birthdate
            FROM 
                Contact
            WHERE 
                Birthdate = :bday
            WITH SECURITY_ENFORCED
        ];
    }
}
