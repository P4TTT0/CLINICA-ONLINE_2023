import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/enviroments/enviroment';
import { RegisterComponent } from './components/register/register.component';
import { EmailValidateComponent } from './components/email-validate/email-validate.component';
import { AdminUserValidationComponent } from './components/admin-user-validation/admin-user-validation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserComponent } from './components/registers/user/user.component';
import { EspecialistaComponent } from './components/registers/especialista/especialista.component';
import { AdminComponent } from './components/registers/admin/admin.component';
import { NoValidatedComponent } from './components/no-validated/no-validated.component';
import { HomeComponent } from './components/home/home.component';
import { SeleccionarEspecialidadComponent } from './components/registers/especialista/seleccionar-especialidad/seleccionar-especialidad.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { VisualizarTurnoComponent } from './components/visualizar-turno/visualizar-turno.component';
import { CancelarTurnoComponent } from './components/turnos/cancelar-turno/cancelar-turno.component';
import { NgbRatingModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RateTurnoComponent } from './components/turnos/rate-turno/rate-turno.component';
import { EncuestaComponent } from './components/turnos/encuesta/encuesta.component';
import { VisualizarTurnosEspecialistaComponent } from './components/visualizar-turnos-especialista/visualizar-turnos-especialista.component';
import { RechazarComponent } from './components/turnos/rechazar/rechazar.component';
import { FinishComponent } from './components/turnos/finish/finish.component';
import { VisualizarReseniaComponent } from './components/visualizar-resenia/visualizar-resenia.component';
import { VisualizarTurnosAdminComponent } from './components/visualizar-turnos-admin/visualizar-turnos-admin.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HistoriaClinicaComponent } from './components/turnos/historia-clinica/historia-clinica.component';
import { HistoriasClinicasUsuriosComponent } from './components/historias-clinicas-usurios/historias-clinicas-usurios.component';
import { UserHistoriaClinicaComponent } from './components/modals/user-historia-clinica/user-historia-clinica.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingComponent,
    RegisterComponent,
    EmailValidateComponent,
    AdminUserValidationComponent,
    UserComponent,
    EspecialistaComponent,
    AdminComponent,
    NoValidatedComponent,
    HomeComponent,
    SeleccionarEspecialidadComponent,
    PerfilComponent,
    SolicitarTurnoComponent,
    VisualizarTurnoComponent,
    CancelarTurnoComponent,
    RateTurnoComponent,
    EncuestaComponent,
    VisualizarTurnosEspecialistaComponent,
    RechazarComponent,
    FinishComponent,
    VisualizarReseniaComponent,
    VisualizarTurnosAdminComponent,
    HistoriaClinicaComponent,
    HistoriasClinicasUsuriosComponent,
    UserHistoriaClinicaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    NgbRatingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxCaptchaModule,
    MdbModalModule,
    HttpClientModule,
  ],
  providers: [{provide: FIREBASE_OPTIONS, useValue: environment.firebase}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
