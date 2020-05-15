import { Component } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CommonService } from '../../providers/common.service';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

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
  loaderDownloading: any;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiServiceProvider,
    public commonService: CommonService,
    private loadingCtrl: LoadingController,
    private storageService: StorageServiceProvider,
    private file: File, private fileOpener: FileOpener,
    private plt: Platform,
    private alertCtrl: AlertController,
    private decimalPipe: DecimalPipe) {
  }

  async ionViewWillEnter () {
    this.userInfo = await this.commonService.getLoggedInUser();
    if (this.userInfo['userType'] === 'ADMIN' || this.userInfo['userType'] === 'ADMINHO') {
      let selectedCustomerprofile = await this.storageService.getFromStorage('editCustomerInfo')
      if (selectedCustomerprofile['userType'] === 'CUSTOMER') {
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
    this.apiService.getUserTransactions(this.userInfo.externalId).subscribe((res: any) => {
      if (res && res.body && res.body.length) {
        this.statements = res.body[0].statements;
        this.userInfo = res.body[0];
        if (this.statements && this.statements.length) {
          this.statements.map(item => {
            if (item.credit) item.credit = Number(item.credit).toFixed(2)
            if (item.debit) item.debit = Number(item.debit).toFixed(2)
            if (item.balance) item.balance = Number(item.balance).toFixed(2)
          })
          this.statements.sort(function (a, b) {
            var c: any = new Date(a.date);
            var d: any = new Date(b.date);
            return (c - d);
          });
        }
        this.loader.dismiss();
        this.calculateTotalCredAmount();
        this.calculateTotalDebAmount();
      } else {
        this.loader.dismiss();
      }
    }, err => {
      console.error(err);
      this.loader.dismiss();
    });
  }

  createPdf () {
    this.loaderDownloading = this.loadingCtrl.create({
      content: "Please wait while downloading...",
    });
    this.loaderDownloading.present()
    this.height = 0;
    this.width = 0;
    let textColorPrimary = '#000000';
    this.documentDefinition = {
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: 12,
            color: 'grey',
            margin: 20,
            alignment: 'right'
          }
        ]
      },
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
            }
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
          text: `Period ${new DatePipe('en_ZM').transform(this.statements[0].date, 'dd/M/yy')} to ${new DatePipe('en_ZM').transform(this.statements[this.statements.length - 1].date, 'dd/M/yy')}`,
          absolutePosition: { x: 50, y: this.height += 60 },
          fontSize: 9,
          alignment: 'right',
          bold: true,
          color: textColorPrimary
        }, /* h205 */
        {
          absolutePosition: { x: 50, y: this.height += 30 },
          // absolutePosition: { x: 50, y: this.height += 60 },
          // layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            // widths: ['auto','auto','auto','auto','auto','auto'],
            widths: ['*', '*', 100, 70, 70, 80],
            body: this.prepareRowData()
          },
          layout: { hLineColor: 'black', vLineColor: 'black' }
        }
      ],
      pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        let flag = false;
        if (currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0) {
          flag = true;
        }

        if (currentNode.startPosition.top > 750) {
          flag = true;
        }

        if (currentNode.hasOwnProperty('id')) {
          // totalCard = currentNode.startPosition.top;
          // console.log('total', totalCard);
        }
        return flag;
      }
    };

    this.pdfObj = pdfMake.createPdf(this.documentDefinition);
    this.downloadPdf();
  }

  downloadPdf () {
    if (window['cordova']) {
      this.pdfObj.getBuffer(buffer => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; //
        let storageLocation: any;
        if (this.plt.is('ios')) {
          storageLocation = this.file.documentsDirectory;
        } else {
          storageLocation = this.file.externalRootDirectory;
        }
        this.file.resolveDirectoryUrl(storageLocation)
          .then(dirEntry => {
            this.file.getFile(dirEntry, `${this.userInfo.customerName.replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}.pdf`, { create: true })
              .then(fileEntry => {
                fileEntry.createWriter(writer => {
                  writer.onwrite = () => {
                    this.loaderDownloading.dismiss();
                    const confirm = this.alertCtrl.create({
                      title: 'PDF Downloaded!',
                      message: 'Your Pdf is downloaded in your storage, Do you want to open now!',
                      buttons: [
                        {
                          text: 'Cancel',
                          handler: () => {
                            console.log('Confirmed Cancel');
                          }
                        },
                        {
                          text: 'Okay',
                          handler: () => {
                            this.fileOpener.open(`${storageLocation}${this.userInfo.customerName.replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}.pdf`, 'application/pdf')
                              .then(res => { })
                              .catch(err => {
                                const alert = this.alertCtrl.create({ message: "225" + JSON.stringify(err.message), buttons: ['Ok'] });
                                alert.present();
                              });
                          }
                        }
                      ]
                    });
                    confirm.present();
                    // this.fileOpener.open(fileEntry.toURL(), 'application/pdf')
                    //   .then(res => { })
                    //   .catch(err => {
                    //     const alert = this.alertCtrl.create({ message: err.message, buttons: ['Ok'] });
                    //     alert.present();
                    //   });
                  }
                  writer.write(binaryArray);
                })
              })
              .catch(err => {
                this.loaderDownloading.dismiss();
                const alert = this.alertCtrl.create({ message: "245" + JSON.stringify(err), buttons: ['Ok'] });
                alert.present();
              });
          })
          .catch(err => {
            this.loaderDownloading.dismiss();
            const alert = this.alertCtrl.create({ message: "251" + JSON.stringify(err), buttons: ['Ok'] });
            alert.present();
          });

      });
    } else {
      this.pdfObj.open();
    }
  }

  prepareRowData () {
    let headingColor = '#8f1515';
    let textColorSecondary = '#202020';
    const body = []
    body.push(
      [
        { text: 'DATE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'REFERENCE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'DESCRIPTION', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6] },
        { text: 'DEBIT', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: 'CREDIT', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: 'BALANCE', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right' }
      ]
    );

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
          text: statement.debit ? this.decimalPipe.transform(statement.debit, '.2') : '',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          alignment: 'right'
        },
        {
          text: statement.credit ? this.decimalPipe.transform(statement.credit, '.2') : '',
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          alignment: 'right'
        },
        {
          text: statement.balance ? this.decimalPipe.transform(statement.balance, '.2') + '  DR': '',
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
        { text: '' },
        { text: '' },
        { text: '' },
        { text: this.decimalPipe.transform(Number(this.totalDebAmount), '.2'), color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: this.decimalPipe.transform(Number(this.totalCredAmount), '.2'), color: 'black', fontSize: 11, margin: [0, 6, 0, 6], alignment: 'right' },
        { text: '' }
      ]
    );

    body.push(
      [
        { border: [true, false, true, false], text: 'TOTAL AMOUNT DUE', colSpan: 6, margin: [0, 6, 0, 0], fontSize: 11, bold: true, alignment: 'right', color: '#000000' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' }
      ]
    );
    body.push(
      [
        {
          text: `${this.decimalPipe.transform(Number(this.statements[this.statements.length - 1].balance), '.2')} DR`,
          border: [true, false, true, true],
          colSpan: 6,
          fontSize: 10,
          bold: true,
          color: 'blue',
          alignment: 'right',
          margin: [0, 6, 0, 6]
        },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
        { border: [false, false, false, false], text: '' },
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
