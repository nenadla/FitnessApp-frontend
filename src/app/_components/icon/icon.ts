import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-icon',
  imports: [MatTooltipModule],
  templateUrl: './icon.html',
  styles: `
    :host {
      display: inline-block; 
    }
    svg {
      display: block; 
      max-width: 100%; 
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {

  tooltip = input<string>('');
  icon = input<string>('');

}
