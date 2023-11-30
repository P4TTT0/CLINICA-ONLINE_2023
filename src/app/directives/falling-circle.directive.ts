import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFallingCircle]'
})
export class FallingCircleDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const circle = this.renderer.createElement('span');
    this.renderer.setStyle(circle, 'position', 'absolute');
    this.renderer.setStyle(circle, 'width', '50px');
    this.renderer.setStyle(circle, 'height', '50px');
    this.renderer.setStyle(circle, 'borderRadius', '50%');
    this.renderer.setStyle(circle, 'background', '#47444810');
    this.renderer.setStyle(circle, 'left', `${event.clientX}px`);
    this.renderer.setStyle(circle, 'top', `${event.clientY}px`);
    this.renderer.appendChild(this.el.nativeElement, circle);


    setTimeout(() => {
      this.renderer.removeChild(this.el.nativeElement, circle);
    }, 2000);
  }
}
