import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverHighlight]'
})
export class HoverHighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('#474448');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight("#fff");
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
  }
}