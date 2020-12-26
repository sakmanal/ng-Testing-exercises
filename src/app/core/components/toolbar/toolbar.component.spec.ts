import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToolbarComponent } from './toolbar.component';


@Component({
  selector: 'app-repo-search',
  template: '<div></div>',
})
class FakeSearchRepoComponent { }

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const authServiceStub = () => ({ user: () => ({}) });
  const user = {
    id: 4000,
    username: 'Peter',
    email: 'peter@gmail.com',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ToolbarComponent, FakeSearchRepoComponent ],
      providers: [{ provide: AuthService, useFactory: authServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;

    const authService: AuthService = TestBed.inject(AuthService);
    authService.user = of(user);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a title in an h1 tag', () => {
    const titleElements = fixture.debugElement.queryAll(By.css('h1'));

    expect(titleElements.length).toBe(1);
    expect(titleElements[0].nativeElement.innerHTML).toBe(component.title);
  });
});
