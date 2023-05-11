import getenv from 'getenv'
import jwt from 'jsonwebtoken'

export default function verifyAuthtoken(token: string) {
  return jwt.verify(token, getenv.string('AUTH_SECRET'), {
    algorithms: ['HS512'],
  }) as AuthToken
}
