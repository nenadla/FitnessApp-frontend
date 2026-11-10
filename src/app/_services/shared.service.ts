import { Injectable, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Pages } from '../_shared/constants';
import { Toast } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private readonly titleService = inject(Title);

  readonly page = signal(Pages.Landing);
  readonly toast = signal<Toast>({ show: false });

  setTitle(value: string): void {
    this.titleService.setTitle(`${value} | Retro Fitness`);
  }
}
