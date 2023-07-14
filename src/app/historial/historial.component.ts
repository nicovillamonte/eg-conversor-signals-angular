import { Component, Input, signal } from '@angular/core'
import { Conversion } from 'src/DTO/conversion'

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent {
  @Input('conversaciones') listaConversiones = signal<Conversion[]>([])

  delete(index: number) {
    this.listaConversiones.mutate((lista) => lista.splice(index, 1))
  }
}
