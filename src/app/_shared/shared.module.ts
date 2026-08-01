import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import {FormField} from '@angular/forms/signals';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FormField,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
    FormField,
  ],
})
export class SharedModule { }
