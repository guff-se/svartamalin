import { supabase } from './supabase.js'
import { getGuestId } from './state.js'

/** Gäst redo för kartanimation: har svarat ja och valt piratnamn. */
export async function isReadyForShow() {
  const id = getGuestId()
  if (!id) return false

  const { data } = await supabase
    .from('guests')
    .select('attending, pirate_name_id')
    .eq('id', id)
    .maybeSingle()

  return data?.attending === true && data.pirate_name_id != null
}
