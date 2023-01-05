import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

const todayDate = new Date();

export default class BirthdayReminder extends LightningElement {
    @api baseBirthDate;
    
    @track iconName = 'action:user';
    @track todayBdayContacts = [];
    @track totalBirthdays = 0;
    @track selectionMap = {};

    TRUE_BOOLEAN = true;

    get header() {
        return (
            (!this.baseBirthDate || this.baseBirthDate.getTime() === todayDate.getTime()) ? 'Today\'s Birthdays' : ('Birthdays on ' + baseBirthDate)
        );
    }

    get sendBtnLabel() {
        const selectedNum = Object.entries(this.selectionMap)
                                .filter(entry => entry[1] ? true : false)
                                .length;
        return 'Send Wishes' + (selectedNum ? (' (' + selectedNum + ')') : '');
    }

    @wire(getBirthdayContacts, {bdateString: ''})
    wiredGetBirthdayContacts({error, data}) {
        if(data) {
            console.log(data);
            data.forEach(bdayPerson => {
                this.todayBdayContacts.push(bdayPerson);
                this.selectionMap[bdayPerson.Id] = false;
            });
            this.totalBirthdays = data.length;
        }
    }

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

    handleItemSelection(event) {
        if(event.detail.data) {
            const recordId = event.detail.data.recordId;
            const isSelected = event.detail.data.isSelected;
            this.selectionMap[recordId] = isSelected;
            console.log(this.selectionMap);
        }
    }

}