import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HoverFocusDirective } from './directives/hover-focus.directive';



@NgModule({
  declarations: [LoginComponent, HoverFocusDirective],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
    ReactiveFormsModule
  ]
})
export class AuthModule { }
