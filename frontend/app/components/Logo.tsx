import Link from "next/link";

interface LogoProps {
    align?: "center" | "left";
}

export default function Logo({ align = "center" }: LogoProps) {
    return (
        <div className={align === "center" ? "text-center" : ""}>
            <Link href="/" className={`flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
                <img src="/pinnacle-logo.svg" alt="logo" width={50} height={50} />
                <span className="text-xl font-bold tracking-tight">Pinnacle</span>
            </Link>
        </div>
    );
}