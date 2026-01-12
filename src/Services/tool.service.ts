import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tool } from 'src/Models/Tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  // Utiliser la Gateway au lieu d'appeler directement le microservice
    private baseUrl = `${environment.apiUrl}/OUTIL-SERVICE/api/outils`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // CRUD DE BASE
  // ==========================================

  // Récupérer tous les outils
  getAllOutils(): Observable<Tool[]> {
    return this.http.get<Tool[]>(this.baseUrl);
  }

  // Récupérer un outil par ID
  getOutilById(id: number): Observable<Tool> {
    return this.http.get<Tool>(`${this.baseUrl}/${id}`);
  }

  // Créer un nouvel outil
  saveOutil(outil: Tool): Observable<Tool> {
    return this.http.post<Tool>(this.baseUrl, outil);
  }

  // Mettre à jour un outil
  updateOutil(id: number, outil: Tool): Observable<Tool> {
    return this.http.put<Tool>(`${this.baseUrl}/${id}`, outil);
  }

  // Supprimer un outil
  deleteOutil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ==========================================
  // RECHERCHES PERSONNALISÉES
  // ==========================================

  // Recherche par source exacte
  findBySource(source: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findBySource`, {
      params: new HttpParams().set('source', source)
    });
  }

  // Recherche par source contenant
  findBySourceContaining(source: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findBySourceContaining`, {
      params: new HttpParams().set('source', source)
    });
  }

  // Recherche par date exacte
  findByDate(date: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findByDate`, {
      params: new HttpParams().set('date', date)
    });
  }

  // Recherche après une date
  findByDateAfter(date: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findByDateAfter`, {
      params: new HttpParams().set('date', date)
    });
  }

  // Recherche avant une date
  findByDateBefore(date: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findByDateBefore`, {
      params: new HttpParams().set('date', date)
    });
  }

  // Recherche entre deux dates
  findByDateBetween(startDate: string, endDate: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findByDateBetween`, {
      params: new HttpParams()
        .set('start', startDate)
        .set('end', endDate)
    });
  }

  // Tous les outils ordonnés par date décroissante
  findAllOrderByDateDesc(): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findAllByOrderByDateDesc`);
  }

  // Tous les outils ordonnés par source
  findAllOrderBySourceAsc(): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findAllByOrderBySourceAsc`);
  }

  // Outils d'une année spécifique
  findByYear(year: number): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/search/findByYear`, {
      params: new HttpParams().set('year', year.toString())
    });
  }

  // Compter par source
  countBySource(source: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/search/countBySource`, {
      params: new HttpParams().set('source', source)
    });
  }
}