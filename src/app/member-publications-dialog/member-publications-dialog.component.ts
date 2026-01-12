import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberService } from 'src/Services/member.service';
import { PublicationService } from 'src/Services/publication.service';
import { forkJoin } from 'rxjs';

export interface MemberPublicationsDialogData {
  memberId: number;
  memberName: string;
}

@Component({
  selector: 'app-member-publications-dialog',
  templateUrl: './member-publications-dialog.component.html',
  styleUrls: ['./member-publications-dialog.component.css']
})
export class MemberPublicationsDialogComponent implements OnInit {
  memberPublications: any[] = [];
  allPublications: any[] = [];
  filteredPublications: any[] = [];
  searchTerm: string = '';
  
  isLoadingMemberPubs = true;
  isLoadingAllPubs = true;

  get memberName(): string {
    return this.data.memberName;
  }

  constructor(
    public dialogRef: MatDialogRef<MemberPublicationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberPublicationsDialogData,
    private memberService: MemberService,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMemberPublications();
    this.loadAllPublications();
  }

  loadMemberPublications(): void {
    this.isLoadingMemberPubs = true;
    this.memberService.getPublicationsByAuteur(this.data.memberId.toString()).subscribe({
      next: (pubs) => {
        console.log('✅ Publications du membre:', pubs);
        this.memberPublications = pubs;
        this.isLoadingMemberPubs = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement publications du membre:', err);
        this.memberPublications = [];
        this.isLoadingMemberPubs = false;
      }
    });
  }

  loadAllPublications(): void {
    this.isLoadingAllPubs = true;
    this.publicationService.getAllPublications().subscribe({
      next: (pubs) => {
        console.log('✅ Toutes les publications:', pubs);
        this.allPublications = pubs;
        this.filterPublications();
        this.isLoadingAllPubs = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement publications:', err);
        this.allPublications = [];
        this.filteredPublications = [];
        this.isLoadingAllPubs = false;
      }
    });
  }

  filterPublications(): void {
    // Exclure les publications déjà attribuées
    const memberPubIds = this.memberPublications.map(p => p.id);
    
    let filtered = this.allPublications.filter(pub => 
      !memberPubIds.includes(pub.id)
    );

    // Filtrer par terme de recherche
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.titre.toLowerCase().includes(term) ||
        (pub.auteurs && pub.auteurs.toLowerCase().includes(term)) ||
        (pub.type && pub.type.toLowerCase().includes(term))
      );
    }

    this.filteredPublications = filtered;
  }

  addPublication(publicationId: number): void {
    console.log(`➕ Ajout publication ${publicationId} au membre ${this.data.memberId}`);
    
    this.memberService.affecterPublication(this.data.memberId, publicationId).subscribe({
      next: (response) => {
        console.log('✅ Publication ajoutée:', response);
        this.showMessage('Publication ajoutée avec succès');
        
        // Recharger les listes
        this.loadMemberPublications();
        
        // Mettre à jour les publications disponibles
        setTimeout(() => this.filterPublications(), 500);
      },
      error: (err) => {
        console.error('❌ Erreur ajout publication:', err);
        this.showMessage('Erreur lors de l\'ajout de la publication');
      }
    });
  }

  removePublication(publicationId: number): void {
    // Note: Vous devrez créer un endpoint dans le backend pour retirer une publication
    // Pour l'instant, on affiche juste un message
    const confirmRemove = confirm('Voulez-vous vraiment retirer cette publication ?');
    
    if (confirmRemove) {
      // TODO: Implémenter la suppression dans le backend
      this.showMessage('Fonctionnalité de suppression à implémenter dans le backend');
      console.log(`🗑️ Retrait publication ${publicationId} du membre ${this.data.memberId}`);
      
      // Pour le moment, on recharge juste
      // this.loadMemberPublications();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}