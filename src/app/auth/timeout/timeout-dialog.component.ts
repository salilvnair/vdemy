import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { WatchmanService } from '../../util/watchman/watchman.service';

/**
 * @title Dialog Overview
 */
@Component({
  templateUrl: './timeout-dialog.component.html'
})
export class TimeoutDialog implements OnInit {
  ngOnInit(): void {
    this.watchmanService.afterIdleTime().subscribe(count => {
      this.data.counter =
        this.watchmanService.getWatchmanConfig().timeout - count;
      if (this.data.counter == 0) {
        this.dialogRef.close('logout');
      }
    });
  }
  constructor(
    public dialogRef: MatDialogRef<TimeoutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private watchmanService: WatchmanService
  ) {}

  onNoClick(): void {
    this.dialogRef.close('logout');
  }
  onYesClick(): void {
    this.dialogRef.close('continue');
  }
}
