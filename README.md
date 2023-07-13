# Ejemplo Conversor - Signals Angular

![Angular Signals Completo](https://github.com/nicovillamonte/eg-conversor-signals-angular/assets/64659720/5bc83628-8e8d-467a-bde8-c673a7336cd5)

En este ejemplo se muestra como crear un conversor de millas a kilometros utilizando el framework Angular en su version 16, en la que podemos aplicar los `signals`.

### ZoneJS
Anteriormente a la version 16, siempre se utilizaba `zonejs` para detectar los cambios en los componentes.

Cuando se producia una cambio en la aplicacion era detectado por zonejs y se activaba la deteccion de cambios en los componentes. En ese momento Angular comienza a recorrer todos los componentes del arbol de componentes y comienza a verificar si hay cambios en los estados de los mismos que afectana la vista, si los hay, se actualizan en la vista.

### Problema
El problema que se presentaba con esta forma de deteccion de cambios es que se recorrian todos los componentes del arbol de componentes, sin importar si habia cambios o no en los mismos. Esto generaba un consumo de recursos innecesario. Por lo que viene **super signals** a solucionar este problema.


# Signals al rescate

> Los signals permiten la creación de relaciones reactivas entre datos esto quiere decir que cuando un valor cambia, los valores que dependen de él también son notificados y se actualizan automáticamente.

Los signals se basan en el concepto de `Producers` y `Consumers`. En el que los producers son los que emiten los cambios y los consumers son los que reciben los cambios sin la necesidad de recorrer todo el arbol en busca de donde se produjo el cambio.

## Creacion de un signal

El proceso de crear un signal es muy simple. Solo debemos asignar a una variable el resultado de la funcion `signal` y pasarle como parametro el valor inicial del mismo.

``` typescript
millas = signal(0);
```

## Consumir un signal

La forma de obtener el valor de un signal tambien es muy sencilla, solamente hay que llamar a millas como si fuera un getter.

``` typescript
millas()
```

Por ejemplo, podemos utilizarlo en el HTML de la siguiente forma:

``` html
<div class="unidad">millas()</div>
```

Desde aqui vamos a poder manejarlo de la misma manera que haciamos con otros parametros de los componentes. Por ejemplo aplicandoles pipes.

``` html
<div class="unidad">{{millas() | number: '1.1-2':'es-ES'}}</div>
```

## Emitir un signal (Producers)

Para emitir un signal, debemos hacer un cambio en el valor del mismo. Para esto tenemos 3 opciones diferentes:

### Set

Para setear un valor _x_ en el signal, debemos llamar a la funcion `set` del mismo y pasarle como parametro el nuevo valor.

``` typescript
millas.set(53);
```

### Update

Para actualizar un valor _x_ en el signal, debemos llamar a la funcion `update` del mismo y pasarle como parametro una funcion que recibe como parametro el valor actual del signal y retorna el nuevo valor.

``` typescript
millas.update((x) => x + 1);
```

### Mutate

En el caso de que el valor del signal sea un objeto o un array, es decir, estados mutables, podemos utilizar la funcion `mutate` para modificar el valor interno del mismo.

``` typescript
listaConversiones = signal<Conversion[]>([]);

this.listaConversiones.mutate((lista) =>
  lista.push({ millas, kilometros })
);
```

## Consumir un signal (Consumers)

Ademas del `getter` que se utiliza en los signals para consumirlos. Existen otras dos formas diferentes de consumir un cambio emitido con alguno de los 3 metodos anteriores.

### Computed

La funcion `computed` nos permite crear un signal que depende de otros signals. Es decir, que cuando alguno de los signals que dependen de el cambia, el signal `computed` tambien cambia.

``` typescript
kilometros = computed(() => millas() * 1.60934);
``` 
En este caso, cuando cambie el signal de millas, tambien va a cambiar el signal de kilometros utilizando el getter de millas y aplicandole la formula de conversion.

Podemos hacer cualquier tipo de operacion que nos devuelva un valor dentro de la funcion de computed. Lo mas importante de todo esto es que podemos utilizar un computed como condicional que solamente vamos a obtener una emicion de su valor cuando esa condicion cambie, por ejemplo:

``` typescript
valido = computed(() => millas() > 0);
```

En este caso estamos haciendo una validacion de que el valor de millas sea mayor a 0. Si esto se cumple, el signal `valido` va a emitir un valor `true`, en caso contrario va a emitir un valor `false`. Pero mientras no se cumpla, aunque pasemos por los valores -5, -4, -3, -2 y -1, habiendo cambiado el valor 4 veces, el signal no va a emitir un cambio hasta que el valor de millas sea mayor a 0, recien ahi vamos a obtener un cambio en el signal `valido` y lo vamos a poder consumir. Esto tiene un alto potencial.

### Effect

La funcion `effect` se llama siempre en el constructor del componente y le podemos definir una funcion en su interior. Esa funcion se va a ejecutar cada vez que se produzca un cambio en alguno de los signals que se encuentren dentro de la misma.

``` typescript
effect(() => {
  console.log(millas());
});
```

En este caso cada vez que se cambien las millas se realizara un `console.log` con el nuevo valor.
<br>
Con esto podemos probar lo que deciamos del computed anteriormente. Vamos a hacer un computed signal que nos emita una señal cuando las millas cambien de decimal a entero y viceversa.

``` typescript
isDecimal = computed(() => Number(this.millas().toFixed(2)) % 1 !== 0);

constructor() {
  effect(() => {
    // Veremos como esto se llama solamente cuando cambia el valor de isDecimal
    console.log(this.isDecimal() ? 'Es Decimal' : 'Es Entero');
  });
}
```

Ese console.log se va a ejecutar solamente cuando cambie el valor de isDecimal, es decir, cuando las millas cambien de decimal a entero o viceversa.

<br>
Otro caso interesante es la comunicacion entre componentes padre e hijo. Si obtenemos el valor del signal en el componente hijo y lo modificamos desde ahi, entonces se va a emitir el cambio en el signal y se va a actualizar el valor en el componente padre.

Componente hijo:
``` typescript
export class ComponenteHijo {
  @Input('conversaciones') listaConversiones = signal<Conversion[]>([]);

  delete(index: number) {
    this.listaConversiones.mutate((lista) => lista.splice(index, 1));
  }
}
```

Componente padre:
``` typescript
export class ComponentePadre {
  // Lista de conversiones guardadas
  listaConversiones = signal<Conversion[]>([]);

  constructor() {
    effect(() => {
      // Este effect se va a ejecutar tanto desde los cambios de listaConversiones en este componente como en el componente hijo
      console.log(
        'Se hizo un cambio en lista conversiones',
        this.listaConversiones()
      );
    });
  }
}
```

HTML del componente padre:
``` html
  <app-componente-hijo [conversaciones]="listaConversiones"></app-componente-hijo>
```

En este caso, cuando se borre un item del signal pasado al componente hijo en el mismo, se va a emitir un cambio en el signal y se va a actualizar el valor en el componente padre. Por lo que se va a llamar al effect y podra ver en la consola del navegador. 


# Conclusion

A simple vista el `signal` no cambia nada en la interfaz grafica. Pero hace que la misma sea mucho mas eficiente en la deteccion de cambios, lo que se traduce en un mejor rendimiento de la aplicacion en comparacion con `ZoneJS`.

Anteriormente existia la posibilidad de hacer algo parecido con `BehaviorSubject` de `RxJS`, pero no era tan sencillo de implementar como lo es con los `signals`, ademas de que utiliza observables, lo que nos obliga a ser cuidadosos con las suscripciones y desuscripciones de los mismos.

En este ejemplo se ven todos los casos de uso posibles de signals:

![Ejemplo Signals Angular](https://github.com/nicovillamonte/eg-conversor-signals-angular/assets/64659720/3ec59773-db17-44d6-a4ac-82fdc98b77bf)


### Fuente
[Introducción a Signals en Angular 16 - Rubén Yáñez Agelán](https://www.adictosaltrabajo.com/2023/06/23/introduccion-a-signals-en-angular-16/)
