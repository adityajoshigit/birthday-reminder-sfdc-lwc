import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

const todayDate = new Date();

export default class BirthdayReminder extends LightningElement {
    @api baseBirthDate;
    
    @track iconName = 'action:user';

    get header() {
        return (
            (!this.baseBirthDate || this.baseBirthDate.getTime() === todayDate.getTime()) ? 'Today\'s Birthdays' : ('Birthdays on ' + baseBirthDate)
        );
    }

    @wire(getBirthdayContacts, {bdateString: ''})
    todayBdayContacts;

    // handleOnKeyUp() {
    //     console.log(this.todayBdayContacts);
    // }

    /**
     * calculates age based on the birthdate sent in the form of yyyy-mm-dd
     * @param {string} birthdate 
     * @returns {number} age value
     */
    calculateAge(birthdate) {
        let age = 0;
        
        if (birthdate) {
            if (birthdate.getTime() === todayDate.getTime()) {
                return todayDate.getFullYear() - birthdate.getFullYear();
            }
        }
        return age;
    }

    showIcon() {
        this.iconName = 'action:user';
    }

    hideIcon() {
        this.iconName = 'action:approval';
    }

}