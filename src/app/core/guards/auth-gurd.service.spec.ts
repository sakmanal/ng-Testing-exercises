import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGurdService } from './auth-gurd.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AuthGurdService', () => {
  let guardService: AuthGurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guardService = TestBed.inject(AuthGurdService);
  });

  it('should be created', () => {
    expect(guardService).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true for a logged in user', () => {
      const authServiceStub: AuthService = TestBed.inject(AuthService);
      spyOnProperty(authServiceStub, 'isLoggedIn', 'get').and.returnValue(true);

      expect(guardService.canActivate()).toEqual(true);
    });

    it('should navigate to home for a logged out user', () => {
      const authServiceStub: AuthService = TestBed.inject(AuthService);
      spyOnProperty(authServiceStub, 'isLoggedIn', 'get').and.returnValue(false);

      const routerStub: Router = TestBed.inject(Router);
      spyOn(routerStub, 'navigate').and.returnValue(null);

      expect(guardService.canActivate()).toEqual(false);
      expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});

describe('AuthGurdService (Alternative))', () => {
  describe('canActivate', () => {
    let guardService: AuthGurdService;
    let authServiceStub;
    let router;

    it('should return true for a logged in user', () => {
      authServiceStub = { isLoggedIn: true };
      guardService = new AuthGurdService(router, authServiceStub);

      expect(guardService.canActivate()).toEqual(true);
    });

    it('should navigate to home for a logged out user', () => {
      authServiceStub = { isLoggedIn: false };
      router = { navigate: (path: any) => null };
      guardService = new AuthGurdService(router, authServiceStub);
      spyOn(router, 'navigate');

      expect(guardService.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
