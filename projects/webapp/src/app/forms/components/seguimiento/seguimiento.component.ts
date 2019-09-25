import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sgm-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  constructor(private readonly fb: FormBuilder, private readonly db: AngularFirestore) {}

  followingForm: FormGroup;
  private validated = false;

  ngOnInit() {
    this.followingForm = this.fb.group({
      mentorName: [null, Validators.required],
      mentorUsername: [null, [Validators.required, Validators.pattern(/^[a-z0-9]*$/)]],
      studentName: [null, Validators.required],
      studentUsername: [null, [Validators.required, Validators.pattern(/^[a-z0-9]*$/)]],
      topic: [null, Validators.required],
      problems: [null, Validators.required],
      solutions: [null, Validators.required],
      follow: [null, Validators.required],
      problemType: [null, Validators.required]
    });
  }

  async submit() {
    this.validated = true;
    if (this.followingForm.invalid) {
      alert('La format tiene campos incompletos');
      return;
    }
    try {
      await this.db.collection('forms/seguimiento/responses').add(this.followingForm.value);
      alert('Todos los cambios están guardados');
    } catch (error) {
      alert('Ocurrió un erro al guardar... Vuelve a intentarlo');
    }
  }

  get isFormValid() {
    return !this.followingForm.invalid;
  }

  get isMentorNameInvalid() {
    const control = this.followingForm.controls.mentorName;
    return control.invalid && (control.touched || this.validated);
  }
  get isMentorUsernameInvalid() {
    const control = this.followingForm.controls.mentorUsername;
    return control.invalid && (control.touched || this.validated);
  }
  get isStudentNameInvalid() {
    const control = this.followingForm.controls.studentName;
    return control.invalid && (control.touched || this.validated);
  }
  get isStudentUsernameInvalid() {
    const control = this.followingForm.controls.studentUsername;
    return control.invalid && (control.touched || this.validated);
  }
  get isTopicInvalid() {
    const control = this.followingForm.controls.topic;
    return control.invalid && (control.touched || this.validated);
  }
  get isProblemsInvalid() {
    const control = this.followingForm.controls.problems;
    return control.invalid && (control.touched || this.validated);
  }
  get isSolutionsInvalid() {
    const control = this.followingForm.controls.solutions;
    return control.invalid && (control.touched || this.validated);
  }
  get isFollowInvalid() {
    const control = this.followingForm.controls.follow;
    return control.invalid && (control.touched || this.validated);
  }
  get isProblemTypeInvalid() {
    const control = this.followingForm.controls.problemType;
    return control.invalid && (control.touched || this.validated);
  }
}
