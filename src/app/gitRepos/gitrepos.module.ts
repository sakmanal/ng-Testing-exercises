import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReposComponent } from './repos/repos.component';
import { RepoCardComponent } from './repo-card/repo-card.component';
import { RepoDetailComponent } from './repo-detail/repo-detail.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ReposComponent, RepoCardComponent, RepoDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class GitreposModule { }

