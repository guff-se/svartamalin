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

/** Gäst har lämnat besked: tackat nej, eller tackat ja + valt piratnamn. */
export async function hasGivenAnswer() {
  const id = getGuestId()
  if (!id) return false

  const { data } = await supabase
    .from('guests')
    .select('attending, pirate_name_id')
    .eq('id', id)
    .maybeSingle()

  if (!data || data.attending === null) return false
  if (data.attending === false) return true
  return data.pirate_name_id != null
}
