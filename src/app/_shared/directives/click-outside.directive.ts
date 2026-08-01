import { afterNextRender, DestroyRef, Directive, ElementRef, inject, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  readonly clickOutside = output<void>();

  constructor() {
    afterNextRender(() => {
      const unlisten = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        const target = event.target;

        if (target instanceof Node && !this.host.nativeElement.contains(target)) {
          this.clickOutside.emit();
        }
      });

      this.destroyRef.onDestroy(unlisten);
    });
  }
}
