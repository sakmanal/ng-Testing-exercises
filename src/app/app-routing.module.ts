import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGurdService } from '@core/guards/auth-gurd.service';
import { ReposComponent } from './gitRepos/repos/repos.component';
import { RepoDetailComponent } from './gitRepos/repo-detail/repo-detail.component';
import { LoginpageGuardService } from '@core/guards/loginpage-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/repos', pathMatch: 'full' },
  {
    path: 'repos/:id',
    canActivate: [AuthGurdService],
    component: RepoDetailComponent,
  },
  { path: 'repos', canActivate: [AuthGurdService], component: ReposComponent },
  {
    path: 'logs',
    canActivate: [AuthGurdService],
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'login',
    canActivate: [LoginpageGuardService],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
