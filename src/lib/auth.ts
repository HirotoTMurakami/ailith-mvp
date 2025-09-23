import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function getSession() {
  const store = await cookies()
  // @ts-expect-error Next 15 cookies() returns ReadonlyRequestCookies; cast for iron-session compatibility
  const session = await getIronSession<SessionData>(store, sessionOptions)
  return session
}


