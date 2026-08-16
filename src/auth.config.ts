import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Resend({
      from: process.env.EMAIL_FROM || "no-reply@gojiberry.ai",
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],
  pages: {
    signIn: "/login",
  }
}
