import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  return session
}


