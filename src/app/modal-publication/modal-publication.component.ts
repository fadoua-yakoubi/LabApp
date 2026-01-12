import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Publication } from 'src/Models/Publication';

@Component({
  selector: 'app-modal-publication',
  templateUrl: './modal-publication.component.html',
  styleUrls: ['./modal-publication.component.css']
})
export class ModalPublicationComponent implements OnInit {
  publicationForm: FormGroup;
  isEditMode = false;
  publicationTypes = [
    'Article de journal',
    'Conférence',
    'Chapitre de livre',
    'Livre',
    'Thèse',
    'Rapport technique',
    'Prépublication'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalPublicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Publication | null
  ) {
    this.publicationForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      dateApparition: ['', Validators.required],
      lien: [''],
      auteurs: ['', Validators.required],
      source: ['']
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.publicationForm.patchValue({
        ...this.data,
        dateApparition: this.data.dateApparition ? new Date(this.data.dateApparition) : null
      });
    }
  }

  save() {
    if (this.publicationForm.valid) {
      const formValue = this.publicationForm.value;
      
      // Formater la date au format backend (yyyy-MM-dd)
      if (formValue.dateApparition) {
        const date = new Date(formValue.dateApparition);
        formValue.dateApparition = date.toISOString().split('T')[0];
      }
      
      const publicationData: Publication = {
        ...formValue,
        id: this.data?.id
      };
      
      this.dialogRef.close(publicationData);
    }
  }

  close() {
    this.dialogRef.close();
  }
}