import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'projects/webapp/src/environments/environment';

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
    private readonly route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  followingForm: FormGroup;
  filesNames: string;
  private validated = false;

  response: any;

  /**
   * Data of form to render period, cicle, modality, selectable followings or found problems.
   * Used to render HTML View
   */
  formData: any;

  uploadFiles: FileList;

  ngOnInit() {
    const { data } = this.route.snapshot;

    this.response = data.response || null;
    this.formData = !!this.response ? this.response.formData : data.formData;
    this.createForm();
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
      ],
      assets: [!!this.response ? this.response.assets : null]
    });
  }

  async submit() {
    if (!!this.response) {
      return;
    }

    this.validated = true;
    const formValue = this.followingForm.value;

    if (this.followingForm.invalid) {
      alert('La forma tiene campos incompletos');
      return;
    }

    // --------------------------------
    // Validate usernames and users mail
    // --------------------------------
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

    // --------------------------------
    // transform usernames and names
    // --------------------------------
    const students = [];
    for (let i = 0; i < studentsNames.length; i++) {
      const studentName = studentsNames[i].trim();
      const studentUsername = studentsUsernames[i].trim();

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
      // --------------------------------
      // upload files
      // --------------------------------
      const downloadURLS = [];
      const date = Date.now();
      if (!!this.uploadFiles) {
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const file = this.uploadFiles[i];
          const uploadPath = `seguimiento/assets/${date}/${file.name}`;

          const uploadTask = await this.storage
            .upload(uploadPath, file)
            .snapshotChanges()
            .toPromise();

          downloadURLS.push(uploadTask.ref.getDownloadURL());
        }
      }

      // --------------------------------
      // save on db
      // --------------------------------
      await this.db.collection('forms/seguimiento/responses').add({
        ...formValue,
        formData: this.formData,
        students,
        assets: await Promise.all(downloadURLS),
        created: new Date()
      });
      alert('Todos los cambios están guardados');
      this.router.navigate(['/formularios']);
    } catch (error) {
      console.log(error);

      alert('Ocurrió un erro al guardar... Vuelve a intentarlo');
    }
  }

  onFileChange(event) {
    this.uploadFiles = event.target.files;
    const files: File[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.uploadFiles.length; i++) {
      files.push(this.uploadFiles[i]);
    }

    const fileNames: string = files.map(f => f.name).join('; ');
    this.followingForm.controls.assets.setValue(fileNames);
  }

  return() {
    if (!!this.response) {
      this.router.navigate(['/admin/seguimiento']);
    } else {
      this.router.navigate(['/formularios']);
    }
  }

  get showTestingMessage() {
    return !environment.production;
  }

  get filenameValue() {
    return this.followingForm.controls.assets.value;
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
