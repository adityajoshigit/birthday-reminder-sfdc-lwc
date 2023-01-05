import { LightningElement, api, track } from 'lwc';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    @api 
    get bdayIndividualRecord() {
        return this._bdayIndividualRecord;
    }
    set bdayIndividualRecord(value) {
        this._bdayIndividualRecord = value;
        this.setAttribute('bdayIndividualRecord', value);
        this.setterHandlerBdayIndividualRecord(value);
    }
    
    _bdayIndividualRecord = null;
    
    get iconName() {
        if (this._bdayIndividualRecord) {
            return this._bdayIndividualRecord.isSelected ? 'action:approval': 'action:user';
        }
        return '';
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

    handleSelection() {
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

    setterHandlerBdayIndividualRecord(value) {
        console.log('in setter handler for rec in person cmp');
        // this.iconName = value.isSelected ? 'action:approval': 'action:user';
    }
}