import { Observable } from 'rxjs';
export interface OnRouterNavigate {
  beforeRouterNavigate(): Observable<boolean> | Promise<boolean> | boolean;
}
