import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {  // Implémentez CanActivate

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  // Connexion avec email/mot de passe
  signInWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Déconnexion
  signOut() {
    localStorage.removeItem('user');
    return this.afAuth.signOut();
  }

  // Réinitialisation du mot de passe
  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  // MÉTHODE DU GUARD - Implémentation de CanActivate
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          // Sauvegarder l'utilisateur dans localStorage
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        } else {
          // Rediriger vers la page de login
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }

  // Méthode helper pour vérifier l'authentification (version simple)
  canActivateSimple(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}