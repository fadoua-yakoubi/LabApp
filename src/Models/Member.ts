import { Publication } from "./Publication";

export interface Member {
  id?: number;
  cin: string;
  nom: string;
  prenom: string;
  date?: Date;
  photo?: string;
  cv?: string;
  email: string;
  password?: string;
  pubs?: Publication[];
  type?: string; 
}

export interface Etudiant extends Member {
  type: 'etd';
  dateInscription?: Date;
  diplome: string;
  encadrant?: EnseignantChercheur;
}

export interface EnseignantChercheur extends Member {
  type: 'ens';
  grade: string;
  etablissement: string;
}