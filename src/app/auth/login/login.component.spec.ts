import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '@core/models/user';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { RepoRetrieveError } from '@core/models/repoRetrieveError';

const user: User = {
  id: 1234,
  username: 'sakis',
  email: 'sakis@gmail.com',
  jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
};
class AuthServiceMock {
  login(email: string, pass: string): Observable<User> {
    return of(user);
  }
}

const routerStub = {
  navigate: (path: any) => null
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const data = { email: 'test@mail.com', password: 'secret-pass'};
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ LoginComponent ],
      providers: [
        {provide: AuthService, useClass: AuthServiceMock},
        {provide: Router, useValue: routerStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('Login Component Isolated Test', () => {
    it('Component successfully created', () => {
      expect(component).toBeTruthy();
    });

    it('component initial state', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.invalid).toBeTruthy();
      expect(component.errorMessage).toBe('');
      expect(component.loading).toBeFalsy();
    });

    it('Form value should update from when the input is changed', (() => {
      component.loginForm.controls.email.setValue(data.email);
      component.loginForm.controls.password.setValue(data.password);

      expect(component.loginForm.value).toEqual(data);
    }));

    it('Form invalid should be true when form is invalid', (() => {
      component.loginForm.controls.email.setValue('mail@');
      component.loginForm.controls.password.setValue(data.password);

      expect(component.loginForm.invalid).toBeTrue();
    }));
  });

  describe('Login Component Shallow Test', () => {
    it('created a form with username and password input and login button', () => {
      const emailInput = fixture.debugElement.nativeElement.querySelector('#mail');
      const passwordInput = fixture.debugElement.nativeElement.querySelector('#pass');
      const loginBtn = fixture.debugElement.nativeElement.querySelector('button');
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
      expect(loginBtn).toBeDefined();
    });

    it('Display Email Error Msg when Email input is blank & touched', () => {
      component.loginForm.controls.email.setValue('');
      component.loginForm.controls.email.markAsTouched();
      fixture.detectChanges();

      const emailErrorMsg = fixture.debugElement.nativeElement.querySelector('#email-required');
      expect(emailErrorMsg).toBeDefined();
      expect(emailErrorMsg.innerHTML).toContain('Email is required');
    });

    it('Display Email Error Msg when Email input is not a valid email address & touched', () => {
      component.loginForm.controls.email.setValue('mail@');
      component.loginForm.controls.email.markAsTouched();
      fixture.detectChanges();

      const emailErrorMsg = fixture.debugElement.nativeElement.querySelector('#email-invalid');
      expect(emailErrorMsg).toBeDefined();
      expect(emailErrorMsg.innerHTML).toContain('Email is invalid');

      // const emailInput = fixture.debugElement.nativeElement.querySelectorAll('input')[0];
      // expect(emailInput.classList).toContain('is-invalid');
      /* or */
      // const emailInput = fixture.debugElement.queryAll(By.css('input'))[0];
      // expect(emailInput.classes['is-invalid']).toBeTruthy();
      /* or */
      const emailInput: HTMLElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      expect(emailInput.classList).toContain('is-invalid');
    });

    it('Display Password Error Msg when Password input is blank & touched', () => {
      component.loginForm.controls.password.setValue('');
      component.loginForm.controls.password.markAsTouched();
      fixture.detectChanges();

      const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-required');
      expect(passwordErrorMsg).toBeDefined();
      expect(passwordErrorMsg.innerHTML).toContain('Password is required');

      const passwordInput = fixture.debugElement.queryAll(By.css('input'))[1];
      expect(passwordInput.classes['is-invalid']).toBeTruthy();
    });

    it('Login button should be disabled if form is invalid', () => {
      component.loginForm.controls.email.setValue('');
      component.loginForm.controls.password.setValue('');
      fixture.detectChanges();

      const loginBtn = fixture.debugElement.query(By.css('button'));
      expect(loginBtn.nativeElement.disabled).toBeTrue();
    });

    it('Login button should be enable if form is valid', () => {
      component.loginForm.controls.email.setValue(data.email);
      component.loginForm.controls.password.setValue(data.password);
      fixture.detectChanges();

      const loginBtn = fixture.debugElement.query(By.css('button'));
      expect(loginBtn.nativeElement.disabled).toBeFalse();
    });
  });

  describe('Login Component Integrated Test', () => {
    it('should not call authService login() method if form is invalid', () => {
      component.loginForm.controls.email.setValue('');
      component.loginForm.controls.password.setValue('');
      fixture.detectChanges();

      authService = TestBed.inject(AuthService);
      spyOn(authService, 'login').and.callThrough();
      const loginBtn = fixture.debugElement.query(By.css('button')).nativeElement;
      loginBtn.click();
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledTimes(0);
    });

    it('should route to home if login successfully', fakeAsync(() => {
      component.loginForm.controls.email.setValue(data.email);
      component.loginForm.controls.password.setValue(data.password);
      fixture.detectChanges();

      authService = TestBed.inject(AuthService);
      router = TestBed.inject(Router);
      spyOn(authService, 'login').and.returnValue(of(user).pipe(delay(500)));
      spyOn(router, 'navigate').and.callThrough();
      const loginBtn = fixture.debugElement.query(By.css('button')).nativeElement;
      loginBtn.click();
      tick(500);
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledWith(data.email, data.password);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should reset form and show error msg if login failed', fakeAsync(() => {
      const error: RepoRetrieveError = {
        errorNumber: 401,
        message: 'unauthorized',
        friendlyMessage: 'Wrong Email or Password'
      };
      component.loginForm.controls.email.setValue(data.email);
      component.loginForm.controls.password.setValue(data.password);
      fixture.detectChanges();

      authService = TestBed.inject(AuthService);
      router = TestBed.inject(Router);
      spyOn(authService, 'login').and.returnValue(throwError(error).pipe(delay(500)));
      spyOn(router, 'navigate').and.callThrough();
      const loginBtn = fixture.debugElement.query(By.css('button')).nativeElement;
      loginBtn.click();
      tick(500);
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledWith(data.email, data.password);
      expect(router.navigate).toHaveBeenCalledTimes(0);
      expect(component.loginForm.value).toEqual({email: null, password: null});
      expect(component.errorMessage).toBe(error.friendlyMessage);

      const errorMsg = fixture.debugElement.query(By.css('.errorMessage'));
      expect(errorMsg.nativeElement.innerHTML).toContain(error.friendlyMessage);
    }));
  });

});
