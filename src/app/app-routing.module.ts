import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./views/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'splash-screen', loadChildren: () => import('./views/splash-screen/splash-screen.module').then( m => m.SplashScreenPageModule) },
  { path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardPageModule)},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
