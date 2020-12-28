import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../../core/models/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToolbarComponent } from './toolbar.component';

// export class AuthServiceStub {
//   userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
//   user$: Observable<User> = this.userSubject.asObservable();
// }
@Component({
  selector: 'app-repo-search',
  template: '<div></div>',
})
class FakeSearchRepoComponent { }

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  // const authServiceStub = () => ({ user$: () => ({}) });
  const user = {
    id: 4000,
    username: 'Peter',
    email: 'peter@gmail.com',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ToolbarComponent, FakeSearchRepoComponent],
      // providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a title in an h1 tag', () => {
    // const authService: AuthService = TestBed.inject(AuthService);
    fixture.detectChanges();

    const titleElements = fixture.debugElement.queryAll(By.css('h1'));

    expect(titleElements.length).toBe(1);
    expect(titleElements[0].nativeElement.innerHTML).toBe(component.title);
  });

  it('should render searchComponent and logout-button/logs-button only if user is logged in', fakeAsync(() => {
    let searchRepoComp;
    let buttons;
    fixture.detectChanges();

    component.user$ = of(null);
    tick();
    fixture.detectChanges();
    searchRepoComp = fixture.debugElement.queryAll(By.directive(FakeSearchRepoComponent));
    buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(searchRepoComp.length).toBe(0);
    expect(buttons.length).toBe(0);

    component.user$ = of(user);
    tick();
    fixture.detectChanges();
    searchRepoComp = fixture.debugElement.queryAll(By.directive(FakeSearchRepoComponent));
    buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(searchRepoComp.length).toBe(1);
    expect(buttons.length).toBe(2);
  }));

  // it('should render searchComponent and logout-button/logs-button only if user is logged in (Alternative)', fakeAsync(() => {
  //   const authService: AuthService = TestBed.inject(AuthService);
  //   spyOn(authService, 'login')
  // }));
});
