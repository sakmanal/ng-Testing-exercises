import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ToolbarComponent } from './toolbar.component';


@Component({
  selector: 'app-repo-search',
  template: '<div></div>',
})
class FakeSearchRepoComponent { }

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarComponent, FakeSearchRepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
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
