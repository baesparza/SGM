import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

const SHARED_MODULES = [ReactiveFormsModule];
const FIREBASE_MODULES = [AngularFirestoreModule, AngularFireStorageModule];

@NgModule({
  imports: FIREBASE_MODULES,
  exports: FIREBASE_MODULES
})
class FirebaseModule {}

@NgModule({
  declarations: [],
  imports: [FirebaseModule, ...SHARED_MODULES],
  exports: [FirebaseModule, ...SHARED_MODULES]
})
export class SharedModule {}
