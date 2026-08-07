import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  authForm: FormGroup;

  isLoginMode: boolean =true;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private Authservice:AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  //toggle the ui between login adn register
  switchMode(): void{
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage ='';
    this.cdr.detectChanges();
  }

  onSubmit():void{
    if(this.authForm.invalid){
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const credentials = this.authForm.value;
    
    const authObservable = this.isLoginMode ? this.Authservice.login(credentials):this.Authservice.register(credentials);
    
    authObservable.subscribe({
      next:()=>{
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },
      error:(err)=>{
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }

  private getErrorMessage(err: any): string {
    const error = err?.error;

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error?.message === 'string') {
      return error.message;
    }

    if (error?.Errors) {
      return Object.values(error.Errors).join(' ');
    }

    return 'An error occurred. Please try again.';
  }
}
