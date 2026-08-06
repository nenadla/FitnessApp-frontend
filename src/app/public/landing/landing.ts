import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../_components/button/button';
import { Icon } from '../../_components/icon/icon';
import { handle } from '../../_shared/http-handler';
import { Pages, Titles } from '../../_shared/constants';
import { LandingPackageResponse, PurchaseType } from '../../_shared/types';
import { SharedService } from '../../_services/shared.service';
import { BalancesService } from '../../_services/balances.service';

@Component({
  selector: 'app-landing',
  imports: [Button, Icon],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly balancesService = inject(BalancesService);
  private readonly sharedService = inject(SharedService);

  protected readonly PurchaseType = PurchaseType;
  protected readonly packages = signal<LandingPackageResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly expandedPackage = signal<PurchaseType | null>(null);

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Landing);
    this.sharedService.page.set(Pages.Landing);
    this.loadPackages();
  }

  protected navigate(path: 'login' | 'register'): void {
    this.router.navigate([path]);
  }

  protected togglePackageDetails(packageType: PurchaseType): void {
    this.expandedPackage.update((value) => (value === packageType ? null : packageType));
  }

  private loadPackages(): void {
    this.balancesService
      .getLandingPackages()
      .pipe(handle((response) => this.packages.set(response.data), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }
}
