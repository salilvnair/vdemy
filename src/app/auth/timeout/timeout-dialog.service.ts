import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TimeoutDialog } from './timeout-dialog.component';
import { AuthService } from '../service/auth.service';
import { WatchmanService } from '../../util/watchman/watchman.service';
import { Subject } from 'rxjs/Subject';
import { TimerTimeOutBroker } from './timeout-broker.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class TimeoutDialogService {
  timeoutTimerSubscription: Subscription;
  private userDecision: string = '';
  private countdown = 0;
  private timeoutDialogOpened = false;
  private onWatch = false;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private watchmanService: WatchmanService,
    private timerTimeOutBroker: TimerTimeOutBroker
  ) {}

  private openDialog(countdown): void {
    let dialogRef = this.dialog.open(TimeoutDialog, {
      width: '350px',
      data: { counter: countdown }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userDecision = result;
      if (result === 'logout') {
        this.cleanUp();
        this.watchmanService.stopWatching();
        this.authService.logout();
      } else if (result === 'continue') {
        this.watchmanService.resetTimer();
        this.timeoutDialogOpened = false;
      }
    });
  }

  private initSessionTimeOut() {
    this.timeoutDialogOpened = false;
    this.watchmanService.watch();
    this.timeoutTimerSubscription = this.watchmanService
      .afterIdleTime()
      .subscribe(count => {
        this.countdown =
          this.watchmanService.getWatchmanConfig().timeout - count;
        if (!this.timeoutDialogOpened) {
          this.openDialog(this.countdown);
          this.timeoutDialogOpened = true;
        }
        this.timerTimeOutBroker.setTimeoutTimer(this.countdown);
      });
  }

  startOrStopTimeOut(stopWatching: boolean) {
    this.cleanUp();
    this.watchmanService.stopWatching();
    if (!stopWatching) {
      this.initSessionTimeOut();
    }
  }

  private cleanUp() {
    if (this.timeoutTimerSubscription) {
      this.timeoutTimerSubscription.unsubscribe();
    }
  }
}