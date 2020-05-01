import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CommonService } from '../../providers/common.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
/**
 * Generated class for the UserStatementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-statements',
  templateUrl: 'user-statements.html',
})
export class UserStatementsPage {

  statements = []
  userInfo;
  loader: any
  title = 'PDF-Angular';
  width = 0;
  height = 0; /* h */

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider,
    public commonService: CommonService,
    private loadingCtrl: LoadingController) {
  }

  async ionViewWillEnter () {
    const loggedInUser: any = await this.commonService.getLoggedInUser();
    this.loader = this.loadingCtrl.create({
      content: "Fetching Records...",
    });
    this.loader.present()
    this.apiService.getUserTransactions(loggedInUser.externalId).subscribe(res => {
      this.statements = res.body[0].statements;
      this.userInfo = res.body[0];
      if (this.statements && this.statements.length) {
        this.statements.sort(function (a, b) {
          var c: any = new Date(a.date);
          var d: any = new Date(b.date);
          return (c - d);
        }).reverse();
      }
      this.loader.dismiss();
    }, err => {
      console.error(err);
      this.loader.dismiss();
    });
  }

  downloadPdf () {
    let documentDefinition = {
      content: [
        { text: 'STATEMENTS', fontSize: 18, bold: true, alignment: 'center', color: 'blue', decoration: 'underline' },
        { text: 'CUSTOMER\'S NAME & ADDRESS', color: '#888' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0.5,
              y: this.height += 2,
              w: 205,
              h: 105,
              r: 4,
              lineColor: 'black',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 0.5,
              y: this.height,
              w: 200,
              h: 100,
              r: 4,
              lineColor: 'black',
              color: 'white'
            },
            {
              type: 'rect',
              x: 310,
              y: this.height,
              w: 220,
              h: 105,
              r: 4,
              lineColor: 'black',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 315,
              y: this.height,
              w: 210,
              h: 100,
              r: 4,
              lineColor: 'black',
              color: 'white'
            },
          ]
        },
        {
          text: this.userInfo.customerName,
          absolutePosition: { x: 50, y: this.height += 88 },
          fontSize: 8,
          color: '#888'
        }, /* h90 */
        {
          text: this.userInfo.customerAddress,
          absolutePosition: { x: 50, y: this.height += 40 },
          fontSize: 8,
          color: '#888'
        }, /* h130 */
        {
          text: 'TRADE KINGS LIMITED ZAMBIA',
          absolutePosition: { x: 0, y: this.height - 40 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* 90 */
        {
          text: 'PLOT NO 29381, NAMPUNDWE RD..LUSKA, ZAMBIA',
          absolutePosition: { x: 0, y: this.height - 25 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* 105 */
        {
          text: 'L GHT INDUSTRIAL AREA',
          absolutePosition: { x: 0, y: this.height - 10 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* 120 */
        {
          text: 'TEL:',
          absolutePosition: { x: 0, y: this.height += 5 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* h135 */
        {
          text: 'FAX: +264 211-286127',
          absolutePosition: { x: 0, y: this.height += 15 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* h150 */
        {
          text: 'E-MAIL: info.tradekings.co.zm',
          absolutePosition: { x: 0, y: this.height += 15 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* h165 */
        {
          text: 'T N No. 1001736629',
          absolutePosition: { x: 0, y: this.height += 25 },
          fontSize: 8,
          color: '#888',
          alignment: 'right'
        }, /* h190 */
        {
          text: 'Period 01-01-2020 to 07-04-2020',
          absolutePosition: { x: 50, y: this.height += 15 },
          fontSize: 9,
          color: '#888'
        }, /* h205 */
        {
          text: 'PAGE No         1 of 1',
          absolutePosition: { x: 470, y: this.height },
          fontSize: 9,
          color: '#888'
        }, /* h205 */
        {
          absolutePosition: { x: 50, y: this.height += 25 },
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [ '*', '*', 100, 50, 50, 100 ],
            body: this.prepareRowData()
          }
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  prepareRowData () {
    const body = []
    body.push(
      [
        { text: 'DATE', color: '#ff6262', fontSize: 10 },
        { text: 'REFERENCE', color: '#ff6262', fontSize: 10 },
        { text: 'DESCRIPTION', color: '#ff6262', fontSize: 10, alignment: 'left' },
        { text: 'DEBIT', color: '#ff6262', fontSize: 10,  alignment: 'right' },
        { text: 'CREDIT', color: '#ff6262', fontSize: 10, alignment: 'right' },
        { text: 'BALANCE', color: '#ff6262', fontSize: 10, alignment: 'right' }
      ]
    );
      // tslint:disable-next-line: max-line-length
      body.push([ '', '', { text: 'Brought Forward', color: 'blue', fontSize: 8 }, '', '', { text: '24,023.75 DR', color: 'blue', fontSize: 8, alignment: 'right' } ]),

    this.statements.forEach(statement => {
      const row = [
        {
        text: new DatePipe('en_ZM').transform(statement.date, 'dd/mm/yy'),
        color: '#888',
        fontSize: 8
      },
      {
        text: statement.ref,
        color: '#888',
        fontSize: 8
      },
      {
        text: statement.desc,
        color: '#888',
        fontSize: 8
      },
      {
        text: statement.debit ? Number(statement.debit).toFixed(2): '-',
        color: '#888',
        fontSize: 8
      },
      {
        text: statement.credit ? Number(statement.credit).toFixed(2): '-',
        color: '#888',
        fontSize: 8
      },
      {
        text: Number(statement.balance).toFixed(2),
        color: '#888',
        fontSize: 8
      }
    ]
    body.push(row);
  })
    return body;
  }


  ionViewDidLoad () {
    console.log('ionViewDidLoad UserStatementsPage');
  }

}
