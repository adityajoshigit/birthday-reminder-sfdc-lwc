import { LightningElement, wire, track } from 'lwc';
import getBirthdayContacts from '@salesforce/apex/BirthdayReminderUtility.getBirthdayContacts';

export default class BirthdayReminder extends LightningElement {
    header = 'Today\'s Birthdays!';
    @track 
    iconName = 'action:user';


    bdayContacts = [
        {
            FirstName: 'Aditya',
            LastName: 'Joshi',
            Birthday: '1996-11-24',
            Id: '1'
        },
        {
            FirstName: 'Saurabh',
            LastName: 'Kalelkar',
            Birthday: '1997-03-24',
            Id: '2'
        },
        {
            FirstName: 'Abhijeet',
            LastName: 'Patwardhan',
            Birthday: '2000-11-12',
            Id: '3'
        },
        {
            FirstName: 'Anagha',
            LastName: 'Patwardhan',
            Birthday: '1995-12-02',
            Id: '4'
        },
        {
            FirstName: 'Mihir',
            LastName: 'Paradkar',
            Birthday: '1996-12-03',
            Id: '5'
        },
        {
            FirstName: 'Rutuja',
            LastName: 'Gadgil',
            Birthday: '1998-1-01',
            Id: '6'
        }
    ];

    @wire(getBirthdayContacts, {bdateString: ''})
    todayBdayContacts;

    // handleOnKeyUp() {
    //     console.log(this.todayBdayContacts);
    // }

    /**
     * calculates age based on the birthdate sent in the form of yyyy-mm-dd
     * @param {string} birthdate 
     */
    calculateAge(birthdate) {
        if (birthdate) {
            let parts = birthdate.split('-');
            if (parts && parts.length === 3) {
                
            }   
        }
    }

    showIcon() {
        this.iconName = 'action:user';
    }

    hideIcon() {
        this.iconName = 'action:approval';
    }
}