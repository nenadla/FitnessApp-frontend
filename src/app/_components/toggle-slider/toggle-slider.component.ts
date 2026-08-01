
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-toggle-slider',
    templateUrl: './toggle-slider.component.html',
    styleUrls: ['./toggle-slider.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class ToggleSliderComponent{
  isToggled = input.required();
}
