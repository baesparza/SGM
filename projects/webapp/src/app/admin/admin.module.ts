import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SeguimientoResponsesComponent } from './seguimiento-responses/seguimiento-responses.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AdminComponent, SeguimientoResponsesComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule]
})
export class AdminModule {}
