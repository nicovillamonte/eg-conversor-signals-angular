import localeEs from '@angular/common/locales/es'
import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { HistorialComponent } from './historial/historial.component'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { LOCALE_ID } from '@angular/core'
import { registerLocaleData } from '@angular/common'

registerLocaleData(localeEs)

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
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
  
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'eg-conversor-signals-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('eg-conversor-signals-angular')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('[data-testid="titulo"]')?.textContent).toContain('Conversor Angular con Signals')
  })
})
