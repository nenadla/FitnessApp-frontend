import { ChangeDetectionStrategy, Component, input, OnInit, signal} from '@angular/core';


@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `
    @for (item of items(); track $index) {
      <div [class]="'animate-pulse rounded-xl bg-border ' + itemClass() + ' ' + (card() ? 'flex gap-4 p-4 items-center' : '')">
        @if(card() === 'recipient'){
          <div class="size-5 bg-light rounded-lg"></div>
          <div class="bg-light h-10 w-44 rounded-lg"></div>
          <div class="ml-auto bg-light h-5 w-32 rounded-lg"></div>
          <div class=" bg-light h-10 w-14 rounded-lg"></div>
        }
        @else if(card() === 'request'){
          <div class="bg-light h-10 w-44 rounded-lg"></div>
          <div class="ml-auto bg-light h-10 w-44 rounded-lg"></div>
          <div class=" bg-light h-10 w-14 rounded-lg"></div>
        }
        @else if(card() === 'table'){
          <div class="bg-light h-6 w-44 rounded-lg"></div>
          <div class="mx-auto bg-light h-6 w-44 rounded-lg"></div>
          <div class=" bg-light h-6 w-14 rounded-lg"></div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton implements OnInit{

  number = input.required<number>();
  itemClass = input.required<string>();
  card = input('');
  items = signal<number[]>([]);

  ngOnInit(): void {
    this.items.set(Array.from({ length: this.number() }, (_, index) => index));
  }
}
