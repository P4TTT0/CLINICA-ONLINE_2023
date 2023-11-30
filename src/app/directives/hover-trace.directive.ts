import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverTrace]'
})
export class HoverTraceDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'position', 'fixed');
    this.renderer.setStyle(span, 'top', `${event.clientY}px`);
    this.renderer.setStyle(span, 'left', `${event.clientX}px`);
    this.renderer.setStyle(span, 'width', '5px');
    this.renderer.setStyle(span, 'height', '5px');
    this.renderer.setStyle(span, 'background', 'black');
    this.renderer.setStyle(span, 'pointer-events', 'none');
    this.renderer.setStyle(span, 'border-radius', '50%');
    this.renderer.setStyle(span, 'transition', 'transform 0.2s, opacity 0.2s');
    this.renderer.setStyle(span, 'z-index', '10000');
    this.renderer.appendChild(document.body, span);

    setTimeout(() => {
      this.renderer.setStyle(span, 'transform', 'scale(15)');
      this.renderer.setStyle(span, 'opacity', '0');
    }, 100);

    setTimeout(() => {
      this.renderer.removeChild(document.body, span);
    }, 200);
  }
}
