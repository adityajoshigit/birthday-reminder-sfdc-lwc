import { LightningElement, api } from 'lwc';

export default class BdayPerson extends LightningElement {
    @api contact;

    get displayName() {
        return (
            this.contact.FirstName + ' ' + this.contact.LastName
        ).trim();
    }

    get displayAge() {
        return this.calculateAge(this.contact.Birthdate) + ' years';
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