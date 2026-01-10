import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const bucket = 'asr-audio'
const path = `users/local-user/recordings/test-${Date.now()}.wav`
const fileBuffer = fs.readFileSync('test.wav')

const { data, error } = await supabase.storage
  .from(bucket)
  .upload(path, fileBuffer, {
    contentType: 'audio/wav',
    upsert: false,
  })

if (error) {
  console.error('UPLOAD ERROR:', error)
  process.exit(1)
}

console.log('UPLOAD OK:', data)

const { data: signed, error: signErr } = await supabase.storage
  .from(bucket)
  .createSignedUrl(path, 60)

if (signErr) {
  console.error('SIGNED URL ERROR:', signErr)
  process.exit(1)
}

console.log('SIGNED URL:', signed.signedUrl)
