import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RepoRetrieveError } from '@core/models/repoRetrieveError';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
    ) {
      this.createForm();
     }

  ngOnInit(): void { }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  public onSubmit(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.authService.login(this.f.email.value, this.f.password.value)
        .subscribe(
            () => {
              this.loading = false;
              this.router.navigate(['/']);
            },
            (error: RepoRetrieveError) => {
              this.loginForm.reset();
              this.errorMessage = error.friendlyMessage;
              this.loading = false;
            }
        );
  }

}
