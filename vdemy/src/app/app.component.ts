import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { VdemyUpdaterService } from './updater/vdemy-updater.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor (
      private electronService: ElectronService, 
      private ngZone: NgZone,
      private vdemyUpdaterService: VdemyUpdaterService
  ){}

  title = 'vdemy';
  offline = false;

  ngOnInit() {
    this.vdemyUpdaterService.init();
    this.electronService.ipcRenderer.on("switchVdemy",(event, offlineChecked)=>{
      this.ngZone.run(()=>{
        this.offline = offlineChecked;
      });
    })
  }

}
