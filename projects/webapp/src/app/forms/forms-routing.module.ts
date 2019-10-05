import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { FormsComponent } from './components/forms/forms.component';
import { SeguimientoResolver } from './providers/seguimiento.resolver';
import { SeguimientoResponseResolver } from './components/seguimiento/seguimiento-response.resolver';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    resolve: {
      formData: SeguimientoResolver
    }
  },
  {
    path: 'seguimiento/visualizar/:id',
    component: SeguimientoComponent,
    resolve: {
      response: SeguimientoResponseResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
