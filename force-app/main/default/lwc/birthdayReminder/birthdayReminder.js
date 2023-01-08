import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

const todayDate = new Date();

export default class BirthdayReminder extends LightningElement {
    @api baseBirthDate;
    
    @track birthdayRecordsList = [];
    @track totalBirthdays = 0;
    @track isLoadedBirthdays = false;
    @track allSelected = false;
    @track processing = true;

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
        let label = 'Send Birthday Wishes';
        const count = (this.birthdayRecordsList) 
                        ? this.birthdayRecordsList.filter(rec => (rec.isSelected && !rec.wishesSent)).length
                        : 0;
        return count ? (label + ' (' + count + ')' ) : label;
    }

    @wire(getBirthdayContacts, {bdateString: ''})
    wiredGetBirthdayContacts({error, data}) {
        if(data) {
            console.log(data);
            data.forEach((bdayPerson) => {
                this.birthdayRecordsList.push(
                    {
                        ...bdayPerson, 
                        isSelected: !this.TRUE_BOOLEAN,
                        wishesSent: !this.TRUE_BOOLEAN
                    }
                );
            });
            this.totalBirthdays = data.length;
        }
        this.processing = false;
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

    onSelection(event) {
        this.processing = true;
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
        this.processing = false;
    }

    handleAllOrNoneSelection() {
        console.log('here===');
        this.allSelected = !this.allSelected;
        this.birthdayRecordsList.forEach((birthdayRecord) => {
            birthdayRecord.isSelected = this.allSelected;
        });
        console.log('at the end===');
    }

    handleSendBdayWish(event) {

    }

    onBdayEmailSent(event) {
        if (event && event.detail && event.data) {
            const _recId = event.detail.data.recordId;
            const _wishesSent = event.detail.data.wishesSent;
            this.birthdayRecordsList.forEach(rec => {
                if (rec.Id === _recId) {
                    rec.wishesSent = _wishesSent;
                }
            });
        }
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