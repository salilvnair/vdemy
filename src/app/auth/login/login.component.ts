import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { WatchmanService } from '../../util/watchman/watchman.service';
import { TimeoutDialogService } from '../timeout/timeout-dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private watchmanService: WatchmanService,
    private timeoutDialogService: TimeoutDialogService
  ) {}
  ngOnInit() {}
  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
    this.timeoutDialogService.startOrStopTimeOut(true);
  }
}
