
import { ChangeDetectionStrategy, Component, input, output, type OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-button-icon',
  imports: [MatRippleModule, MatTooltipModule],
  templateUrl: './button-icon.html',
  styleUrl: './button-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIcon {
  type = input('button');
  color = input<'primary' | 'transparent' | 'transparent-blue' | 'white'>('transparent');
  size = input<'small' | 'large'>('large');
  disabled = input(false);
  tooltip = input('');
  active = input(false);
  loading = input(false);
  loaderClass = input('');
  onClick = output<Event>();

  handleClick(event: Event) {
    if(this.loading()) return;
    this.onClick.emit(event);
  }

}
