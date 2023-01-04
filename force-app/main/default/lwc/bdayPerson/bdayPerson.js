import { LightningElement, api } from 'lwc';

const todayDate = new Date();

export default class BdayPerson extends LightningElement {
    @api bdayIndividualRecord;

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
}