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

  response: any;
  formData: any;

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.formData = data.formData;
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
      studentsNames: [
        !!this.response ? this.response.studentsNames : null,
        Validators.required
      ],
      studentsUsernames: [
        !!this.response ? this.response.studentsUsernames : null,
        [Validators.required, Validators.pattern(/^(([a-z0-9],*)*$)/)]
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

    // Validate usernames and users mail
    let studentsNames = (formValue.studentsNames as string).split(',');
    let studentsUsernames = (formValue.studentsUsernames as string).split(',');
    if (studentsNames.length !== studentsUsernames.length) {
      alert(
        'Los nombres y usuarios de estudiantes de nuevo ingreso no concuerdan.'
      );
      return;
    }

    if (
      !confirm(
        `Se enviara un correo a ${formValue.studentsUsernames} para que confirme la información proveída. Desea continuar?`
      )
    ) {
      return;
    }

    // transform usernames and names
    const students = [];
    for (let i = 0; i < studentsNames.length; i++) {
      const studentName = studentsNames[i];
      const studentUsername = studentsUsernames[i];

      students.push({
        studentName,
        studentUsername,
        acceptKey: Math.random()
          .toString(36)
          .substring(7),
        rejectKey: Math.random()
          .toString(36)
          .substring(7),
        confirmationStatus: 'WAITING'
      });
    }

    try {
      await this.db.collection('forms/seguimiento/responses').add({
        ...formValue,
        confirmationStatus: 'WAITING',
        formData: this.formData,
        students
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
  get isStudentsNamesInvalid() {
    const control = this.followingForm.controls.studentsNames;
    return control.invalid && (control.touched || this.validated);
  }
  get isStudentsUsernamesInvalid() {
    const control = this.followingForm.controls.studentsUsernames;
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
