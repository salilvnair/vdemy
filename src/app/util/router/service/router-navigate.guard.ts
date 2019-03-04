import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  CanDeactivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { OnRouterNavigate } from './router-navigate.service';

@Injectable()
export class OnRouterNavigateGuard implements CanDeactivate<OnRouterNavigate> {
  constructor() {}

  canDeactivate(
    component: OnRouterNavigate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.beforeRouterNavigate();
  }
}
