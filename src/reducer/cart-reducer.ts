import { db } from "../data/db"
import type { CartItem, Guitar, GuitarID } from "../types/guitar"

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export type CartActions = 
    { type: 'add-to-cart',      payload: {item: Guitar} } |
    { type: 'remove-from-cart', payload: {id: GuitarID} } |
    { type: 'change-quantity',  payload: {id: GuitarID, quantity: number} } |
    { type: 'clear-cart' }

export type CartState = {
    data: Guitar[];
    cart: CartItem[];
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : [] 
}

export const initialState: CartState = {
    data: db,
    cart: initialCart()
}

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === 'add-to-cart') {
        const itemExist = state.cart.find(guitar => guitar.id === action.payload.item.id)

        let updatedCart: CartItem[] = [] 

        if (itemExist ) {
            updatedCart = state.cart.map( item => {
                if(item.id === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                } else {
                    return item
                }
            })
        } else {
            const newItem: CartItem = {...action.payload.item, quantity: 1}
            updatedCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === 'remove-from-cart') {
        
        const updatedCart = state.cart.filter( item => item.id !== action.payload.id )

        return {
            ...state, 
            cart: updatedCart
        }
    }

    if (action.type === 'change-quantity') {
        const updatedCart = state.cart.map(item => {
            if (item.id === action.payload.id) {
                const newQuantity = item.quantity + action.payload.quantity;
                if (newQuantity <= MAX_ITEMS && newQuantity >= MIN_ITEMS) {
                    return {
                        ...item,
                        quantity: newQuantity
                    }
                }
            }
            return item;
        })

        return {
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === 'clear-cart') {
        return {
            ...state,
            cart: []
        }
    }

    return state
}