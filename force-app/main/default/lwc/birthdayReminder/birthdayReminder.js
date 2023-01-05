import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

const todayDate = new Date();

export default class BirthdayReminder extends LightningElement {
    @api baseBirthDate;
    
    @track iconName = 'action:user';
    @track birthdayRecordsList = [];
    @track totalBirthdays = 0;
    @track selectionMap = {};
    @track selectedNum = 0;
    
    TRUE_BOOLEAN = true;
    selectAllLabel = 'Select All';
    deselectAllLabel = 'Select None';

    get header() {
        return (
            (!this.baseBirthDate || this.baseBirthDate.getTime() === todayDate.getTime()) ? 'Today\'s Birthdays' : ('Birthdays on ' + baseBirthDate)
        );
    }

    get sendBtnLabel() {
        return 'Send Birthday Wishes' + (this.selectedNum ? (' (' + this.selectedNum + ')') : '');
    }

    @wire(getBirthdayContacts, {bdateString: ''})
    wiredGetBirthdayContacts({error, data}) {
        if(data) {
            console.log(data);
            data.forEach(bdayPerson => {
                this.birthdayRecordsList.push(bdayPerson);
                this.selectionMap[bdayPerson.Id] = false;
            });
            this.totalBirthdays = data.length;
        }
    }

    // handleOnKeyUp() {
    //     console.log(this.birthdayRecordsList);
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
        }
        this.calculateSelectedItems();
        this.setAllOrNoneSelectionLabel();
    }

    calculateSelectedItems() {
        if (this.selectionMap) {
            this.selectedNum = Object.entries(this.selectionMap)
                                .filter(entry => entry[1] ? true : false)
                                .length;
        } else {
            this.selectedNum = 0;
        }
    }

    setAllOrNoneSelectionLabel() {
        return ( 
            (this.selectedNum === this.birthdayRecordsList.length) 
            ? 'Deselect All'
            : 'Select All' 
        );
    }

    markSelectionStatus(idVsStatusMap, newStatus) {
        Object.keys(idVsStatusMap).forEach(k => {
            idVsStatusMap[k] = newStatus;
        });
        return idVsStatusMap;
    }

}