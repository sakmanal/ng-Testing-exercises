import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToolbarComponent } from './toolbar.component';

@Component({
  selector: 'app-repo-search',
  template: '<div></div>',
})
class FakeSearchRepoComponent { }

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

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

});
