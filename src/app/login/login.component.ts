import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/Services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    this.authService.getCurrentUser().pipe(first()).subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.signInWithEmailAndPassword(email, password);
      
      // Sauvegarder l'utilisateur dans localStorage
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // Gestion des erreurs en français
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Adresse email invalide';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'Erreur réseau. Vérifiez votre connexion internet';
          break;
        default:
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer';
      }
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(event: Event): Promise<void> {
    event.preventDefault();
    
    const email = this.loginForm.get('email')?.value;
    
    if (!email) {
      this.errorMessage = 'Veuillez entrer votre adresse email pour réinitialiser le mot de passe';
      return;
    }

    if (!this.loginForm.get('email')?.valid) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    try {
      await this.authService.resetPassword(email);
      this.errorMessage = `Un email de réinitialisation a été envoyé à ${email}`;
      // Changer le message pour un message de succès
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Adresse email invalide';
          break;
        default:
          this.errorMessage = 'Erreur lors de l\'envoi de l\'email de réinitialisation';
      }
    }
  }
}