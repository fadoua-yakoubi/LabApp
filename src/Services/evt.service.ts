import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Evt } from 'src/Models/Evt';

@Injectable({
  providedIn: 'root'
})
export class EvtService {
  
  private readonly GATEWAY_URL = environment.apiUrl;
  private readonly EVENT_API = `${this.GATEWAY_URL}/EVENEMENT-SERVICE/api/evenements`;

  // Headers pour Spring Data REST
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  GetAllEvts(): Observable<Evt[]> {
    return this.httpClient.get<any>(this.EVENT_API).pipe(
      map(response => {
        console.log('Réponse brute du backend:', response);
        if (response._embedded && response._embedded.evenements) {
          return response._embedded.evenements;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  // ✅ CORRECTION : POST pour création
  saveEvent(evt: Evt): Observable<Evt> {
    // Enlever l'id pour la création
    const { id, ...eventData } = evt;
    console.log('Envoi POST:', eventData);
    return this.httpClient.post<Evt>(this.EVENT_API, eventData, this.httpOptions);
  }

  getEvenementById(id: string): Observable<Evt> {
    return this.httpClient.get<Evt>(`${this.EVENT_API}/${id}`);
  }

  // ✅ CORRECTION : PUT ou PATCH pour modification
  updateEvenement(id: string, evenement: Evt): Observable<Evt> {
    // Utiliser PATCH au lieu de PUT avec Spring Data REST
    const { id: _, ...eventData } = evenement;
    console.log('Envoi PATCH:', eventData);
    return this.httpClient.patch<Evt>(`${this.EVENT_API}/${id}`, eventData, this.httpOptions);
  }

  deleteEvenement(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.EVENT_API}/${id}`);
  }

  // Méthodes de recherche
  findByTitreContaining(titre: string): Observable<Evt[]> {
    return this.httpClient.get<any>(`${this.EVENT_API}/search/findByTitreContaining?titre=${titre}`).pipe(
      map(response => response._embedded?.evenements || [])
    );
  }

  findByLieuContaining(lieu: string): Observable<Evt[]> {
    return this.httpClient.get<any>(`${this.EVENT_API}/search/findByLieuContaining?lieu=${lieu}`).pipe(
      map(response => response._embedded?.evenements || [])
    );
  }

  findUpcomingEvents(): Observable<Evt[]> {
    return this.httpClient.get<any>(`${this.EVENT_API}/search/findUpcomingEvents`).pipe(
      map(response => response._embedded?.evenements || [])
    );
  }

  findPastEvents(): Observable<Evt[]> {
    return this.httpClient.get<any>(`${this.EVENT_API}/search/findPastEvents`).pipe(
      map(response => response._embedded?.evenements || [])
    );
  }

  findAllByOrderByDateDesc(): Observable<Evt[]> {
    return this.httpClient.get<any>(`${this.EVENT_API}/search/findAllByOrderByDateDesc`).pipe(
      map(response => response._embedded?.evenements || [])
    );
  }
}