import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeguimientoResolver implements Resolve<object> {
  constructor(private readonly db: AngularFirestore) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.db
      .collection('forms')
      .doc('seguimiento')
      .get()
      .pipe(map(doc => doc.data()));
  }
}
