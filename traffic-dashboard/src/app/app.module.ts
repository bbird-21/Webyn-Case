import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // <-- Import

import { AppComponent } from './app.component';
// Import other components/modules if you have them

@NgModule({
  declarations: [
    AppComponent
    // Add your dashboard component here later
  ],
  imports: [
    BrowserModule,
    HttpClientModule // <-- Add here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
