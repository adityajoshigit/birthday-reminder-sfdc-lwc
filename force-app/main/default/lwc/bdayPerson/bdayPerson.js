import { LightningElement, api, track } from 'lwc';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    @api bdayIndividualRecord;
    @api 
    get isSelected() {
        return this._isSelected;
    }
    set isSelected(value) {
        this.setAttribute('isSelected', value);
        this._isSelected = value;
        this.isSelectedChangeHandler(value)
    }
    
    @track _isSelected;
    @track iconName;


    get displayName() {
        return (
            this.bdayIndividualRecord.FirstName + ' ' + this.bdayIndividualRecord.LastName
        ).trim();
    }

    get displayAge() {
        if (this.bdayIndividualRecord) {
            let parts = this.bdayIndividualRecord.Birthdate.split('-');
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

    showIcon() {
        this.iconName = this._isSelected ? 'action:approval': 'action:user';
    }

    hideIcon() {
        this.iconName = 'action:approval';
    }

    handleSelection() {
        console.log("this._isSelected before " + this._isSelected);
        this._isSelected = !this._isSelected;
        const selectionEvent = new CustomEvent(
            'selection', 
            {
                detail: {
                    data: {
                        recordId: this.bdayIndividualRecord.Id,
                        isSelected: this._isSelected
                    }
                }
            }
        );
        this.dispatchEvent(selectionEvent);
        console.log("this._isSelected after " + this._isSelected);
    }

    isSelectedChangeHandler(value) {
        this.iconName = value ? 'action:approval': 'action:user';
    }
}