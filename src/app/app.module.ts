import { LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { FormsModule } from '@angular/forms'

import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { HistorialComponent } from './historial/historial.component'

registerLocaleData(localeEs)

@NgModule({
  declarations: [AppComponent, HistorialComponent],
  imports: [BrowserModule, FormsModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: 'NUMBER_FORMATS',
      useValue: { decimal: ',', thousands: '.' },
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
