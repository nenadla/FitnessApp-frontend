
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-toggle-slider',
    templateUrl: './toggle-slider.component.html',
    styleUrls: ['./toggle-slider.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ToggleSliderComponent{
  isToggled = input.required<boolean>();
  disabled = input(true);
  label = input('');
  onChange = output<boolean>();
}
