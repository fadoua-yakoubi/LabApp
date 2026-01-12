import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/Models/Member';
import { MemberService } from 'src/Services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  
  myForm!: FormGroup;
  idCourant: string = "";
  
  constructor(
    private MS: MemberService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idCourant = this.activatedRoute.snapshot.params['id'];
    
    // TOUJOURS initialiser le formulaire d'abord
    this.initForm();
    
    if (this.idCourant) {
      // Mode édition - charger les données
      this.loadMemberData();
    }
  }

  // Méthode pour initialiser le formulaire
  private initForm(): void {
    this.myForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      cin: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cv: new FormControl(''),
      password: new FormControl('', [Validators.required]),
      photo: new FormControl(''),
      date: new FormControl(new Date()),
      // Champs étudiant
      diplome: new FormControl(''),
      dateInscription: new FormControl(''),
      // Champs enseignant
      grade: new FormControl(''),
      etablissement: new FormControl('')
    });
  }

  // Méthode pour charger les données du membre en édition
  private loadMemberData(): void {
    this.MS.getMemberById(this.idCourant).subscribe({
      next: (m: any) => {
        console.log('Données du membre chargées:', m);
        
        // Déterminer le type
        const type = m.grade ? 'ens' : 'etd';
        
        // Utiliser patchValue pour remplir le formulaire
        this.myForm.patchValue({
          type: type,
          cin: m.cin,
          nom: m.nom,
          prenom: m.prenom,
          email: m.email,
          cv: m.cv,
          password: m.password,
          photo: m.photo,
          date: m.date,
          diplome: m.diplome,
          dateInscription: m.dateInscription,
          grade: m.grade,
          etablissement: m.etablissement
        });
        
        // Désactiver le champ password en mode édition (optionnel)
        this.myForm.get('password')?.clearValidators();
        this.myForm.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du membre:', err);
      }
    });
  }

  onTypeChange() {
    const type = this.myForm.get('type')?.value;
    
    if (type === 'etd') {
      // Rendre obligatoires les champs étudiant
      this.myForm.get('diplome')?.setValidators([Validators.required]);
      this.myForm.get('grade')?.clearValidators();
      this.myForm.get('etablissement')?.clearValidators();
    } else if (type === 'ens') {
      // Rendre obligatoires les champs enseignant
      this.myForm.get('grade')?.setValidators([Validators.required]);
      this.myForm.get('etablissement')?.setValidators([Validators.required]);
      this.myForm.get('diplome')?.clearValidators();
    }
    
    this.myForm.get('diplome')?.updateValueAndValidity();
    this.myForm.get('grade')?.updateValueAndValidity();
    this.myForm.get('etablissement')?.updateValueAndValidity();
  }

  onSubmit() {
    console.log(this.myForm.value);
    
    const type = this.myForm.get('type')?.value;
    
    // Préparer les données à envoyer
    const memberData: any = {
      type: type,
      cin: this.myForm.get('cin')?.value,
      nom: this.myForm.get('nom')?.value,
      prenom: this.myForm.get('prenom')?.value,
      email: this.myForm.get('email')?.value,
      cv: this.myForm.get('cv')?.value,
      date: this.myForm.get('date')?.value
    };
    
    // Ajouter le password seulement s'il est renseigné (pour éviter d'écraser en mode édition)
    const password = this.myForm.get('password')?.value;
    if (password && password.trim() !== '') {
      memberData.password = password;
    }
    
    // N'ajouter photo que si elle n'est pas vide
    const photo = this.myForm.get('photo')?.value;
    if (photo && photo.trim() !== '') {
      memberData.photo = photo;
    }
    
    // Ajouter les champs spécifiques selon le type
    if (type === 'etd') {
      memberData.diplome = this.myForm.get('diplome')?.value;
      memberData.dateInscription = this.myForm.get('dateInscription')?.value;
    } else if (type === 'ens') {
      memberData.grade = this.myForm.get('grade')?.value;
      memberData.etablissement = this.myForm.get('etablissement')?.value;
    }
    
    console.log('Données à envoyer:', memberData);
    
    if (this.idCourant) {
      // Mode édition - Update
      this.MS.updateMember(this.idCourant, memberData).subscribe({
        next: () => {
          console.log('Membre mis à jour avec succès');
          this.router.navigate(['/members']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          console.error('Détails:', err.error);
        }
      });
    } else {
      // Mode création - Add
      this.MS.addMember(memberData).subscribe({
        next: (response) => {
          console.log('Membre créé avec succès:', response);
          this.router.navigate(['/members']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          console.error('Détails:', err.error);
        }
      });
    }
  }
}