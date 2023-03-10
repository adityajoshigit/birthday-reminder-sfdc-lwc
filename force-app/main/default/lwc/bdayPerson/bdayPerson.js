import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import CONTACT_ID_FIELD from '@salesforce/schema/Contact.Id';
import CONTACT_SEND_BIRTHDAY_WISHES from '@salesforce/schema/Contact.Send_Birthday_Wishes__c';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    _bdayIndividualRecord = null;
    
    @track toolTipText = '';
    
    @track processing = false;

    @api 
    get bdayIndividualRecord() {
        return this._bdayIndividualRecord;
    }
    set bdayIndividualRecord(value) {
        this._bdayIndividualRecord = value;
        this.setAttribute('bdayIndividualRecord', value);
        this.setterHandlerBdayIndividualRecord(value);
    }
    
    get iconName() {
        if (this._bdayIndividualRecord) {
            return (this._bdayIndividualRecord.isSelected && !this._bdayIndividualRecord.wishesSent) ? 'action:approval': 'action:user';
        }
        return '';
    }

    get wishesSent() {
        if (this._bdayIndividualRecord) {
            return this._bdayIndividualRecord.wishesSent;
        }
        return false;
    }


    get displayName() {
        return (
            this._bdayIndividualRecord.FirstName + ' ' + this._bdayIndividualRecord.LastName
        ).trim();
    }

    get displayAge() {
        if (this._bdayIndividualRecord) {
            let parts = this._bdayIndividualRecord.Birthdate.split('-');
            let bdate = new Date();
            bdate.setDate(parseInt(parts[2]));
            bdate.setMonth(parseInt(parts[1])-1);
            bdate.setFullYear(parseInt(parts[0]));
            return this.calculateAge(bdate) + ' years';
        } else {
            return '-NA-';
        }
    }

    get displayToolTipOnIcon() {
        if (this._bdayIndividualRecord.wishesSent) {
            return 'Sent Birthday Wishes Already!';
        }
        return 'Click to send birthday wishes';
    }


    handleSelection() {
        this.processing = true;
        if (!this._bdayIndividualRecord.wishesSent) {
            const selectionEvent = new CustomEvent(
                'selection', 
                {
                    detail: {
                        data: {
                            recordId: this._bdayIndividualRecord.Id,
                            isSelected: !this._bdayIndividualRecord.isSelected
                        }
                    }
                }
            );
            this.dispatchEvent(selectionEvent);
            console.log('dispatching selection');
        }
        this.processing = false;
    }

    handleSendIndividualBirthdayEmail(event) {
        this.updateRecordToSendEmail();
    }

    updateRecordToSendEmail() {
        this.processing = true;
        // set all (desired) field values
        const fields = {};
        fields[CONTACT_ID_FIELD.fieldApiName] = this._bdayIndividualRecord.Id;
        fields[CONTACT_SEND_BIRTHDAY_WISHES.fieldApiName] = true;
        
        // create recordInput object and attach fields obj into it
        const recordInput = { fields };
        console.log('here b4 updating');
        updateRecord(recordInput)
        .then(res => {
            console.log(res);
            this.processing = false;
            this.notifyParentAboutEmail();
        })
        .catch(err => {
            console.log(err);
            this.processing = false;
        });

    }

    

    notifyParentAboutEmail() {
        console.log('-0-0-0-');
        const emailSentNotification = new CustomEvent(
            'bdayemailsent',
            {
                detail : {
                    data: {
                        recordId: this._bdayIndividualRecord.Id,
                        wishesSent: true
                    }
                }
            }
        );
        this.dispatchEvent(emailSentNotification);
        console.log('/*/*/*');
    }

    calculateAge(birthdate) {
        let age = 0;
        if (birthdate) {
            if (
                ( todayDate.getDate() === birthdate.getDate() )
            &&  ( todayDate.getMonth() === birthdate.getMonth() )
            ) {
                age = todayDate.getFullYear() - birthdate.getFullYear();
            }
        }
        return age;
    }

    setterHandlerBdayIndividualRecord(value) {
        console.log('in setter handler for rec in person cmp');
        // this.iconName = value.isSelected ? 'action:approval': 'action:user';
    }
}