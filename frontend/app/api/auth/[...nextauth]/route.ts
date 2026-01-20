import NextAuth, {NextAuthOptions} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {authAPIInternal} from "@/utils/fetchWrapper";
import {JWT} from "next-auth/jwt";
import {AuthResponse} from "@/app/types/outcomeTypes";

export const authOptions: NextAuthOptions = {
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
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Invalid Credentials");
                }

                try {
                    const res = await authAPIInternal.post<AuthResponse>("/auth/signin", {
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
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.company = user.company;
                token.accessToken = user.accessToken;
            }

            if (!token.id && token.sub) {
                token.id = token.sub;
            }

            return token;
        },

        async session({session, token}) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.company = token.company as string;
            }
            session.accessToken = token.accessToken as string;
            return session;
        }

    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug mode to see more logs
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};