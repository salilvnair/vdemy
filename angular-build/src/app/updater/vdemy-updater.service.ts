import { Injectable, NgZone } from "@angular/core";
import { UpdateNotifier, ActionType, DownloadNotifier, InfoNotifier } from '@ngxeu/notifier';
import { VdemyUpdater } from "./vdemy.updater";
import { ElectronService } from "ngx-electron";
@Injectable({
    providedIn:'root'
})
export class VdemyUpdaterService{
    constructor(
        private vdemyUpdater:VdemyUpdater,
        private updateNotifier:UpdateNotifier,
        private downloadNotifier:DownloadNotifier,
        private infoNotifier:InfoNotifier,
        private electronService:ElectronService,
        private ngZone:NgZone
    ){}

    init(){
      this.electronService.ipcRenderer.on("checkForUpdate",()=>{
        this.ngZone.run(()=>{
          this.checkForUpdate();
        });
      })
    }

    checkForUpdate(){
        this.vdemyUpdater.checkForUpdate().subscribe(updateStatus=>{
          if(this.vdemyUpdater.hasPendingUpdates()){
            this.downloadNotifier.notify(null,ActionType.pending).subscribe(notifierAction=>{
              if(notifierAction.action===ActionType.install) {
                this.downloadNotifier.notify(this.vdemyUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.restart) {
                    this.vdemyUpdater.restart();
                  }
                });
              }
            });
          }
          else if(updateStatus.updateAvailable){        
            this.updateNotifier.notify(updateStatus).subscribe(notifierAction=>{
              if(notifierAction.action===ActionType.download) {
                this.downloadNotifier.notify(this.vdemyUpdater.download(),ActionType.download).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.install) {
                    this.downloadNotifier.notify(this.vdemyUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                      if(notifierAction.action===ActionType.restart) {
                        this.vdemyUpdater.restart();
                      }
                    });
                  }
                });
              }
              else if(notifierAction.action===ActionType.downloadInstall) {
                this.downloadNotifier.notify(this.vdemyUpdater.download(),ActionType.downloadInstall).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.install) {
                    this.downloadNotifier.notify(this.vdemyUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                      if(notifierAction.action===ActionType.restart) {
                        this.vdemyUpdater.restart();
                      }
                    });
                  }
                });
              }
            });                
          }
          else{
            if(updateStatus.noInfo){
              this.infoNotifier.notify("Looks like you app is in the development mode,\n\n hence no release found!","400px");
            }
            else{
              this.infoNotifier.notify("Your app is up to date!");
            }
          }
        });
      }
    
}