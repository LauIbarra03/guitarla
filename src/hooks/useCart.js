import { useState, useEffect, useMemo } from "react"
import { db } from '../data/db'

// ESTOS CUSTOMS HOOKS FUNCIONAN COMO UNA INSTANCIA DE UNA CLASE -> HAY QUE USARLO COMO UN SINGELTON, SOLO UNA INSTANCIA, PQ SINO VAN A ESTAR DESFASADO
// SI LLAMO DOS VECES A ESTE FUNCION  ES COMO SI TUVIERA DOS OBJETOS DE ESTA CLASE CON ESTADOS INTERNOS DISTITNOS
export default function useCart() {
    // El state de react es ASINCRONO, no sigue una secuencia lineal, esto se hace para q tenga mejor rendimiento. Si fuese secuencial haria que no pueda seguir usando
    // la pagina hasta que se haya terminado de hacer lo anterior.  
    // El estado no se actualiza indmediatamente
    const MAX_ITEMS = 5
    const MIN_ITEMS = 0

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : [] 
    }

    const [data, setData] = useState([])
    const [cart, setCart] = useState(initialCart)

    useEffect( () => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    

    // Asi lo haria con una API
    useEffect(() => {
        setData(db)
    }, [])

    function addToCart(item) {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist < 0) {
            item.quantity = 1
            setCart([...cart, item])
        } else {
            if(cart[itemExist].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++
            setCart(updatedCart)
        }
    }   
    
    function changeQuantity(id, quantity) {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + quantity;
                if (newQuantity <= MAX_ITEMS && newQuantity > MIN_ITEMS) {
                    return {
                        ...item,
                        quantity: newQuantity
                    }
                }
            }
            return item;
        })
        setCart(updatedCart)
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)) 
    }

    function clearCart() {
        setCart([])
    }
    
    // State derivado
    // el useMemo es para indicar que no ejecute ese codigo si no cambia el carrito (lo que le pase)
    // cachea los componentes => no es producente hacerlo en todos lados
    const isEmpty   = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce( (total, item) => total + (item.quantity * item.price), 0, [cart]))

    return {
        data, 
        cart,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
        isEmpty,
        cartTotal
    }
}
