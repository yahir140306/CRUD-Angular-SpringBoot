// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { App } from './app';

@NgModule({
  declarations: [
    // todos tus componentes van aquí
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    App
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
