import { IronSessionOptions } from 'iron-session'

export interface SessionData {
  user?: { id: string; username: string }
}

export const sessionOptions: IronSessionOptions = {
  cookieName: 'ailith_session',
  password: process.env.SESSION_SECRET || 'dev-secret-change-me',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}


