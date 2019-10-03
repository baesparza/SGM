import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class SeguimientoResponseResolver implements Resolve<any> {
  constructor(
    private readonly db: AngularFirestore,
    private readonly router: Router
  ) {}

  async resolve(route: ActivatedRouteSnapshot) {
    try {
      const res = await this.db
        .collection('forms/seguimiento/responses/')
        .doc(route.params.id)
        .get()
        .toPromise();

      if (res.exists) {
        return Object.assign(res.data(), { id: res.id });
      }
      throw new Error('La respuesta al formulario no existe.');
    } catch (error) {
      alert(error.message);
      this.router.navigate(['/admin/seguimiento']);
      return null;
    }
  }
}
