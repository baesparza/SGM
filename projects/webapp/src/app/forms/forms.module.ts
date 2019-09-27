import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { SharedModule } from '../shared/shared.module';
import { FormsComponent } from './components/forms/forms.component';
import { SeguimientoResolver } from './providers/seguimiento.resolver';

@NgModule({
  declarations: [SeguimientoComponent, FormsComponent],
  imports: [CommonModule, FormsRoutingModule, SharedModule],
  providers: [SeguimientoResolver]
})
export class FormsModule {}
