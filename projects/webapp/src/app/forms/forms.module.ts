import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { SharedModule } from '../shared/shared.module';
import { FormsComponent } from './components/forms/forms.component';

@NgModule({
  declarations: [SeguimientoComponent, FormsComponent],
  imports: [CommonModule, FormsRoutingModule, SharedModule]
})
export class FormsModule {}
