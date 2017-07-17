import { Directive, ElementRef, Input } from '@angular/core';
import { ConvertUnits } from "../../pipes";

@Directive({
  selector: '[scroll-height]' // Attribute selector
})
export class ScrollHeight{

  @Input() set calcHeight (dependentElementsIds : Array<string>) {
    this.setHeight(dependentElementsIds);
  }

  constructor(private el: ElementRef) {
  }

  private setHeight(dependentElementsIds : Array<string>) {
      setTimeout(() => {
          let calcH = window.innerHeight - this.el.nativeElement.offsetTop;
          if (dependentElementsIds && dependentElementsIds.length > 0) {
              /* ionic directives are not compiled yet */
              dependentElementsIds.forEach((id) => {
                  const depEl = document.getElementById(id);
                  if (depEl) {
                      const styles = getComputedStyle(depEl);
                      let elHeight: any = depEl.style.height || styles.height;
                      elHeight = elHeight ?  ConvertUnits.remToPx(elHeight, false) : depEl.clientHeight;
                      calcH -= (elHeight + ConvertUnits.remToPx(styles.marginTop, false)
                          + ConvertUnits.remToPx(styles.marginBottom, false)) ;
                  }
              });
          }
          this.el.nativeElement.style.height = `${calcH}px`;
      }, 0);
  }
}
