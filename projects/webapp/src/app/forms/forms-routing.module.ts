import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { FormsComponent } from './components/forms/forms.component';
import { SeguimientoResolver } from './providers/seguimiento.resolver';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    resolve: {
      seguimientoResolver: SeguimientoResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
