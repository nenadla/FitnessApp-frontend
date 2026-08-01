import { Directive, ElementRef, HostListener, inject, input, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {

  disabled = input(false);
  onChange = output<boolean>();

  private isOpen = false;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('click') toggleOpen() {
    if(!this.disabled()){
      this.isOpen = !this.isOpen;
      const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
      if (this.isOpen) {
        this.renderer.setStyle(dropdown, 'display', 'flex');
        this.adjustDropdownPosition(dropdown);
      } else {
        this.el.nativeElement.classList.remove('dropdown-open');
        this.renderer.setStyle(dropdown, 'display', 'none');
        dropdown.classList.remove('dropdown-menu-up', 'dropdown-menu-left');
      }
      this.onChange.emit(this.isOpen);
    }
    
  }

  @HostListener('document:click', ['$event.target']) close(targetElement: any) {
    if(!this.disabled()){
      const clickedInside = this.el.nativeElement.contains(targetElement);
      if (!clickedInside && this.isOpen) {
        this.isOpen = false;
        this.el.nativeElement.classList.remove('dropdown-open');
        const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
        this.renderer.setStyle(dropdown, 'display', 'none');
        dropdown.classList.remove('dropdown-menu-up', 'dropdown-menu-left');
        this.onChange.emit(this.isOpen);
      }
    }
  }

  private adjustDropdownPosition(dropdown: HTMLElement) {
    const dropdownRect = dropdown.getBoundingClientRect();
    const buttonRect = this.el.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceLeft = buttonRect.left;
    const dropdownHeight = dropdownRect.height;
    const dropdownWidth = dropdownRect.width;

    if (spaceBelow < dropdownHeight) {
      dropdown.classList.add('dropdown-menu-up');
    }
    if (spaceLeft < dropdownWidth) {
      dropdown.classList.add('dropdown-menu-left');
    }
  }

}
