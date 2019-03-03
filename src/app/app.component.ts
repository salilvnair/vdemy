import { Component, OnInit } from '@angular/core';
import { WatchmanService } from './util/watchman/watchman.service';
import { TimeoutDialogService } from './auth/timeout/timeout-dialog.service';
import { VdemyUpdaterService } from './updater/vdemy-updater.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor( private vdemyUpdaterService:VdemyUpdaterService) {
  }
  ngOnInit(): void {
    this.vdemyUpdaterService.init();
  }
  title = 'app';
}
