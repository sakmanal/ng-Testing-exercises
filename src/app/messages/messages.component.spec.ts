import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from '../services/message.service';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';
import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesComponent, RouterLinkDirectiveStub ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    messageService = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Doesn\'t display anything if logs is empty', () => {
    component.logs = [];
    fixture.detectChanges();

    const li = fixture.debugElement.query(By.css('li'));
    const clearbutton = fixture.debugElement.query(By.css('.delete'));

    expect(li).toBeFalsy();
    expect(clearbutton).toBeFalsy();
  });


  it('Clicking the clear button calls clear on the message service and clears the logs Array', () => {
    component.logs = ['log1', 'log2'];
    messageService.clear = jasmine.createSpy().and.returnValue([]);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('.delete')).nativeElement;
    button.click();

    // No need to detect changes because we're not checking changes in the DOM
    expect(messageService.clear).toHaveBeenCalled();
    expect(component.logs.length).toBe(0);
  });


  it('Displays each log', () => {
    messageService.getlogs = jasmine.createSpy().and.returnValue(['log1', 'log2']);
    // spyOn(messageService, 'getlogs').and.returnValue(['log1', 'log2']);
    component.ngOnInit();

    expect(messageService.getlogs).toHaveBeenCalled();
    expect(component.logs.length).toBe(2);

    fixture.detectChanges();

    const logElements: Array<HTMLDivElement> = fixture.debugElement
      .queryAll(By.css('li'))
      .map((e) => e.nativeElement);


    expect(logElements.length).toBe(2);
    expect(logElements[0].textContent).toContain('log1');
    expect(logElements[1].textContent).toContain('log2');
  });
});

describe('MessagesComponent Altenative', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(() => {
    const messageServiceStub = () => ({ getlogs: () => ([]) });
    TestBed.configureTestingModule({
      declarations: [MessagesComponent, RouterLinkDirectiveStub],
      providers: [{ provide: MessageService, useFactory: messageServiceStub }]
    });
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });


  it('Displays each log', () => {
    const messageServiceStub: MessageService = TestBed.inject(MessageService);
    spyOn(messageServiceStub, 'getlogs').and.returnValue(['log1', 'log2']);
    fixture.detectChanges();

    const logElements: Array<HTMLDivElement> = fixture.debugElement
      .queryAll(By.css('li'))
      .map((e) => e.nativeElement);

    expect(logElements.length).toBe(2);
    expect(logElements[0].textContent).toContain('log1');
    expect(logElements[1].textContent).toContain('log2');
  });
});
