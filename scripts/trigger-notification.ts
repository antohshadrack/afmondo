import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function triggerNotification() {
    console.log('Inserting test order to trigger admin notification...')

    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            status: 'pending',
            total: 100,
            delivery_name: 'Test Test (Notification Trigger)',
        })
        .select()
        .single()

    if (orderError) {
        console.error('❌ Orders Insert failed:', orderError.message)
        return
    }

    console.log('✅ Success! Order inserted. You should hear the chime in your admin panel now.', orderData.id)
}

triggerNotification()
