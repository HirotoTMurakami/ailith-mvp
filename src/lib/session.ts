import { SessionOptions } from 'iron-session'

export interface SessionData {
  user?: { id: string; username: string }
}

export const sessionOptions: SessionOptions = {
  cookieName: 'ailith_session',
  password: process.env.SESSION_SECRET || 'dev-secret-change-me-dev-secret-change-me-0123456789',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}


