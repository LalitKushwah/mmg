import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generated class for the CustomerInvoiceReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-invoice-report',
  templateUrl: 'customer-invoice-report.html',
})
export class CustomerInvoiceReportPage {

  loaderDownloading: any;
  height = 0;
  width = 0;
  documentDefinition: any;
  pdfObj: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  data = {
    duePeriodStart: '01-01-2020',
    duePeriodEnd: '19-06-2020',
    invoiceDate: '19-JUN-20 10:54 AM',
    customerInfo: {
      customerName: 'DAKIK DISCOUNT CENTER - KITWE',
      ledgerBalance: '853862.10',
      cLimit: '3000000.00',
      customerCurrentTotal: '907660.99',
      balance: '853862.45',
      address: ' Copperbelt Zambia',
      tel: ''
    },
    invoiceData: [
      {
        systemVoucher: '20-05-2020 SV01301',
        documentDate: '20-05-2020',
        documentNumber: 'LS00012190',
        type: 'Invoice',
        period: '30 Days',
        documentAmount: '46551.25',
        balance: '6818.40',
        exRate: '1.0000'
      },
      {
        systemVoucher: '20-05-2020 SV01301',
        documentDate: '20-05-2020',
        documentNumber: 'LS00012190',
        type: 'Invoice',
        period: '30 Days',
        documentAmount: '46551.25',
        balance: '6818.40',
        exRate: '1.0000'
      },
      {
        systemVoucher: '20-05-2020 SV01301',
        documentDate: '20-05-2020',
        documentNumber: 'LS00012190',
        type: 'Invoice',
        period: '30 Days',
        documentAmount: '46551.25',
        balance: '6818.40',
        exRate: '1.0000'
      },
      {
        systemVoucher: '20-05-2020 SV01301',
        documentDate: '20-05-2020',
        documentNumber: 'LS00012190',
        type: 'Invoice',
        period: '30 Days',
        documentAmount: '46551.25',
        balance: '6818.40',
        exRate: '1.0000'
      },
      {
        systemVoucher: '20-05-2020 SV01301',
        documentDate: '20-05-2020',
        documentNumber: 'LS00012190',
        type: 'Invoice',
        period: '30 Days',
        documentAmount: '46551.25',
        balance: '6818.40',
        exRate: '1.0000'
      }
    ]
  };

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private decimalPipe: DecimalPipe,
    private file: File,
    private fileOpener: FileOpener,
    private plt: Platform,
    private alertCtrl: AlertController
    ) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad CustomerInvoiceReportPage');
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
            margin: [0, 10, 40, 0],
            alignment: 'right'
          }
        ]
      },
      pageSize: 'A4',
      content: [
        { text: 'Trade Kings Limited Zambia', fontSize: 12, bold: true, alignment: 'center', color: 'black', decoration: 'underline', margin: [0, -10, 0, 0] },
        { text: `Date : ${this.data.invoiceDate}`, fontSize: 11, alignment: 'right', color: 'black' },
        { text: 'Customer Wise Invoice/Payment Pending Report', fontSize: 13, bold: true, alignment: 'center', color: 'black', decoration: 'underline', margin: [0, 10, 0, 0] },
        { text: `Due Period ${this.data.duePeriodStart} To ${this.data.duePeriodEnd}`, fontSize: 13, bold: true, alignment: 'center', color: 'black', margin: [0, 10, 0, 0] },
        {
          absolutePosition: { x: 20, y: this.height += 110 },
          table: {
            headerRows: 1,
            // widths: ['auto','auto','auto','auto','auto','auto'],
            widths: [100, 70, 70, 40, 30, 70, 60, 40],
            body: this.prepareTableData()
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
            this.file.getFile(dirEntry, `${this.data.customerInfo.customerName.replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}-Invoice.pdf`, { create: true })
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
                            this.fileOpener.open(`${storageLocation}${this.data.customerInfo.customerName.replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}-Invoice.pdf`, 'application/pdf')
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
                  }
                  writer.write(binaryArray);
                })
              })
              .catch(err => {
                this.loaderDownloading.dismiss();
                const alert = this.alertCtrl.create({ message: "214" + JSON.stringify(err), buttons: ['Ok'] });
                alert.present();
              });
          })
          .catch(err => {
            this.loaderDownloading.dismiss();
            const alert = this.alertCtrl.create({ message: "220" + JSON.stringify(err), buttons: ['Ok'] });
            alert.present();
          });
      });
    } else {
      this.loaderDownloading.dismiss();
      this.pdfObj.open();
    }
  }

  prepareTableData () {
    let headingColor = 'black';
    let textColorSecondary = '#202020';
    const body = []

    body.push(
      [
        { text: 'Customer Name:--', fontSize: 10, bold: true, border: [true, true, false, false] },
        { text: `${this.data.customerInfo.customerName}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        { text: 'Add:--', fontSize: 10, bold: true, border: [false, true, false, false] },
        { text: `${this.data.customerInfo.address}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, false, true] },
        { text: '', border: [false, true, false, false] },
        { text: 'Tel:-- ', fontSize: 10, bold: true, border: [false, true, false, false] },
        { text: `${this.data.customerInfo.tel}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, true, false] },
      ]
    );

    body.push(
      [
        { text: 'System Voucher', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [true, true, false, true] },
        { text: 'Document Date', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'Document No', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'Type', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'Period', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'Document Amt', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
        { text: 'Balance', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
        { text: 'Ex Rate', color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, true, true] },
      ]
    );
    let i = 0  
    this.data.invoiceData.forEach(item => {
      const row = [
        {
          text: item.systemVoucher,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [true, true, false, false] : [true, false, false, false]
        },
        {
          text: item.documentDate,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: item.documentNumber,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: item.type,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: item.period,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false]
        },
        {
          text: this.decimalPipe.transform(item.documentAmount, '.2'),
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false],
          alignment: 'right'
        },
        {
          text: `${this.decimalPipe.transform(item.balance, '.2')} ZMW`,
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, false, false] : [false, false, false, false],
          alignment: 'right'
        },
        {
          text: this.decimalPipe.transform(item.exRate, '.4'),
          color: textColorSecondary,
          fontSize: 8,
          margin: [0, 6, 0, 6],
          lineHeight: 1,
          border: i === 0 ? [false, true, true, false] : [false, false, true, false],
          alignment: 'right'
        }
      ];
      i++;
      body.push(row);
    });

    body.push(
      [
        { text: 'Ledger Balance', color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [true, true, false, true] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.ledgerBalance, '.2')}`, color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: 'C Limit', color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.cLimit, '.2')}`, noWrap: true, color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
        { text: '', border: [false, true, false, true] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.customerCurrentTotal, '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.balance, '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
        { text: '', border: [false, true, true, true] },
      ]
    );

    body.push(
      [
        { text: '', border: [false, true, false, false] },
        { text: ``, border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
        { text: 'Report Total', color: headingColor, noWrap: true, fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, false] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.customerCurrentTotal, '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false] },
        { text: `${this.decimalPipe.transform(this.data.customerInfo.balance, '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false] },
        { text: '', border: [false, true, false, false] },
      ]
    );

    return body;
  }

}
