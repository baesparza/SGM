import { Component } from '@angular/core';

@Component({
  selector: 'sgm-root',
  template: `
    <router-outlet #mainOutlet="outlet"></router-outlet>
    <div *ngIf="!mainOutlet.isActivated">
      <h1>👋</h1>
      <p>No deberías estar aquí</p>
      <small>No has seccionado ninguna acción</small>
    </div>
  `,
  styles: [
    `
      div {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class AppComponent {}
