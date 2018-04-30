import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  CanDeactivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { BeforeUnload } from './unload.service';

@Injectable()
export class UnLoadGuard implements CanDeactivate<BeforeUnload> {
  constructor() {}

  canDeactivate(
    component: BeforeUnload,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.beforeunload();
  }
}
