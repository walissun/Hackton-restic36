import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string | null = null;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (users) => {
        const user = users.find(
          (u) => u.user === username && u.passworld === password
        );

        if (user) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Usuário ou senha inválidos.';
        }
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Erro ao conectar com o servidor.';
      }
    );
  }

}
