import { LightningElement, api, track } from 'lwc';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    @api bdayIndividualRecord;

    @track iconName = 'action:user';

    isSelected = false;

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
        this.iconName = this.isSelected ? 'action:approval': 'action:user';
    }

    hideIcon() {
        this.iconName = 'action:approval';
    }

    handleSelection() {
        this.isSelected = !this.isSelected;
        const selectionEvent = new CustomEvent(
            'selection', 
            {
                detail: {
                    data: {
                        recordId: this.bdayIndividualRecord.Id,
                        isSelected: this.isSelected
                    }
                }
            }
        );
        this.dispatchEvent(selectionEvent);

        // let divElem = this.template.querySelector('[data-id="'+ this.bdayIndividualRecord.Id + '"]');
        
        // if (this.isSelected) {
        //     divElem.className = divElem.className + ' selected-styling';
        // } else {
        //     divElem.className = divElem.className.replace('selected-styling', '');
        // }
    }
}