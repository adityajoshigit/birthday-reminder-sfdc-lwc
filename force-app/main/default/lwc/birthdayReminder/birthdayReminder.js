import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

const todayDate = new Date();

export default class BirthdayReminder extends LightningElement {
    @api baseBirthDate;
    
    @track birthdayRecordsList = [];
    @track totalBirthdays = 0;
    @track isLoadedBirthdays = false;
    @track allSelected = false;

    TRUE_BOOLEAN = true;
    selectAllLabel = 'All';
    deselectAllLabel = 'None';

    get noBdaysFound() {
        if (this.birthdayRecordsList) {
            return this.birthdayRecordsList.length > 0 ? false : true;
        }
        else {
            return true;
        }
    }

    get header() {
        return (
            (!this.baseBirthDate || this.baseBirthDate.getTime() === todayDate.getTime()) ? 'Today\'s Birthdays' : ('Birthdays on ' + baseBirthDate)
        );
    }

    get sendBtnLabel() {
        return 'Send Birthday Wishes';
    }

    @wire(getBirthdayContacts, {bdateString: ''})
    wiredGetBirthdayContacts({error, data}) {
        if(data) {
            console.log(data);
            data.forEach((bdayPerson) => {
                this.birthdayRecordsList.push(
                    {...bdayPerson, isSelected: !this.TRUE_BOOLEAN}
                );
            });
            this.totalBirthdays = data.length;
        }
    }

    calculateAge(birthdate) {
        let age = 0;
        
        if (birthdate) {
            if (birthdate.getTime() === todayDate.getTime()) {
                return todayDate.getFullYear() - birthdate.getFullYear();
            }
        }
        return age;
    }

    handleItemSelection(event) {
        console.log('received selection');
        if(event.detail.data) {
            const evtRecordId = event.detail.data.recordId;
            const evtIsSelected = event.detail.data.isSelected;
            this.birthdayRecordsList.forEach((record) => {
                if (record.Id === evtRecordId) {
                    record.isSelected = evtIsSelected;
                }
            });
        }
        this.allSelected = this.checkIfAllSelected();
    }

    handleAllOrNoneSelection() {
        this.allSelected = !this.allSelected;
        this.birthdayRecordsList.forEach((birthdayRecord) => {
            birthdayRecord.isSelected = this.allSelected;
        });
    }

    checkIfAllSelected() {
        for (const rec of this.birthdayRecordsList) {
            if (!rec.isSelected) {
                return false;
            }
        }
        return true;
    }


}