import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import fetchWrapper from "@/utils/fetchWrapper";
import {JWT} from "next-auth/jwt";

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
                    console.log("Attempting signin with:", credentials.email);

                    const res = await fetchWrapper.post("/auth/signin", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    console.log("Backend response:", res);

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

                    console.log("Authentication failed: no user or token");
                    return null;
                } catch (e: any) {
                    console.error("Authorization error:", e);
                    console.error("Error response:", e.response?.data);
                    // Return a more specific error message
                    throw new Error(e.response?.data?.message || e.message || "Authentication Error");
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
