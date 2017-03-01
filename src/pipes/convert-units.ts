import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'convert-units'
})
@Injectable()
export class ConvertUnits {

  static remToPx(remValue, withoutStr) {
    const rootFont = parseFloat(getComputedStyle(document.querySelector('html')).fontSize);
    const isRem = withoutStr || remValue.search('rem') >= 0;
    return !isRem ? (!withoutStr ? parseFloat(remValue) : remValue)
        : (!withoutStr ? parseFloat(remValue) * rootFont : remValue * rootFont);
  }

}
