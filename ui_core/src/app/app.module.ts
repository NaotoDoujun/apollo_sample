import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OverlayModule } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule, MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/Home/home/home.component';
import { ContainerListComponent } from './components/Home/container-list/container-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContainerListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OverlayModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
