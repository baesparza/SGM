import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sgm-seguimiento-responses',
  templateUrl: './seguimiento-responses.component.html',
  styleUrls: ['./seguimiento-responses.component.css']
})
export class SeguimientoResponsesComponent implements OnInit, OnDestroy {
  constructor(private readonly db: AngularFirestore) {}

  responses: any[];
  private sub: Subscription;

  ngOnInit() {
    this.sub = this.db
      .collection('forms/seguimiento/responses', query =>
        query.orderBy('created', 'desc')
      )
      .snapshotChanges()
      .subscribe(snap => {
        this.responses = [];
        snap.forEach(data => {
          this.responses.push(
            Object.assign(data.payload.doc.data(), {
              id: data.payload.doc.id
            })
          );
        });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
