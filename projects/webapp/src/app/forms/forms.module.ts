import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SeguimientoComponent],
  imports: [CommonModule, FormsRoutingModule, SharedModule]
})
export class FormsModule {}
