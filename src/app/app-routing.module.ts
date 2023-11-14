import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminUserValidationComponent } from './components/admin-user-validation/admin-user-validation.component';
import { HomeComponent } from './components/home/home.component';
import { adminGuard } from './guards/admin.guard';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "user-validation", component: AdminUserValidationComponent, canActivate: [adminGuard]},
  {path: "home", component: HomeComponent},
  {path: "profile", component: PerfilComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
