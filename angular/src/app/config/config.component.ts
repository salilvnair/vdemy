import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { AppConfigurationModel } from './model/app-conf.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  private appConfigurationModel: AppConfigurationModel;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  allowedVideoFormats: string[];

  allowedOtherFormats: string[];

  constructor(
    private dashBoardService: DashboardService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.appConfigurationModel = this.loadConfigurationData();
    if (this.appConfigurationModel) {
      if (this.appConfigurationModel.videoFormats) {
        this.allowedVideoFormats = [...this.appConfigurationModel.videoFormats];
      }
      if (this.appConfigurationModel.allowedOtherFormats) {
        this.allowedOtherFormats = [
          ...this.appConfigurationModel.allowedOtherFormats
        ];
      }
    }
  }
  loadConfigurationData(): AppConfigurationModel {
    return this.dashBoardService.getAppConfiguration();
  }

  addNewVideoFormat(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.allowedVideoFormats) {
        this.allowedVideoFormats = [];
      }
      this.allowedVideoFormats.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeVideoFormat(videoFormat: string): void {
    const index = this.allowedVideoFormats.indexOf(videoFormat);

    if (index >= 0) {
      this.allowedVideoFormats.splice(index, 1);
    }
  }

  addNewOtherFormat(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.allowedOtherFormats) {
        this.allowedOtherFormats = [];
      }
      this.allowedOtherFormats.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeOtherFormat(videoFormat: string): void {
    const index = this.allowedOtherFormats.indexOf(videoFormat);

    if (index >= 0) {
      this.allowedOtherFormats.splice(index, 1);
    }
  }

  saveConfig() {
    var self = this;
    let oldAppConfigurationModel = this.appConfigurationModel;
    let message = 'Configuration saved successfully!';
    if (
      oldAppConfigurationModel.videoFormats ||
      oldAppConfigurationModel.allowedOtherFormats
    ) {
      oldAppConfigurationModel = { ...this.appConfigurationModel };
      if (this.allowedOtherFormats) {
        this.appConfigurationModel.allowedOtherFormats = [
          ...this.allowedOtherFormats
        ];
      }
      if (this.allowedVideoFormats) {
        this.appConfigurationModel.videoFormats = [...this.allowedVideoFormats];
      }
      this.dashBoardService.updateAppConfiguration(
        oldAppConfigurationModel,
        self.appConfigurationModel
      );
      message = 'Configuration updated successfully!';
    } else {
      let newAppConfigurationModel = new AppConfigurationModel();
      if (this.allowedOtherFormats) {
        newAppConfigurationModel.allowedOtherFormats = [
          ...this.allowedOtherFormats
        ];
      }
      if (this.allowedOtherFormats) {
        newAppConfigurationModel.videoFormats = [...this.allowedVideoFormats];
      }
      this.dashBoardService.saveAppConfiguration(newAppConfigurationModel);
      this.appConfigurationModel = this.loadConfigurationData();
    }

    const action = 'OK';
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
}
