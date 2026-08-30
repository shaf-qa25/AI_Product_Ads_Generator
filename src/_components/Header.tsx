"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function Header() {
    const { user } = useUser()
    const router = useRouter()

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl bg-[#030303]/70 border-b border-white/5"
        >
            {/* Logo */}
            <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => router.push("/")}
            >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-white font-black text-sm tracking-[0.15em] uppercase">
                    StoryGen
                </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
                <a
                    href="#features"
                    className="text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    Features
                </a>
                <a
                    href="#examples"
                    className="text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    Examples
                </a>
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
                {user ? (
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105"
                    >
                        Dashboard
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => router.push("/sign-in")}
                            className="text-zinc-400 hover:text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => router.push("/sign-up")}
                            className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105"
                        >
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </motion.header>
    )
}
