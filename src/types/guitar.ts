export type Guitar = {
    id : number;
    name : string
    image : string;
    description : string
    price : number
}

// HERENCIA
export type CartItem = Guitar & {

    quantity: number
}
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Utility types => hereda pero no todo, solo lo que yo le digo
// Este es un tipo utility types, hay una banda mas
export type CartItem2 = Pick<Guitar, 'id' | 'name' | 'price'> & {
    quantity: number
}

// Esto es un lookup, va a buscar al padre el id
export type GuitarID = Guitar['id']

// Omit, es lo inverso a esto, es decir, elijo que atributos omitir
