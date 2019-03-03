import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
@Injectable()
export class TimerTimeOutBroker {
  private timoutTimerSubject = new Subject<number>();

  getTimeoutTimePublisher() {
    return this.timoutTimerSubject.asObservable();
  }
  setTimeoutTimer(count: number) {
    this.timoutTimerSubject.next(count);
  }
}
