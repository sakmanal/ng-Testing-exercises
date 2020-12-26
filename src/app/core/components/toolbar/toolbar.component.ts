import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@core/models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  title = 'My Github Repos';
  user$: Observable<User>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user$ = this.authService.user;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
