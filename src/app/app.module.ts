import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ReposComponent } from './repos/repos.component';
import { RepoCardComponent } from './repo-card/repo-card.component';
import { RepoDetailComponent } from './repo-detail/repo-detail.component';
import { InMemoryDataService } from './services/in-memory-data.service';
import { RepoSearchComponent } from './repo-search/repo-search.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    ReposComponent,
    RepoCardComponent,
    RepoDetailComponent,
    RepoSearchComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 1000, dataEncapsulation: false }),
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
