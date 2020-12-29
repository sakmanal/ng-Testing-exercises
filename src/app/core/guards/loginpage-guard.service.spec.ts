import { TestBed } from '@angular/core/testing';

import { LoginpageGuardService } from './loginpage-guard.service';

describe('LoginpageGuardService', () => {
  describe('canActivate', () => {
    let loginGuardService: LoginpageGuardService;
    let authServiceStub;
    let router;

    it('should return true for a logged out user', () => {
      authServiceStub = { isLoggedIn: false };
      loginGuardService = new LoginpageGuardService(router, authServiceStub);

      expect(loginGuardService.canActivate()).toEqual(true);
    });

    it('should navigate back to home page for a logged in user', () => {
      authServiceStub = { isLoggedIn: true };
      router = { navigate: (path: any) => null };
      loginGuardService = new LoginpageGuardService(router, authServiceStub);
      spyOn(router, 'navigate');

      expect(loginGuardService.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});

