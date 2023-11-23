import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminUserValidationComponent } from './components/admin-user-validation/admin-user-validation.component';
import { HomeComponent } from './components/home/home.component';
import { adminGuard } from './guards/admin.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { VisualizarTurnoComponent } from './components/visualizar-turno/visualizar-turno.component';
import { VisualizarTurnosEspecialistaComponent } from './components/visualizar-turnos-especialista/visualizar-turnos-especialista.component';
import { VisualizarTurnosAdminComponent } from './components/visualizar-turnos-admin/visualizar-turnos-admin.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "user-validation", component: AdminUserValidationComponent, canActivate: [adminGuard]},
  {path: "home", component: HomeComponent},
  {path: "profile", component: PerfilComponent},
  {path: "solicitar-turno", component: SolicitarTurnoComponent},
  {path: "ver-turnos", component: VisualizarTurnoComponent},
  {path: 'ver-turnos-especialista', component: VisualizarTurnosEspecialistaComponent},
  {path: 'ver-turnos-admin', component: VisualizarTurnosAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
