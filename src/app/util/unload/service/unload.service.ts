import { Observable } from 'rxjs';
export interface BeforeUnload {
  beforeunload(): Observable<boolean> | Promise<boolean> | boolean;
}
