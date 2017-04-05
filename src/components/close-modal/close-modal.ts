import { Directive, HostListener } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Directive({
  selector: '[close-modal]'
})
export class CloseModal {

  @HostListener('click', ['$event'])
  public onClick(e) {
    this.viewCtrl.dismiss();
  }

  constructor(public viewCtrl: ViewController) {}

}
