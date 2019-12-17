import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-vdemy-offline',
  templateUrl: './vdemy-offline.component.html',
  styleUrls: ['./vdemy-offline.component.css'],
})
export class VdemyOfflineComponent implements OnInit{
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.navigate(['/dashboard']);
  }
}
