import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'seguimiento',
    pathMatch: 'full'
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
