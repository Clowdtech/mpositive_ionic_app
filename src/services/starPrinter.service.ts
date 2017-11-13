import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Utils } from "./utils";
import { Bluetooth } from "./bluetooth.service";
import { OrderItem } from "../components/check-out-list/orderItem.class";
import { appConfig } from "../app/config";

@Injectable()
export class StarPrinterService {

    private starPlugin: any = null;
    private preferredPrinter: any = null;
    private printers: Array<any>;
    private currency: string = appConfig.defaultCurrency;
    private _receipt: { header: string, footer: string } = { header: '', footer: '' };
    private storagePrinterPath: string = 'mp_prefer_printer';
    private storageReceiptPath: string = 'mp_receipt';
    public receiptWidth: number = 48;

    public get plugin () {
        return this.starPlugin;
    }
    public set plugin (plugin: any) {
        if (!plugin) {
            this.starPlugin = null;
            console.warn('No Star plugin found');
            return;
        }
        this.starPlugin = plugin;
    }

    public get prefPrinter () {
        if (!this.preferredPrinter) {
            const printer = window.localStorage.getItem(this.storagePrinterPath);
            if (printer && printer !== 'null') {
                this.preferredPrinter = JSON.parse(printer);
            }
        }
        return this.preferredPrinter;
    }
    public set prefPrinter (printer: any) {
        if (printer) {
            this.preferredPrinter = printer;
            window.localStorage.setItem(this.storagePrinterPath, JSON.stringify(printer))
        }
    }

    public get receipt () {
        if (!this._receipt.header && !this._receipt.footer) {
            const receipt = window.localStorage.getItem(this.storageReceiptPath);
            if (receipt && receipt !== 'null') {
                this._receipt = JSON.parse(receipt);
            }
        }
        return this._receipt;
    }
    public set receipt (receipt: any) {
        if (receipt) {
            this._receipt = receipt;
            window.localStorage.setItem(this.storageReceiptPath, JSON.stringify(receipt))
        }
    }

    constructor(private platform: Platform, private utils: Utils, private bluetooth: Bluetooth) {
        this.preferredPrinter = this.prefPrinter;

        this.platform.ready().then(() => {
            this.plugin = window['plugins'] ? window['plugins'].starPrinter : null;
        }, error => {
            console.log(error);
        });
    }

    findPrinters() {
        return new Promise((resolve, reject) => {
            if (!this.plugin) {
                reject('Printer plugin is not installed');
                return;
            }

            this.plugin.portDiscovery('Bluetooth', (error, printers) => {
                if (error) {
                    reject(error);
                    return;
                }
                this.printers = printers;
                resolve(printers);
            });
        });
    }

    getStatus(printer: any) {
        return new Promise((resolve, reject) => {
            this.starPlugin.checkStatus(printer.name, (error, status) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(status);
            });
        });
    }

    print(receipt: string) {
        return new Promise((resolve, reject) => {
            if (!this.preferredPrinter) {
                reject('No printer found. Please add in Settings');
                return;
            }

            if (!this.bluetooth.isEnabled) {
                reject('Turn on Bluetooth to print!');
                return;
            }
            //TODO investigate how to save a whole object ot this.preferredPrinter on Settings page
            this.starPlugin.printReceipt(this.preferredPrinter, receipt, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    alignRight (txt: string, offset: number = 0): string {
        let output = '';
        if (txt.length <= this.receiptWidth) {
            output = `${new Array(this.receiptWidth - txt.length - offset).join(' ')}${txt}`;
        }
        return output;
    }

    alignCenter(txt: string) {
        let output = '',
            breaksArr = txt.split('\n');
        breaksArr.forEach((str) => {
            const chunks = this.chunkString(str, this.receiptWidth);
            if (chunks) {
                chunks.forEach((chunk) => {
                    output += `${new Array(Math.round((this.receiptWidth - chunk.length)/2)).join(' ')}${chunk}\n`;
                });
            }
        });

        return output;
    }

    chunkString(str, length) {
        return str.match(new RegExp('.{1,' + length + '}', 'g'));
    }

    /**
     * Create receipt body
     * @return {string}
     **/
    public formReceiptBody(orders: Array<OrderItem>, transactionTimestamp? : number) {
        let receiptStr = '',
            total = 0;

        orders.map(order => {
            const subTotal = order.amount * parseFloat(order.price),
                orderName = `${order.amount.toFixed(2)} ${order.name}`.toUpperCase(),
                subTotalStr = `${this.currency}${subTotal}`,
                orderChunks = this.chunkString(orderName, this.receiptWidth - 10 - 4); // 8 - $000000.00

            orderChunks.forEach((chunk, pos) => {
                if (pos === 0) {
                    const firstLine = `\n${chunk}${this.alignRight(subTotalStr, chunk.length)}`;
                    receiptStr += firstLine;
                    return;
                }
                receiptStr += `\n  ${chunk}`;
            });

            total += subTotal;
        });

        // line divider after all orders
        receiptStr += `\n${this.alignRight('--------')}`;

        // total value for orders
        const totalTxt = ` Total Due`,
            totalValueStr = `${this.currency}${total.toFixed(2)}`;
        receiptStr += `\n${totalTxt}${this.alignRight(totalValueStr, totalTxt.length)}`;

        // transaction recording time
        const date = new DatePipe('en-UK').transform(transactionTimestamp || new Date(Date.now()),
            'dd/MM/yyyy H:mm:ss');
        receiptStr += `\n\n  ${date}`;

        return receiptStr;
    }

    public printReceipt(orders: Array<OrderItem>, transactionTimestamp? : number) {
        const receiptBody = this.formReceiptBody(orders, transactionTimestamp);
        console.log(receiptBody);

        return this.print(`\n\n${this.alignCenter(this.receipt.header)}
        \n\n${receiptBody}
        \n\n${this.receipt.footer}
        \n\n\n\``);
    }
}