import {
  Directive,
  HostListener,
  HostBinding,
  ElementRef
} from '@angular/core';

@Directive({
// tslint:disable-next-line: directive-selector
selector: '[hoverfocus]'
})
export class HoverFocusDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focus') onFocus(): void {
    this.el.nativeElement.style.backgroundColor = '#80d4ff';
  }

  @HostListener('focusout') onFocusOut(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
