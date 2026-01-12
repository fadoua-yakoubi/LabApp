import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberComponent } from './member/member.component';
import { LoginComponent } from './login/login.component';
import { EvtComponent } from './evt/evt.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TemplateComponent } from './template/template.component';
import { AuthService } from "./../Services/auth.service";  // Importez votre AuthService
import { PublicationComponent } from './publication/publication.component';
import { ToolComponent } from './tool/tool.component';

const routes: Routes = [
  // Route publique (sans template)
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Routes protégées (AVEC template)
  {
    path: '',
    component: TemplateComponent,
    canActivate: [AuthService],  // Utilisez AuthService comme guard
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'members', component: MemberComponent },
      { path: 'events', component: EvtComponent },
      { path: 'create', component: MemberFormComponent },
      { path: ':id/edit', component: MemberFormComponent },
      { path: 'tools', component: ToolComponent },
      { path: 'publications', component: PublicationComponent },

    ]
  },
  
  // Redirection par défaut
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }