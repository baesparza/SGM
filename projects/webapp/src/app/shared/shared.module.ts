import { NgModule } from '@angular/core';

const FIREBASE_MODULES = [];
@NgModule({
  imports: FIREBASE_MODULES,
  exports: FIREBASE_MODULES
})
class FirebaseModule {}

@NgModule({
  declarations: [],
  imports: [FirebaseModule],
  exports: [FirebaseModule]
})
export class SharedModule {}
