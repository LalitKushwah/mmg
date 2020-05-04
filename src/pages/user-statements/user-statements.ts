import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CommonService } from '../../providers/common.service';
import {  File } from '@ionic-native/file';
import {  FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
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
  // tempIterate = ['1','1','1','1'];
  totalDebAmount = 0;
  totalCredAmount = 0;
  userName = '';
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  pdfObj;
  documentDefinition;

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider,
    public commonService: CommonService,
    private loadingCtrl: LoadingController,
    private storageService: StorageServiceProvider,
    private file: File, private fileOpener: FileOpener,
    private plt: Platform,
    private alertCtrl: AlertController) {
  }

  async ionViewWillEnter () {
    this.userInfo = await this.commonService.getLoggedInUser();
    if (this.userInfo['userType'] === 'ADMIN' || this.userInfo['userType'] === 'ADMINHO') {
      let selectedCustomerprofile = await this.storageService.getFromStorage('editCustomerInfo')
      if(selectedCustomerprofile['userType']==='CUSTOMER'){
        this.userInfo = selectedCustomerprofile
      }
    } else if (this.userInfo['userType'] === 'SALESMAN' || this.userInfo['userType'] === 'SALESMANAGER') {
      let selectedCustomerprofile = await this.storageService.getFromStorage('selectedCustomer')
      this.userInfo.customerName = selectedCustomerprofile['name'];
      this.userInfo.customerAddress = selectedCustomerprofile['province'];
      this.userInfo.externalId = selectedCustomerprofile['externalId'];
    }
    this.loader = this.loadingCtrl.create({
      content: "Fetching Records...",
    });
    this.loader.present()
    this.apiService.getUserTransactions(this.userInfo.externalId).subscribe(res => {
      this.statements = res.body[0].statements;
      this.userInfo = res.body[0];
      if (this.statements && this.statements.length) {
        this.statements.sort(function (a, b) {
          var c: any = new Date(a.date);
          var d: any = new Date(b.date);
          return (c - d);
        });
      }
      this.loader.dismiss();
      this.calculateTotalCredAmount();
      this.calculateTotalDebAmount();
      this.createPdf()
    }, err => {
      console.error(err);
      this.loader.dismiss();
    });
  }

  createPdf () {
    let textColorPrimary = '#000000';
    this.documentDefinition = {
      header: function (currentPage, pageCount, pageSize){},
      pageSize: 'A4',
      content: [
        { text: 'STATEMENT', fontSize: 18, bold: true, alignment: 'center', color: 'blue', decoration: 'underline' },
        { text: 'CUSTOMER\'S NAME & ADDRESS', bold: true, color: textColorPrimary },
        {
          canvas: [
            {
              type: 'rect',
              x: 0.5,
              y: this.height += 2,
              w: 203,
              h: 105,
              r: 4,
              lineColor: '#D3D3D3',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 0.5,
              y: this.height,
              w: 200,
              h: 102,
              r: 4,
              lineColor: '#D3D3D3',
              color: 'white'
            },
            {
              type: 'rect',
              x: 315,
              y: this.height,
              w: 213,
              h: 105,
              r: 4,
              lineColor: '#D3D3D3',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 315,
              y: this.height,
              w: 210,
              h: 102,
              r: 4,
              lineColor: '#D3D3D3',
              color: 'white'
            },
          ]
        },
        {
          text: this.userInfo.customerName,
          absolutePosition: { x: 50, y: this.height += 88 },
          fontSize: 10,
          color: textColorPrimary
        }, /* h90 */
        {
          text: this.userInfo.customerAddress,
          absolutePosition: { x: 50, y: this.height += 40 },
          fontSize: 9,
          color: textColorPrimary
        }, /* h130 */
        {
          text: 'TRADE KINGS LIMITED ZAMBIA',
          absolutePosition: { x: 0, y: this.height - 40 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* 90 */
        {
          text: 'PLOT NO 29381, NAMPUNDWE RD..LUSKA, ZAMBIA',
          absolutePosition: { x: 0, y: this.height - 25 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* 105 */
        {
          text: 'L GHT INDUSTRIAL AREA',
          absolutePosition: { x: 0, y: this.height - 10 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* 120 */
        {
          text: 'TEL: - ',
          absolutePosition: { x: 0, y: this.height += 5 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* h135 */
        {
          text: 'FAX: +264 211-286127',
          absolutePosition: { x: 0, y: this.height += 15 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* h150 */
        {
          text: 'E-MAIL: info.tradekings.co.zm',
          absolutePosition: { x: 0, y: this.height += 15 },
          fontSize: 8,
          color: textColorPrimary,
          alignment: 'right'
        }, /* h165 */
        {
          text: 'TIN No. 1001736629',
          absolutePosition: { x: 0, y: this.height += 25 },
          fontSize: 8,
          bold: true, 
          color: textColorPrimary,
          alignment: 'right'
        }, /* h190 */
        {
          text: 'Period 01-01-2020 to 07-04-2020',
          absolutePosition: { x: 50, y: this.height += 15 },
          fontSize: 9,
          bold: true, 
          color: textColorPrimary
        }, /* h205 */
        {
          text: 'PAGE No.         1 of 1',
          absolutePosition: { x: 470, y: this.height },
          fontSize: 9,
          bold: true, 
          color: textColorPrimary
        }, /* h205 */
        {
          absolutePosition: { x: 50, y: this.height += 25 },
          // layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [ '*', '*', 100, 50, 50, 100 ],
            body: this.prepareRowData()
          },
          layout: {hLineColor: 'black', vLineColor: 'black'}
        },
        // View For Total Amount Due Begin
        {
          // absolutePosition: { x: 0, y: this.height },
          canvas: [
            {
              type: 'rect',
              x: 350,
              y: this.height - 165,
              w: 180,
              h: 65,
              r: 4,
              lineColor: '#D3D3D3',
              color: '#D3D3D3'
            },
            {
              type: 'rect',
              x: 350,
              y: this.height - 165,
              w: 177,
              h: 62,
              r: 4,
              lineColor: '#D3D3D3',
              color: 'white'
            },
          ]
        },
        {
          text: 'TOTAL AMOUNT DUE',
          absolutePosition: { x: 0, y: this.height + 30},
          fontSize: 11,
          bold: true,
          color: textColorPrimary,
          alignment: 'right'
        },
        {
          text: `${Number(this.statements[this.statements.length -1].balance).toFixed(2)} DR`,
          absolutePosition: { x: 0, y: this.height + 50},
          fontSize: 10,
          color: 'blue',
          alignment: 'right'
        },
        // View For Total Amount Due End
        // {
        //   canvas: [
        //       {
        //           type: 'line',
        //           x1: 10,
        //           y1: this.height - 360,
        //           x2: 515,
        //           y2: this.height - 360,
        //           lineWidth: 2
        //       }
        //   ]
        // }
        
      ],
      pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
      }
    };
    // const doc =pdfMake.createPdf(documentDefinition)
    // doc.getBase64((data) => { window.location.href = 'data:application/pdf;base64,' + data; });

    this.pdfObj = pdfMake.createPdf(this.documentDefinition);
  }

  downloadPdf () {
    pdfMake.createPdf(this.documentDefinition).getBuffer(buffer => {
      var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
      let binaryArray = utf8.buffer; //
      this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
        .then(dirEntry => {
      this.file.getFile(dirEntry, `${this.userInfo.customerName}-${this.months[new Date().getMonth()]}.pdf`, { create: true })
            .then(fileEntry => {
              fileEntry.createWriter(writer => {
                writer.onwrite = () => {
                  this.fileOpener.open(fileEntry.toURL(), 'application/pdf')
                    .then(res => { })
                    .catch(err => {
                      const alert = this.alertCtrl.create({ message: err.message, buttons: ['Ok'] });
                      alert.present();
                    });
                }
                writer.write(binaryArray);
              })
            })
            .catch(err => {
              const alert = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
              alert.present();
            });
        })
        .catch(err => {
          const alert = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
          alert.present();
        });

    });
  }

  saveToDevice (data:any,savefile:any) {
    console.log('======== Save To Device Called =========');
    let self = this;
    self.file.writeFile(self.file.externalDataDirectory, savefile, data, {replace:false})
        .then(() => {
          console.log('====== file written successfull =====');
        }).catch(ex => {
          console.log('========= Error while writing file ==========', ex);
        });
    // const toast = self.toastCtrl.create({
    // message: 'File saved to your device',
    // duration: 3000,
    // position: 'top'
    // });
    //toast.present();
    console.log('file saved')
    }

  prepareRowData () {
    let headingColor = '#8f1515';
    let textColorSecondary = '#202020';
    const body = []
    body.push(
      [
        { text: 'DATE', color: headingColor, fontSize: 10},
        { text: 'REFERENCE', color: headingColor, fontSize: 10 },
        { text: 'DESCRIPTION', color: headingColor, fontSize: 10},
        { text: 'DEBIT', color: headingColor, fontSize: 10,  alignment: 'right' },
        { text: 'CREDIT', color: headingColor, fontSize: 10, alignment: 'right' },
        { text: 'BALANCE', color: headingColor, fontSize: 10, alignment: 'right' }
      ]
    );
    // tslint:disable-next-line: max-line-length
    // body.push([ '', '', 
    //   { 
    //     text: 'Brought Forward', 
    //     color: 'blue', 
    //     bold: true, 
    //     fontSize: 9,
    //     margin: [0, 6, 0, 6] 
    //   }, '', '', 
    //   { 
    //     text: '24,023.75 DR', 
    //     color: 'blue', 
    //     bold: true, 
    //     fontSize: 8,
    //     margin: [0, 6, 0, 6], 
    //     alignment: 'right' 
    //   }
    // ]);

    this.height += 50;

    // Remove the temp iterate forEachloop after testing after testing
    // this.tempIterate.forEach(element => {
    //   console.log('+-+-+-+');

    //     //Main code Begin
    //     this.statements.forEach(statement => {
    //       this.height += 26;
    //       const row = [
    //         {
    //         text: new DatePipe('en_ZM').transform(statement.date, 'dd/mm/yy'),
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1
    //       },
    //       {
    //         text: statement.ref,
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1
    //       },
    //       {
    //         text: statement.desc,
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1
    //       },
    //       {
    //         text: statement.debit ? Number(statement.debit).toFixed(2): '',
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1,
    //         alignment: 'right'
    //       },
    //       {
    //         text: statement.credit ? Number(statement.credit).toFixed(2): '',
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1,
    //         alignment: 'right'
    //       },
    //       {
    //         text: Number(statement.balance).toFixed(2) + '  DR',
    //         color: textColorSecondary,
    //         fontSize: 8,
    //         margin: [0, 6, 0, 6],
    //         lineHeight: 1,
    //         alignment: 'right'
    //       }
    //     ]
    //     body.push(row);
        
    //   }
      
    //   )
    //   //Main code End

    // });
    
    this.statements.forEach(statement => {
          this.height += 26;
          const row = [
            {
            text: new DatePipe('en_ZM').transform(statement.date, 'dd/M/yy'),
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1
          },
          {
            text: statement.ref,
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1
          },
          {
            text: statement.desc,
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1
          },
          {
            text: statement.debit ? Number(statement.debit).toFixed(2): '',
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1,
            alignment: 'right'
          },
          {
            text: statement.credit ? Number(statement.credit).toFixed(2): '',
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1,
            alignment: 'right'
          },
          {
            text: Number(statement.balance).toFixed(2) + '  DR',
            color: textColorSecondary,
            fontSize: 8,
            margin: [0, 6, 0, 6],
            lineHeight: 1,
            alignment: 'right'
          }
        ]
        body.push(row);
        
      }
      
    )

  // Total Credit Debit Row
  this.height += 20;
  body.push(
    [
      { text: ''},
      { text: ''},
      { text: ''},
      { text: Number(this.totalDebAmount).toFixed(2), color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right' },
      { text: Number(this.totalCredAmount).toFixed(2), color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right' },
      { text: ''}
    ]
  );

    return body;
  }

  calculateTotalDebAmount () {
    this.statements.forEach(trans => {
      if (trans.debit && trans.debit !== '' && trans.debit !== ' ') {
        this.totalDebAmount = this.totalDebAmount + trans.debit;
      }
    })
  }

  calculateTotalCredAmount () {
    this.statements.forEach(trans => {
      if (trans.credit && trans.credit !== '' && trans.credit !== ' ') {
        this.totalCredAmount = this.totalCredAmount + trans.credit;
      }
    })
  }


  ionViewDidLoad () {
    console.log('ionViewDidLoad UserStatementsPage');
  }

}
