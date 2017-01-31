import { Component } from '@angular/core';

/*
  Generated class for the VerticalMenu component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'vertical-menu',
  templateUrl: 'vertical-menu.html'
})
export class VerticalMenuComponent {

  text: string;

  constructor() {
    console.log('Hello VerticalMenu Component');
    this.text = 'Hello World';
  }

}
