import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MemberService } from 'src/Services/member.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MemberPublicationsDialogComponent } from '../member-publications-dialog/member-publications-dialog.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  // Onglet actif
  activeTab: 'etudiants' | 'enseignants' = 'etudiants';

  // Données
  etudiants: any[] = [];
  enseignants: any[] = [];
  filteredEtudiants: any[] = [];
  filteredEnseignants: any[] = [];
  
  // Recherche
  searchTerm: string = '';

  // Colonnes des tableaux
  etudiantColumns: string[] = ['selection', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
enseignantColumns: string[] = ['selection', '1', '2', '3', '4', '5', '6', '7', '8'];

  // Modal d'affectation
  selectedEtudiant: any = null;
  selectedEncadrant: number = 0;

  // Pour la suppression multiple
  selectedMembers: Set<number> = new Set();

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEtudiants();
    this.loadEnseignants();
  }

  // Changer d'onglet
  switchTab(tab: 'etudiants' | 'enseignants'): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.selectedMembers.clear();
    if (tab === 'etudiants') {
      this.filteredEtudiants = this.etudiants;
    } else {
      this.filteredEnseignants = this.enseignants;
    }
  }

  // Charger les étudiants
  loadEtudiants(): void {
    this.memberService.getAllEtudiants().subscribe({
      next: (data) => {
        this.etudiants = data.map(etd => ({
          ...etd,
          type: 'etd'
        }));
        this.filteredEtudiants = this.etudiants;
        console.log('Étudiants chargés:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des étudiants:', err);
      }
    });
  }

  // Charger les enseignants
  loadEnseignants(): void {
    this.memberService.getAllEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data.map(ens => ({
          ...ens,
          type: 'ens'
        }));
        this.filteredEnseignants = this.enseignants;
        console.log('Enseignants chargés:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des enseignants:', err);
      }
    });
  }

  // Filtrer selon l'onglet actif
  filter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      if (this.activeTab === 'etudiants') {
        this.filteredEtudiants = this.etudiants;
      } else {
        this.filteredEnseignants = this.enseignants;
      }
      return;
    }

    const term = this.searchTerm.toLowerCase();

    if (this.activeTab === 'etudiants') {
      this.filteredEtudiants = this.etudiants.filter(etd =>
        etd.nom.toLowerCase().includes(term) ||
        etd.prenom.toLowerCase().includes(term) ||
        etd.cin.toLowerCase().includes(term) ||
        etd.email.toLowerCase().includes(term) ||
        (etd.diplome && etd.diplome.toLowerCase().includes(term))
      );
    } else {
      this.filteredEnseignants = this.enseignants.filter(ens =>
        ens.nom.toLowerCase().includes(term) ||
        ens.prenom.toLowerCase().includes(term) ||
        ens.cin.toLowerCase().includes(term) ||
        ens.email.toLowerCase().includes(term) ||
        (ens.grade && ens.grade.toLowerCase().includes(term)) ||
        (ens.etablissement && ens.etablissement.toLowerCase().includes(term))
      );
    }
  }

  // Sélectionner/déselectionner un membre
  toggleMemberSelection(id: number): void {
    if (this.selectedMembers.has(id)) {
      this.selectedMembers.delete(id);
    } else {
      this.selectedMembers.add(id);
    }
  }

  // Vérifier si un membre est sélectionné
  isMemberSelected(id: number): boolean {
    return this.selectedMembers.has(id);
  }

  // Supprimer un membre individuel
  delete(id: number): void {
    const element = this.activeTab === 'etudiants' 
      ? this.etudiants.find(e => e.id === id)
      : this.enseignants.find(e => e.id === id);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        elements: element ? [element] : [],
        title: 'Supprimer cet élément ?',
        message: `Êtes-vous sûr de vouloir supprimer ${element?.prenom || ''} ${element?.nom || ''} ? Cette action est irréversible.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.deleteMember(id.toString()).subscribe({
          next: () => {
            console.log('Membre supprimé avec succès');
            if (this.activeTab === 'etudiants') {
              this.loadEtudiants();
            } else {
              this.loadEnseignants();
            }
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
          }
        });
      }
    });
  }

  // Supprimer plusieurs membres sélectionnés
  deleteSelected(): void {
    const currentElements = this.activeTab === 'etudiants' 
      ? this.etudiants.filter(e => this.selectedMembers.has(e.id))
      : this.enseignants.filter(e => this.selectedMembers.has(e.id));

    if (currentElements.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '800px',
      data: {
        elements: currentElements,
        title: currentElements.length === 1 
          ? 'Supprimer cet élément ?' 
          : `Supprimer ${currentElements.length} éléments ?`,
        message: currentElements.length === 1
          ? `Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`
          : `Cette action supprimera définitivement ${currentElements.length} éléments. Cette action est irréversible.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deletePromises = Array.from(this.selectedMembers).map(id => 
          this.memberService.deleteMember(id.toString()).toPromise()
        );

        Promise.all(deletePromises).then(() => {
          console.log(`${currentElements.length} membres supprimés avec succès`);
          this.selectedMembers.clear();
          if (this.activeTab === 'etudiants') {
            this.loadEtudiants();
          } else {
            this.loadEnseignants();
          }
        }).catch(err => {
          console.error('Erreur lors de la suppression:', err);
        });
      }
    });
  }

  // Supprimer tous les membres de l'onglet actif
  deleteAll(): void {
    const currentElements = this.activeTab === 'etudiants' 
      ? this.etudiants 
      : this.enseignants;

    if (currentElements.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '900px',
      data: {
        elements: currentElements,
        title: `Supprimer tous les ${this.activeTab === 'etudiants' ? 'étudiants' : 'enseignants'} ?`,
        message: `Cette action supprimera définitivement tous les ${this.activeTab === 'etudiants' ? 'étudiants' : 'enseignants'} (${currentElements.length}). Cette action est irréversible.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deletePromises = currentElements.map(member => 
          this.memberService.deleteMember(member.id.toString()).toPromise()
        );

        Promise.all(deletePromises).then(() => {
          console.log(`Tous les ${currentElements.length} membres supprimés avec succès`);
          if (this.activeTab === 'etudiants') {
            this.loadEtudiants();
          } else {
            this.loadEnseignants();
          }
        }).catch(err => {
          console.error('Erreur lors de la suppression:', err);
        });
      }
    });
  }

  // Sélectionner tous les membres visibles
  selectAllVisible(): void {
    const visibleElements = this.activeTab === 'etudiants' 
      ? this.filteredEtudiants 
      : this.filteredEnseignants;
    
    visibleElements.forEach(element => {
      this.selectedMembers.add(element.id);
    });
  }

  // Désélectionner tous les membres
  deselectAll(): void {
    this.selectedMembers.clear();
  }

  // Ouvrir le modal d'affectation
  openAffectationDialog(etudiant: any): void {
    this.selectedEtudiant = etudiant;
    this.selectedEncadrant = etudiant.encadrant ? etudiant.encadrant.id : 0;
  }

  // Affecter un encadrant
  affecterEncadrant(): void {
    if (this.selectedEtudiant && this.selectedEncadrant) {
      this.memberService.affecterEtudiantEnseignant(
        this.selectedEtudiant.id,
        this.selectedEncadrant
      ).subscribe({
        next: () => {
          console.log('Encadrant affecté avec succès');
          this.selectedEtudiant = null;
          this.selectedEncadrant = 0;
          this.loadEtudiants();
        },
        error: (err) => {
          console.error('Erreur lors de l\'affectation:', err);
        }
      });
    }
  }

  // Annuler l'affectation
  cancelAffectation(): void {
    this.selectedEtudiant = null;
    this.selectedEncadrant = 0;
  }

  // Obtenir le nombre de membres sélectionnés
  get selectedCount(): number {
    return this.selectedMembers.size;
  }
  openPublicationsDialog(member: any): void {
  const dialogRef = this.dialog.open(MemberPublicationsDialogComponent, {
    width: '900px',
    maxHeight: '90vh',
    data: {
      memberId: member.id,
      memberName: `${member.prenom} ${member.nom}`
    }
  });

  dialogRef.afterClosed().subscribe(() => {
    // Optionnel: recharger les données si nécessaire
    console.log('Dialog fermé');
  });
}
}