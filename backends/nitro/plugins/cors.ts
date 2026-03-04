import cors from 'cors'
import { trustedOrigins } from '../utils/trusted-origins'

export default defineNitroPlugin((nitroApp) => {
  const allowedOrigins = [...trustedOrigins()]
  nitroApp.h3App.use(
    fromNodeMiddleware(
      cors({
        origin: allowedOrigins.length > 0
          ? allowedOrigins
          : false,
        credentials: true,
      }),
    ),
  )
})
