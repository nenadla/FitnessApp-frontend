import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal(false);
  showLoader = signal(false);
  showOverlayLoader = signal(false);
  progressValue = signal<number>(0);
  totalRequests = signal<number>(0);
  private timer: any = null; 

  setLoading(data: boolean) {
    setTimeout(() => {
      if(data){
        if(this.loading()) return;
        this.progressValue.set(0);
        this.simulateLoading();
        this.loading.set(data);
      }
      else{
        this.stopSimulateLoading();
        this.progressValue.set(100);
        setTimeout(() => this.loading.set(data), 400);
      }
    }, 0);
  }

  private simulateLoading() {
    let x = 10;
    let T = -0.003;
    this.timer = setInterval(() => {
      const progress = Math.min(100, 100 * (1 - Math.exp(T * x)));
      this.progressValue.set(progress);
      if (this.progressValue() >= 99.99) this.stopSimulateLoading();
      if (this.progressValue() >= 70) T = -0.001;
      x++;
    }, 3);
  }
  private stopSimulateLoading() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
