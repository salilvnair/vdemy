import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatExpansionModule,
  MatGridListModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatChipsModule,
  MatSnackBarModule,
  MatProgressSpinnerModule
} from '@angular/material';

const NG_MAT_IMPORT_EXPORT_ARRAY = [
  MatButtonModule,
  MatExpansionModule,
  MatGridListModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatChipsModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, NG_MAT_IMPORT_EXPORT_ARRAY],
  exports: [BrowserAnimationsModule, BrowserModule, NG_MAT_IMPORT_EXPORT_ARRAY]
})
export class MaterialModule {}
