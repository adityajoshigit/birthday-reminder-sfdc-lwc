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
        if (this.bdayIndividualRecord) {
            let parts = this.bdayIndividualRecord.Birthdate.split('-');
            let bdate = new Date();
            console.log(parts);
            console.log(bdate);
            bdate.setDate(parseInt(parts[2]));
            bdate.setMonth(parseInt(parts[1])-1);
            bdate.setFullYear(parseInt(parts[0]));
            console.log(bdate);
            return this.calculateAge(bdate) + ' years';
        } else {
            return '-NA-';
        }
    }

    calculateAge(birthdate) {
        let age = 0;
        console.log(birthdate);
        if (birthdate) {
            console.log(
                ( todayDate.getDate() + " == " + birthdate.getDate() )
            +"\n"+  ( todayDate.getMonth() + " == " + birthdate.getMonth() )
            );
            if (
                ( todayDate.getDate() === birthdate.getDate() )
            &&  ( todayDate.getMonth() === birthdate.getMonth() )
            ) {
                console.log("here --- " + birthdate);
                age = todayDate.getFullYear() - birthdate.getFullYear();
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