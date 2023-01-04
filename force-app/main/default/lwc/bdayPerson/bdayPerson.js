import { LightningElement, api, track } from 'lwc';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    @api bdayIndividualRecord;

    @track iconName = 'action:user';

    get displayName() {
        return (
            this.bdayIndividualRecord.FirstName + ' ' + this.bdayIndividualRecord.LastName
        ).trim();
    }

    get displayAge() {
        return this.calculateAge(new Date(this.bdayIndividualRecord.Birthdate)) + ' years';
    }

    calculateAge(birthdate) {
        let age = 0;
        console.log(birthdate);
        if (birthdate) {
            if (
                ( todayDate.getDate() === birthdate.getDate() )
            &&  ( todayDate.getMonth() === birthdate.getMonth() )
            ) {
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