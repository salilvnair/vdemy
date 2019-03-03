import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as CommonConstant from '../../../shared/constant/common.constant';
import { CourseModel } from '../model/course.model';
@Component({
  selector: 'edit-course-dialog',
  templateUrl: 'edit-course-dialog.html',
  styleUrls: ['./edit-course-dialog.css']
})
export class EditCourseDialog implements OnInit {
  editCourseResponseData;
  editCourseRequestDataBackup;
  constructor(
    public dialogRef: MatDialogRef<EditCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public editCourseRequestData: CourseModel
  ) {}

  ngOnInit() {
    this.editCourseRequestDataBackup = { ...this.editCourseRequestData };
  }

  onNoClick(): void {
    this.editCourseResponseData = {
      responseType: CommonConstant.EDIT_COURSE_CANCEL_TYPE,
      data: this.editCourseRequestDataBackup
    };
    this.dialogRef.close(this.editCourseResponseData);
  }
  onOkClick(): void {
    this.editCourseResponseData = {
      responseType: CommonConstant.EDIT_COURSE_UPDATE_TYPE,
      data: this.editCourseRequestData
    };
    // console.log(this.editCourseResponseData);
    this.dialogRef.close(this.editCourseResponseData);
  }
}
