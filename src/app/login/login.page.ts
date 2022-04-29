import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginUsuario } from '../models/login-usuario';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  roles: string[] = [];
  errMsj: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private authService: AuthService,
    private toastController: ToastController) { 
    this.form = fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onSubmit(): void {
    const {usuario, password} = this.form.value
    this.loginUsuario = new LoginUsuario(usuario, password);
    this.authService.login(this.loginUsuario).subscribe(
      async data => {
        this.isLogged = true;

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        const toast = await this.toastController.create({
          color: 'success',
          duration: 2000,
          message: 'Bienvenido ' + data.nombreUsuario,
        });
        await toast.present();
        this.router.navigate(['/home']);
      },
      async err => {
        this.isLogged = false;
        this.errMsj = err.error.message;
        const toast = await this.toastController.create({
          color: 'danger',
          duration: 2000,
          message: 'Error al inicar sesion',
        });
        await toast.present();
        // this.toastr.error(this.errMsj, 'Fail', {
        //   timeOut: 3000,  positionClass: 'toast-top-center',
        // });
        // console.log(err.error.message);
      }
    );
  }

}
