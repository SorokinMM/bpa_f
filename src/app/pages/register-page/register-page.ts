import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  @Input() isOpen = false;
  @Output() closeRegisterForm = new EventEmitter<void>();
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef)
  protected errorMessage: string | null = null;

  registerForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required],
  });

  protected onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: () => {
          this.close();
        },
        error: (err) => {
          this.errorMessage = err;
          this.cdr.markForCheck();
        },
      });
    }
  }

  close() {
    this.closeRegisterForm.emit();
    this.registerForm.reset();
    this.errorMessage = null;
  }
}
