import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LocalComponent } from './local/local.component';
import { NavigatorRef } from './navigator-ref/navigator-ref';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LocalComponent
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'local', component: LocalComponent },
    ])
  ],
  providers: [NavigatorRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
