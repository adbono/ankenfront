import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  realRol: string;
  autorizado: boolean;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.autorizado = false;
      const expectedRol = route.data.expectedRol;
      const roles = this.tokenService.getAuthorities();
      roles.forEach(rol => {
        if(expectedRol.indexOf(rol) == 0) this.autorizado = true;
      })
      if (!this.tokenService.getToken() || !this.autorizado) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

}
