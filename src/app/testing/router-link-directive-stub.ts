import { Directive, Input, HostListener } from '@angular/core';


// tslint:disable: directive-class-suffix directive-selector
@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}

// @Directive({
//   selector: '[routerLink]',
//   host: { '(click)': 'onClick()' }
// })
// // tslint:disable-next-line: directive-class-suffix
// export class RouterLinkDirectiveStub {
//   @Input('routerLink') linkParams: any;
//   navigatedTo: any = null;

//   onClick(): void {
//     this.navigatedTo = this.linkParams;
//   }
// }
