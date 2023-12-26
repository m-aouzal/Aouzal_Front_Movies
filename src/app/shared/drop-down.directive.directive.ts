import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appdropdown]',
    standalone: true
})
export class DropDownDirectiveDirective {
  @HostBinding('class.show') isOpen = false; // Use 'show' class instead of 'open'
  
  @HostListener('document:click', ['$event'])
  toggleOpen(event: Event) {
    console.log("toggleOpen")
    // Check if the click is inside the element
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elRef: ElementRef) {}
}
