import { LightningElement, wire, track, api } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';
import sendBirthdayEmail from '@salesforce/apex/BirthdayReminderUtility.sendBirthdayEmail';

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
        this.processing = true;
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
            if (!birthdayRecord.wishesSent) {
                birthdayRecord.isSelected = this.allSelected;
            }
        });
        console.log('at the end===');
    }

    handleSendBdayWish(event) {
        this.processing = true;
        const ids = [];
        this.birthdayRecordsList.forEach(rec => {
            if (rec.Id && rec.isSelected && !rec.wishesSent) {
                ids.push(rec.Id);
            }
        });

        if (ids.length) {
            sendBirthdayEmail({ 'lstIds' : ids })
                .then(res => {
                    console.log('res = ' + res);
                    this.processing = false;
                    this.birthdayRecordsList.forEach(rec => {
                        if (rec.isSelected) {
                            rec.isSelected = false;
                            rec.wishesSent = true;
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.processing = false;
                });
        } else {
            console.log('nothing to update');
            this.processing = false;
        }

    }

    onBdayEmailSent(event) {
        this.processing = true;
        if (event && event.detail && event.detail.data) {
            const _recId = event.detail.data.recordId;
            const _wishesSent = event.detail.data.wishesSent;
            this.birthdayRecordsList.forEach(rec => {
                if (rec.Id === _recId) {
                    console.log('rec.Id = ' + rec.Id);
                    console.log('rec.wishesSent = ' + _wishesSent);
                    rec.wishesSent = _wishesSent;
                }
            });
        }
        this.processing = false;
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