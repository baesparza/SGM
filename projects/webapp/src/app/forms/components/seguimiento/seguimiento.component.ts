import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sgm-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  constructor(private readonly fb: FormBuilder) {}

  followingForm: FormGroup;

  ngOnInit() {
    this.followingForm = this.fb.group({
      mentorName: ['val1', Validators.required],
      mentorUsername: ['val2', Validators.required],
      studentName: ['val3', Validators.required],
      studentUsername: ['val4', Validators.required],
      topic: ['val5', Validators.required],
      problems: ['val6', Validators.required],
      solutions: ['val7', Validators.required],
      follow: ['reunion', Validators.required],
      problemType: ['academicos', Validators.required]
    });
  }

  submit() {
    console.log(this.followingForm.value);
  }
}
