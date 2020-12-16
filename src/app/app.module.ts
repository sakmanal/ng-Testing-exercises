import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ReposComponent } from './repos/repos.component';
import { RepoCardComponent } from './repo-card/repo-card.component';

@NgModule({
  declarations: [
    AppComponent,
    ReposComponent,
    RepoCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
