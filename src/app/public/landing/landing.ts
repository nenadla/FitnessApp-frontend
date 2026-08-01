import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../_components/button/button';
import { Icon } from '../../_components/icon/icon';

@Component({
  selector: 'app-landing',
  imports: [Button, Icon],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly router = inject(Router);

  protected navigate(path: 'login' | 'register'): void {
    this.router.navigate([path]);
  }
}
