import Link from "next/link";

export default function Logo() {
    return (
        <>
            <div className="text-center">
                <Link href="/" className="flex items-center justify-center gap-2">
                        <img src="/pinnacle-logo.svg" alt="logo" width={50} height={50} />
                        <span className="text-xl font-bold tracking-tight">StrategyForge</span>
                    </Link>
            </div>

        </>
    )
}