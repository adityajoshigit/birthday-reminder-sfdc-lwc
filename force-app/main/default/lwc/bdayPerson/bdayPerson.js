import { LightningElement, api } from 'lwc';

export default class BdayPerson extends LightningElement {
    @api
    firstName = '';

    @api 
    lastName = '';

    @api
    age = 0;

    get displayName() {
        return (
            this.firstName + ' ' + this.lastName
        ).trim();
    }

    get displayAge() {
        return this.age + ' years';
    }

}