import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { InMemoryDataService } from './core/services/mock-server/in-memory-data.service';
import { RepoSearchComponent } from './core/components/repo-search/repo-search.component';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { CoreModule } from './core/core.module';
import { GitreposModule } from './gitRepos/gitrepos.module';
import { JwtInterceptor } from '@core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RepoSearchComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 1000, dataEncapsulation: false }),
    AppRoutingModule,
    FormsModule,
    CoreModule,
    GitreposModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
