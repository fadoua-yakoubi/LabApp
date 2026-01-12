import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule}from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberComponent } from './member/member.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MemberFormComponent } from './member-form/member-form.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TemplateComponent } from './template/template.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from './environments';
import { EvtComponent } from './evt/evt.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { ModalEvtComponent } from './modal-evt/modal-evt.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicationComponent } from './publication/publication.component';
import { ToolComponent } from './tool/tool.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteEvtDialogComponent } from './delete-evt-dialog/delete-evt-dialog.component';
import { ModalPublicationComponent } from './modal-publication/modal-publication.component';
import { ModalToolComponent } from './modal-tool/modal-tool.component';
import { DeleteToolDialogComponent } from './delete-tool-dialog/delete-tool-dialog.component';
import { DeletePublicationDialogComponent } from './delete-publication-dialog/delete-publication-dialog.component';
import { MemberPublicationsDialogComponent } from './member-publications-dialog/member-publications-dialog.component'; 
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    AppComponent,
    MemberComponent,
    MemberFormComponent,
    ConfirmDialogComponent,
    TemplateComponent,
    LoginComponent,
    EvtComponent,
    ModalEvtComponent,
    DashboardComponent,
    PublicationComponent,
    ToolComponent,
    DeleteEvtDialogComponent,
    ModalPublicationComponent,
    ModalToolComponent,
    DeleteToolDialogComponent,
    DeletePublicationDialogComponent,
    MemberPublicationsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, //necessaire pour les forms
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgChartsModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
