// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // ← para hacer peticiones HTTP
import { FormsModule } from '@angular/forms'; // ← para [(ngModel)] en el formulario

import { App } from './app';

@NgModule({
  declarations: [
    // todos tus componentes van aquí
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // ← SIN ESTO no funcionan las peticiones al backend
    FormsModule,
    App,
    // ← SIN ESTO no funciona el formulario
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
