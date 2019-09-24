import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { SeguimientoComponent } from './c/seguimiento/seguimiento.component';


@NgModule({
  declarations: [FormsComponent, SeguimientoComponent],
  imports: [
    CommonModule,
    FormsRoutingModule
  ]
})
export class FormsModule { }
