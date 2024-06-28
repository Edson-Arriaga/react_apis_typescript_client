import { z } from 'zod'
import axios from 'axios'
import { DraftProductSchema, ProductsSchema, Product, ProductSchema } from "../types"
import { toBoolean } from '../utils'


type ProductData = {
    [k: string]: FormDataEntryValue
}

export async function addProduct (data: ProductData){
    try {
        const result = DraftProductSchema.safeParse({
            name: data.name,
            price: +data.price
        })
        if (result.success){
            const url = `${import.meta.env.VITE_API_URL}/api/products`
            await axios.post(url, {
                name: result.data.name,
                price: result.data.price
            })
        } else {
            throw new Error('Not valid data.')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProducts(){
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products`
        const { data } = await axios(url)
        const result = ProductsSchema.safeParse(data.data)
        if(result.success) {
            return result.data
        } else {
            throw new Error('Error...')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProductById(id : Product['id']){
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        const { data } = await axios(url)
        const result = ProductSchema.safeParse(data.data)
        if(result.success) {
            return result.data 
        } else {
            throw new Error('Error...')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateProduct(data : ProductData, id : Product['id']){
    try {
        const NumberSchema = z.coerce.number()
        const {data : price} = NumberSchema.safeParse(data.price)

        const result = ProductSchema.safeParse({
            id,
            name: data.name,
            price: price,
            availability: toBoolean(data.availability.toString())
        })
        
        if(result.success){
            console.log(typeof result.data.availability)
            const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
            await axios.put(url, result.data)
        } else {
            console.log("valio...")
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteProduct(id : Product['id']){
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error)
    }
}

export async function updateProductAvailability(id : Product['id']){
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.patch(url)
    } catch (error) {
        console.log(error)
    }
}