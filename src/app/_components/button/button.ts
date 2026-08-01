
import { ChangeDetectionStrategy, Component, input, output, type OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-button',
  imports: [MatRippleModule, MatTooltipModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  type = input('button');
  color = input<'primary' | 'transparent' | 'light'>('transparent');
  tooltip = input('');
  tooltipPosition = input<'above' | 'below'>('above');
  disabled = input(false);
  loading = input(false);
  active = input(false);
  size = input<'normal' | 'small'>('normal');
  onClick = output<Event>();

  handleClick(event: Event) {
    if (this.disabled() || this.loading()) return;
    this.onClick.emit(event);
  }

}
