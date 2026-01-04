import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {authAPI} from "@/utils/fetchWrapper";
import {JWT} from "next-auth/jwt";
import {AuthResponse} from "@/app/types/outcomeTypes";

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async function (credentials: any) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Invalid Credentials");
                }

                try {

                    const res = await authAPI.post<AuthResponse>("/auth/signin", {
                        email: credentials.email,
                        password: credentials.password,
                    });


                    const user = res.user;

                    if (user && res.token) {
                        console.log("User authenticated successfully:", user);
                        return {
                            id: user.id,
                            email: user.email,
                            company: user.company,
                            name: user.name,
                            accessToken: res.token,
                        };
                    }

                    return null;
                } catch (e: any) {


                    // NextAuth swallows custom errors - this is a known issue
                    // Throwing here just results in "credentials" error
                    throw new Error(e.message || "Authentication failed");
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, user}: { user: any; token: JWT }) {
            if (user) {
                token.accessToken = user.accessToken;  // ✓ Fixed: use user.accessToken
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}: { session: any; token: JWT }) {
            session.user.id = token.id as string;
            session.accessToken = token.accessToken as string;
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",  // ✓ Fixed typo: signIn (capital I)
    },
    session: {
        strategy: "jwt" as const,  // ✓ Added 'as const' for TypeScript
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
