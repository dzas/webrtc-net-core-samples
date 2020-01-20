import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RtcDemoModule } from './material-module';

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
    RtcDemoModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'local', component: LocalComponent },
    ])
  ],
  providers: [NavigatorRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
