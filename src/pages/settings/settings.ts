import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService, Utils, Bluetooth } from "../../services/";
import { Platform, ModalController } from 'ionic-angular';
import { StarPrinterService } from "../../services/starPrinter.service";
import { TextAreaModalComponent } from "../../components/textarea-modal/textarea-modal";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings implements OnDestroy, OnInit {

  private userData: {} = {};
  private printers: any = [];
  private preferredPrinter: any;

  private BTEnabled: boolean;
  private BTListener;

  private receipt: { header: string, footer: string };

  constructor(private userService: UserService, private utils: Utils, private bluetooth: Bluetooth,
    private platform: Platform, private printerService: StarPrinterService, private ref: ChangeDetectorRef,
    private modalCtrl: ModalController) {}

  ngOnInit() {
      this.preferredPrinter = this.printerService.prefPrinter;
      this.receipt = this.printerService.receipt;

      this.bluetooth.getState().then(state => {
          this.BTEnabled = this.bluetooth.isEnabled;
          if (this.BTEnabled) this.findPrinters();
      });

      this.BTListener = this.bluetooth.stateChanged.subscribe(() => {
          console.log('BT stateChanged');
          this.BTEnabled = this.bluetooth.isEnabled;
          this.ref.reattach();
          this.ref.detectChanges();
      });
  }

  findPrinters() {
      this.platform.ready().then(() => {
      this.printerService.findPrinters().then(printers => {
          this.printers = printers;
          this.ref.reattach();
          this.ref.detectChanges();
      });
    },  error => {
        this.printers = [];
        console.log(error);
    });
  }

  printerSelect() {
      this.printerService.prefPrinter = this.preferredPrinter;
  }

  /**
   * Make reset password call
   */
  resetPassword() {
      this.userService.resetPassword().then(() => {
          this.utils.showToast('Link to reset your password was send to your email')
      }, error => {
          this.utils.showToast(error)
      });
  }

  openTextModal(params) {
      let textModal = this.modalCtrl.create(TextAreaModalComponent, params);
      textModal.present();
      return textModal;
  }

  /**
   * Open modal to edit header receipt text
  */
  changeHeader() {
      this.openTextModal({
          placeholder: 'Enter Header information here...',
          initValue: this.receipt.header
      })
      .onDidDismiss(value => {
          if (value) {
              this.receipt.header = value;
              this.printerService.receipt = this.receipt;
          }
      });
  }

  /**
   * Open modal to edit footer receipt text
   */
  changeFooter() {
      this.openTextModal({
          placeholder: 'Enter Footer information here...',
          initValue: this.receipt.footer
      })
      .onDidDismiss(value => {
          if (value) {
              this.receipt.footer = value;
              this.printerService.receipt = this.receipt;
          }
      });
  }


  /**
   * Load view when user related data is received
   */
  ionViewCanEnter() {
    return this.userService.getUser()
        .then(data => this.userData = data)
        .catch(error => console.log(error));
  }

  ngOnDestroy(): void {
    if (!!this.BTListener) this.BTListener.unsubscribe();
  }
}
