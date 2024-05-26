import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./views/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./views/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./views/appointment/appointment.module').then( m => m.AppointmentPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./views/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./views/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },  {
    path: 'test',
    loadChildren: () => import('./views/test/test.module').then( m => m.TestPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
