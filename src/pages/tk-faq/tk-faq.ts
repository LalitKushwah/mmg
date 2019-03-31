import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TkFaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tk-faq',
  templateUrl: 'tk-faq.html',
})
export class TkFaqPage {

  faqs: any = [
    {
      'ques': 'What is TK Currency ?',
      'ans': 'It is a point based loyalty program for Trade Kings nominated wholesalers and super markets.'
    },
    {
      'ques': 'How can I earn Trade Kings currency ?',
      'ans': 'If a customer achieves their quarterly target and payments are made within 30 days range, on every case purchased they get 1/2/3 points as illustrated in the catalog. Please note that even if he does not achieve his overall target he will be elligible to earn points on those categories that he has achieved 100% target. Payments must be made within 30 days for overall purchase to earn TK Currency points.'
    },
    {
      'ques': 'How can we redeem the TK currency?',
      'ans': "Post every quarter basis eligibility, window will open for 15 days for redemption of gifts or Trade King's merchandise."
    },
    {
      'ques': 'What happens if I return any goods during the scheme period?',
      'ans': 'Achievement will be calculated post adjustment of any returns during the period.'
    },
    {
      'ques': 'Can I ask for Cash or Credit note against the TK currency?',
      'ans': 'Under no circumstances can one redeem the TK currency for cash or credit notes.'
    },
    {
      'ques': 'If I have 2 or mote legal entities do I need to achieve the targets for both firms?',
      'ans': 'Your targets will be decided on the consideration that they are under one umbrella (One TK currency account for one partner with multiple legal entities).'
    },
    {
      'ques': 'If I do not pay within 30 days what will happen to my TK currency?',
      'ans': 'If the customer does not pay the dues within 30 days of the invoice date, they will not get the TK currency (Deviation in payment cycle is not acceptable).'
    },
    {
      'ques': 'Can I upgrade to Silver /Gold or Platinum customer during the program ?',
      'ans': 'Yes customers can purchase more and based on slabs they can upgrade their Club every quarter (Sell more earn more).'
    },
    {
      'ques': 'Can I accumulate TK currency and redeem when I have more points ?',
      'ans': "Yes, customer has flexibility to redeem TK currency every quarter or accumulate the same, but finally he has to redeem in 4th quarter as it's a yearly program and TK currency has to be redeemed in post last quarter of 2019."
    },
    {
      'ques': 'What happens to my rest of the points if I do not use entire TK currency ?',
      'ans': "If a customer opts to take some article and does not uses all of his currency, the remaining currency would remain in the customer's account and accumulated with the next TK currency earned."
    },
    {
      'ques': 'Can I choose multiple articles and club it with TK goods as well?',
      'ans': "Yes, this combination is permissible,  as long as there is a balance of TK currency in the respective customers account"
    }]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TkFaqPage');
  }

  expandItem(event: any) {
    if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
      event.target.parentElement.classList.toggle('expand')
      event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
    }
  }
}
