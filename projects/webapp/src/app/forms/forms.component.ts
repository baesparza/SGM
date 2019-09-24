import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sgm-forms',
  template: `
    <p>forms works!</p>
    <a class="btn btn-primary" [routerLink]="['/formularios/seguimiento']">Primary</a>
  `
})
export class FormsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
