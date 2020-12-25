import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReposComponent } from './gitRepos/repos/repos.component';
import { RepoDetailComponent } from './gitRepos/repo-detail/repo-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/repos', pathMatch: 'full' },
  { path: 'repos/:id', component: RepoDetailComponent },
  { path: 'repos', component: ReposComponent },
  { path: 'logs', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
