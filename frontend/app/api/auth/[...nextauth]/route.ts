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

                    const user = res.data.user;

                    if (user && res.data.token) {
                        return {
                            id: user.id,
                            email: user.email,
                            company: user.company,
                            name: user.name,
                            accessToken: res.data.token,
                        };
                    }

                    return null;
                } catch (e: any) {
                    if (e.getFirstError) {
                        throw new Error(e.getFirstError());
                    }
                    throw new Error(e.message || "Authentication failed");
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, user, account}: { user: any; token: JWT; account: any }) {
            // Initial sign in
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
                token.company = user.company;
            }
            return token;
        },
        async session({session, token}: { session: any; token: JWT }) {
    console.log("Session callback - token:", token);
    if (token) {
        session.user.id = token.id;
        session.user.company = token.company;
        session.accessToken = token.accessToken;
    }
    console.log("Session callback - session:", session);
    return session;
}
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};