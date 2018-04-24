import { Component, OnInit, Input } from '@angular/core';
import { ICourseModel } from './model/course.model';
import { DashboardService } from '../service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() course: ICourseModel;
  @Input() appMenu;
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {}

  playCourse(courseId) {
    this.dashboardService.setPlayCourseId(courseId);
    this.router.navigate(['/play']);
  }
}
