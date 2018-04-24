import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TimeoutDialog } from './timeout-dialog.component';
import { AuthService } from '../service/auth.service';
import { WatchmanService } from '../../util/watchman/watchman.service';

@Injectable()
export class TimeoutDialogService {
  private userDecision: string = '';
  private countdown = 0;
  private timeoutDialogOpened = false;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private watchmanService: WatchmanService
  ) {}

  private openDialog(countdown): void {
    let dialogRef = this.dialog.open(TimeoutDialog, {
      width: '350px',
      data: { counter: countdown }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userDecision = result;
      if (result === 'logout') {
        this.watchmanService.stopWatching();
        this.authService.logout();
      } else if (result === 'continue') {
        this.watchmanService.resetTimer();
        this.timeoutDialogOpened = false;
      }
    });
  }

  initSessionTimeOut() {
    this.watchmanService.watch();
    this.watchmanService.afterIdleTime().subscribe(count => {
      this.countdown = this.watchmanService.getWatchmanConfig().timeout - count;
      if (!this.timeoutDialogOpened) {
        this.openDialog(this.countdown);
        this.timeoutDialogOpened = true;
      }
    });
  }
}
