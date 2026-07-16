import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded for demo/prototype phase.
        // In production, you would hash passwords and verify against Supabase admin_users.
        const adminEmail = process.env.ADMIN_EMAIL || "admin@brandmint.ai";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "Admin", email: adminEmail };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
