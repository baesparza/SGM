import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sgm-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly db: AngularFirestore,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  followingForm: FormGroup;
  private validated = false;

  problemTypes: string[];
  followingTypes: string[];

  response: any;

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.problemTypes = data.formData.problemTypes;
        this.followingTypes = data.formData.followingTypes;
        this.response = data.response;

        this.createForm();
      })
      .unsubscribe();
  }

  private createForm() {
    this.followingForm = this.fb.group({
      mentorName: [
        !!this.response ? this.response.mentorName : null,
        Validators.required
      ],
      mentorUsername: [
        !!this.response ? this.response.mentorUsername : null,
        [Validators.required, Validators.pattern(/^[a-z0-9]*$/)]
      ],
      studentName: [
        !!this.response ? this.response.studentName : null,
        Validators.required
      ],
      studentUsername: [
        !!this.response ? this.response.studentUsername : null,
        [Validators.required, Validators.pattern(/^[a-z0-9]*$/)]
      ],
      topic: [
        !!this.response ? this.response.topic : null,
        Validators.required
      ],
      problems: [
        !!this.response ? this.response.problems : null,
        Validators.required
      ],
      solutions: [
        !!this.response ? this.response.solutions : null,
        Validators.required
      ],
      follow: [
        !!this.response ? this.response.follow : null,
        Validators.required
      ],
      problemTypes: [
        !!this.response ? this.response.problemTypes : null,
        Validators.required
      ]
    });
  }

  async submit() {
    if (!!this.response) {
      return;
    }

    this.validated = true;
    const formValue = this.followingForm.value;

    if (this.followingForm.invalid) {
      alert('La format tiene campos incompletos');
      return;
    }

    if (
      !confirm(
        `Se enviara un correo a ${formValue.studentUsername}@utpl.edu.ec para que confirme la información proveída. Desea continuar?`
      )
    ) {
      return;
    }

    try {
      await this.db.collection('forms/seguimiento/responses').add({
        ...formValue,
        acceptKey: Math.random()
          .toString(36)
          .substring(7),
        rejectKey: Math.random()
          .toString(36)
          .substring(7),
        confirmationStatus: 'WAITING'
      });
      alert('Todos los cambios están guardados');
      this.router.navigate(['/formularios']);
    } catch (error) {
      alert('Ocurrió un erro al guardar... Vuelve a intentarlo');
    }
  }

  return() {
    if (!!this.response) {
      this.router.navigate(['/admin/seguimiento']);
    } else {
      this.router.navigate(['/formularios']);
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
  get isProblemTypesInvalid() {
    const control = this.followingForm.controls.problemTypes;
    return control.invalid && (control.touched || this.validated);
  }
  get isButtonDisabled() {
    return this.followingForm.invalid && this.validated;
  }
}
