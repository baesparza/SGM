import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './forms.component';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent
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
