import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, RouterLink, MatSelectModule, MatIconModule, AsyncPipe, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  roleService=inject(RoleService);
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  roles$!:Observable<Role[]>;
  fb = inject(FormBuilder);
  registerForm!:FormGroup;
  router = inject(Router);
  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;
  errors!:ValidationError[];

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next:(response) => {
        console.log(response);
        this.matSnackBar.open(response.message,'Close', {
          duration:5000,
          horizontalPosition:'center',
        });
      },
      error: (err: HttpErrorResponse) => {
        if(err!.status == 400){
          this.errors = err!.error;
          this.matSnackBar.open('Validations errors', 'Close', {
            duration:5000,
            horizontalPosition:'center',
          });
          this.router.navigate(['/login'])
        }
      },
    complete: () => console.log('Register succes'),
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      fullName: ['', Validators.required],
      roles: [''],
      confirmPassword:['', Validators.required]
    },
    {
      validator: this.passwordMatchValidator,
    }
  );

    this.roles$ = this.roleService.getRoles();
  }

  private passwordMatchValidator(control:AbstractControl): { [key:string]:boolean} | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password != confirmPassword){
      return { 'passwordMismatch': true};
    }
    return null;
  }
}
