import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Member } from 'src/Models/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  
  private readonly GATEWAY_URL = environment.apiUrl;
  private readonly MEMBER_API = `${this.GATEWAY_URL}/MEMBER-SERVICE/members`

  constructor(private httpClient: HttpClient) { }

  // CRUD sur les membres
  GetAllMembers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/all`);
  }

  addMember(m: Member): Observable<Member> {
    return this.httpClient.post<Member>(this.MEMBER_API, m);
  }

  deleteMember(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.MEMBER_API}/${id}`);
  }

  getMemberById(id: string): Observable<Member> {
    return this.httpClient.get<Member>(`${this.MEMBER_API}/${id}`);
  }

  updateMember(id: string, m: Member): Observable<Member> {
    return this.httpClient.put<Member>(`${this.MEMBER_API}/${id}`, m);
  }

  // Méthodes spécifiques pour Étudiants
  getAllEtudiants(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/etudiants`);
  }

  getEtudiantById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.MEMBER_API}/etudiants/${id}`);
  }

  findByDiplome(diplome: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/etudiants/diplome/${diplome}`);
  }

  chercherEtudiants(nom: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/etudiants/search?nom=${nom}`);
  }

  // Méthodes spécifiques pour Enseignants
  getAllEnseignants(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/enseignants`);
  }

  getEnseignantById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.MEMBER_API}/enseignants/${id}`);
  }

  findByGrade(grade: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/enseignants/grade/${grade}`);
  }

  findByEtablissement(etablissement: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/enseignants/etablissement/${etablissement}`);
  }

  // Affecter un étudiant à un enseignant
  affecterEtudiantEnseignant(idetd: number, idens: number): Observable<void> {
    return this.httpClient.post<void>(`${this.MEMBER_API}/affecter/${idetd}/${idens}`, {});
  }

  // Récupérer les étudiants d'un enseignant
  getEtudiantsByEnseignant(idens: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/etudiants-by-enseignant/${idens}`);
  }

  // Récupérer un membre avec ses publications
  getFullMember(id: string): Observable<Member> {
    return this.httpClient.get<Member>(`${this.MEMBER_API}/fullmember/${id}`);
  }

  // Affecter une publication à un auteur
affecterPublication(idauteur: number, idpub: number): Observable<string> {
  return this.httpClient.post(
    `${this.MEMBER_API}/publications/affecter?idauteur=${idauteur}&idpub=${idpub}`,
    {},
    { responseType: 'text' } // ← AJOUTEZ CETTE OPTION
  );
}

  // Récupérer les publications d'un auteur
  getPublicationsByAuteur(idauteur: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.MEMBER_API}/${idauteur}/publications`);
  }
}