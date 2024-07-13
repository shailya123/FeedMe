import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "Password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err) {
          throw new Error("error");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id ?? "";
        session.user.isVerified = token.isVerified ?? false;
        session.user.isAcceptingMessages = token.isAcceptingMessages ?? false;
        session.user.username = token.username ?? "";
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account && account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser =
            profile &&
            profile.email &&
            (await UserModel.findOne({ email: profile?.email }));
            if (existingUser) {
            user.name=existingUser?.username;
            user.username=existingUser?.username;
            user.isVerified=existingUser?.isVerified;
            user._id=existingUser?._id;
            user.image=existingUser?.profileImg??user.image
            return true;
          }
          return false;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      return true;
    },
  },
};
