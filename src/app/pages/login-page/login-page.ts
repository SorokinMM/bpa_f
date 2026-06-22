import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterPage } from '../register-page/register-page';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RegisterPage],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  isRegisterFormOpen = false;

  form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.getRawValue())
        .subscribe(res => {
          console.log('Navigation to main page');
          this.router.navigate(['main']);
        })
    }
  }

  openModal() {
    this.isRegisterFormOpen = true;
  }
}
