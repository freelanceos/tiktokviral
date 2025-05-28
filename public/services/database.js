import { supabase } from '../config/supabase.js' // صحيح

// Save order to database
export const saveOrder = async (orderData) => {
    try {
        // Convert FormData to regular object if needed
        const order = orderData instanceof FormData ? {
            name: orderData.get('name'),
            email: orderData.get('email'),
            phone: orderData.get('phone'),
            payment_method: orderData.get('payment_method'),
            timestamp: new Date().toISOString()
        } : orderData;

        const { data, error } = await supabase
            .from('orders')
            .insert([order])

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error saving order:', error)
        return { success: false, error: error.message }
    }
}

// Get all orders
export const getOrders = async () => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('timestamp', { ascending: false })

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return { success: false, error: error.message }
    }
}

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error saving order:', error)
        return { success: false, error }
    }

} 