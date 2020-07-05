import { Injectable } from "@angular/core";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DecimalPipe } from "@angular/common";
import { FileOpener } from "@ionic-native/file-opener";
import { Platform, LoadingController, AlertController } from "ionic-angular";
import { File } from '@ionic-native/file';
import { ApiServiceProvider } from "../api-service/api-service";
import { CommonService } from "../common.service";
import { StorageServiceProvider } from "../storage-service/storage-service";
import { WidgetUtilService } from "../../utils/widget-utils";
import { DatePipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PendingInvoiceService {
    height = 0;
    width = 0;
    documentDefinition: any;
    loaderDownloading: any;
    pdfObj: any;
    userInfo = {};
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    ledgerBalance: '853862.10';
    customerCurrentTotal: '907660.99';
    balance: '853862.45';
    cLimit: '3000000.00';
    tel = 'NA';
    data: any = {
        customerName: '',
        data: [
            {
                billNumber: '',
                invoiceDate: '',
                invoiceNo: '',
                transType: '',
                days: '',
                invoiceAmt: '',
                pendingAmt: ''
            }
        ]
    };

    constructor (
        private decimalPipe: DecimalPipe,
        private file: File,
        private fileOpener: FileOpener,
        private plt: Platform,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private commonService: CommonService,
        private storageService: StorageServiceProvider,
        private appService: ApiServiceProvider,
        private widgetCtrl: WidgetUtilService
    ) { }



    public generatePDF () {
        this.getData()
    }

    async getData () {
        this.userInfo = await this.commonService.getLoggedInUser();
        if (this.userInfo['userType'] === 'ADMIN' || this.userInfo['userType'] === 'ADMINHO') {
            let selectedCustomerprofile = await this.storageService.getFromStorage('editCustomerInfo')
            if (selectedCustomerprofile['userType'] === 'CUSTOMER') {
                this.userInfo = selectedCustomerprofile
            }
        } else if (this.userInfo['userType'] === 'SALESMAN' || this.userInfo['userType'] === 'SALESMANAGER') {
            let selectedCustomerprofile = await this.storageService.getFromStorage('selectedCustomer')
            this.userInfo['customerName'] = selectedCustomerprofile['name'];
            this.userInfo['customerAddress'] = selectedCustomerprofile['province'];
            this.userInfo['externalId'] = selectedCustomerprofile['externalId'];
        }
        
        this.loaderDownloading = this.loadingCtrl.create({
            content: "Please wait while downloading...",
        });
        this.loaderDownloading.present()
        this.appService.getPendingInvoiceData(this.userInfo['externalId'])
            .subscribe(res => {
                this.data = res.body[0];
                if (this.data && this.data.data && this.data.data.length) {
                    this.createPdf();
                } else {
                    this.widgetCtrl.showToast('No record found')
                }
                this.loaderDownloading.dismiss();
            }, err => {
                this.loaderDownloading.dismiss();
                console.error(err)
                this.widgetCtrl.showToast(err);
            })
    }


    createPdf () {
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
                { text: `Date ${new DatePipe('en_ZM').transform(new Date(), 'dd/M/yy')}`, fontSize: 11, alignment: 'right', color: 'black' },
                { text: 'Customer Wise Invoice/Payment Pending Report', fontSize: 13, bold: true, alignment: 'center', color: 'black', decoration: 'underline', margin: [0, 10, 0, 0] },
                { text: `Due Period ${new DatePipe('en_ZM').transform(new Date(new Date().getFullYear(), 0, 1), 'dd/M/yy')} to ${new DatePipe('en_ZM').transform(new Date(), 'dd/M/yy')}`, fontSize: 13, bold: true, alignment: 'center', color: 'black', margin: [0, 10, 0, 0] },
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
                        this.file.getFile(dirEntry, `${this.data['customerName'].replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}-Invoice.pdf`, { create: true })
                            .then(fileEntry => {
                                fileEntry.createWriter(writer => {
                                    writer.onwrite = () => {
                                        // this.loaderDownloading.dismiss();
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
                                                        this.fileOpener.open(`${storageLocation}${this.data['customerName'].replace(/[^a-zA-Z ]/g, "")}-${this.months[new Date().getMonth()]}-Invoice.pdf`, 'application/pdf')
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
                                // this.loaderDownloading.dismiss();
                                const alert = this.alertCtrl.create({ message: "214" + JSON.stringify(err), buttons: ['Ok'] });
                                alert.present();
                            });
                    })
                    .catch(err => {
                        // this.loaderDownloading.dismiss();
                        const alert = this.alertCtrl.create({ message: "220" + JSON.stringify(err), buttons: ['Ok'] });
                        alert.present();
                    });
            });
        } else {
            // this.loaderDownloading.dismiss();
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
                { text: `${this.data['customerName']}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, false, false] },
                { text: '', border: [false, true, false, false] },
                { text: 'Add:--', fontSize: 10, bold: true, border: [false, true, false, false] },
                { text: `${this.userInfo['customerAddress']}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, false, true] },
                { text: '', border: [false, true, false, false] },
                { text: 'Tel:-- ', fontSize: 10, bold: true, border: [false, true, false, false] },
                { text: `${this.tel}`, noWrap: true, color: 'blue', fontSize: 8, border: [false, true, true, false] },
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
        this.data.data.forEach(item => {
            const row = [
                {
                    text: item.billNumber,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [true, true, false, false] : [true, false, false, false]
                },
                {
                    text: `${new DatePipe('en_ZM').transform(new Date(item.invoiceDate), 'dd/M/yy')}`,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false]
                },
                {
                    text: item.invoiceNo,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false]
                },
                {
                    text: item.transType,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false]
                },
                {
                    text: `${item.days} Days`,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false]
                },
                {
                    text: this.decimalPipe.transform(item.invoiceAmt, '.2'),
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false],
                    alignment: 'right'
                },
                {
                    text: `${this.decimalPipe.transform(item.pendingAmt, '.2')} ZMW`,
                    color: textColorSecondary,
                    fontSize: 8,
                    margin: [0, 6, 0, 6],
                    lineHeight: 1,
                    border: i === 0 ? [false, true, false, false] : [false, false, false, false],
                    alignment: 'right'
                },
                {
                    text: 'NA',
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
                { text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
                { text: 'C Limit', color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
                { text: `NA`, noWrap: true, color: 'brown', fontSize: 10, margin: [0, 6, 0, 6], bold: true, border: [false, true, false, true] },
                { text: '', border: [false, true, false, true] },
                { text: `${this.decimalPipe.transform(this.getInvoiceTotalAmount(), '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
                { text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, true] },
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
                { text: `${this.decimalPipe.transform(this.getInvoiceTotalAmount(), '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false] },
                { text: `${this.decimalPipe.transform(this.getInvoicePendingTotalBalance(), '.2')}`, color: headingColor, fontSize: 10, margin: [0, 6, 0, 6], alignment: 'right', bold: true, border: [false, true, false, false] },
                { text: '', border: [false, true, false, false] },
            ]
        );

        return body;
    }

    getInvoiceTotalAmount () {
        let sum = 0;
        this.data.data.forEach(item => {
            sum = sum + item.invoiceAmt;
        })     
        return sum;
    }

    getInvoicePendingTotalBalance () {
        let sum = 0;
        this.data.data.forEach(item => {
            sum = sum + item.pendingAmt;
        })
        return sum;
    }
}