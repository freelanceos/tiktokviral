import { supabase } from '../config/supabase'

// Save order to database
export const saveOrder = async (orderData) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    name: orderData.name,
                    email: orderData.email,
                    phone: orderData.phone,
                    payment_method: orderData.payment,
                    timestamp: new Date().toISOString()
                }
            ])

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
        console.error('Error fetching order:', error)
        return { success: false, error: error.message }
    }
} 