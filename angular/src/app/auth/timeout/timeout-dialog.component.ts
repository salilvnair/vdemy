import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { WatchmanService } from '../../util/watchman/watchman.service';
import { TimeoutDialogService } from './timeout-dialog.service';
import { TimerTimeOutBroker } from './timeout-broker.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * @title Dialog Overview
 */
@Component({
  templateUrl: './timeout-dialog.component.html'
})
export class TimeoutDialog implements OnInit, OnDestroy {
  timeoutTimerSubscription: Subscription;
  ngOnDestroy(): void {
    //console.log('destroying subscription');
    this.cleanUp();
  }
  ngOnInit(): void {
    //console.log('initializing subscription');
    this.timeoutTimerSubscription = this.timerTimeOutBroker
      .getTimeoutTimePublisher()
      .subscribe(count => {
        this.data.counter = this.watchmanService.getFormattedTime(count);
        if (count == 0) {
          this.dialogRef.close('logout');
        }
      });
  }
  constructor(
    public dialogRef: MatDialogRef<TimeoutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timerTimeOutBroker: TimerTimeOutBroker,
    private watchmanService: WatchmanService
  ) {}

  onNoClick(): void {
    this.dialogRef.close('logout');
  }
  onYesClick(): void {
    this.dialogRef.close('continue');
  }
  cleanUp() {
    this.timeoutTimerSubscription.unsubscribe();
  }
}
