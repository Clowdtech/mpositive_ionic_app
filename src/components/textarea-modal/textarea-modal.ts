import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'textarea-modal',
  templateUrl: 'textarea-modal.html'
})
export class TextAreaModalComponent {

  textArea: string;
  placeholder: string;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.textArea = params.get('initValue') || '';
    this.placeholder = params.get('placeholder') || '';
  }

  save() {
    this.viewCtrl.dismiss(this.textArea);
  }

}
