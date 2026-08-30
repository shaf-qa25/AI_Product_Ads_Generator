"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Zap, BookOpen } from "lucide-react"
import { SUGGESTIONS } from "@/data/constant"

export default function Hero() {
    const { user } = useUser()
    const router = useRouter()
    const [prompt, setPrompt] = useState("")
    const [type, setType] = useState<"quick" | "long">("quick")

    const handleGenerate = (selectedPrompt?: string) => {
        const finalPrompt = selectedPrompt || prompt
        if (!finalPrompt.trim()) return
        if (!user) {
            router.push(`/sign-in?returnTo=${encodeURIComponent(`/generate?prompt=${encodeURIComponent(finalPrompt)}&type=${type}`)}`)
            return
        }
        router.push(`/generate?prompt=${encodeURIComponent(finalPrompt)}&type=${type}`)
    }

    return (
        <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden flex flex-col items-center justify-center px-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/10 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Sparkles size={12} />
                        AI-Powered Learning
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6"
                >
                    Learn Anything
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        In Minutes
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed mb-12"
                >
                    Type any topic and get a beautifully crafted, animated lesson
                    in seconds. Powered by AI, designed for deep understanding.
                </motion.p>

                {/* Prompt Input + Type Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="w-full max-w-2xl mb-16"
                >
                    <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                            placeholder="e.g. Explain Quantum Physics to a 5-year-old"
                            className="flex-1 bg-transparent px-5 py-3.5 text-white placeholder-zinc-600 text-sm font-medium outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <div className="flex bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setType("quick")}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        type === "quick"
                                            ? "bg-white/10 text-white"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    <Zap size={12} /> Quick
                                </button>
                                <button
                                    onClick={() => setType("long")}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        type === "long"
                                            ? "bg-white/10 text-white"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    <BookOpen size={12} /> Deep
                                </button>
                            </div>
                            <button
                                onClick={() => handleGenerate()}
                                disabled={!prompt.trim()}
                                className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-2"
                            >
                                Generate <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Suggestion Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    id="examples"
                    className="w-full max-w-4xl"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
                        Try a topic
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {SUGGESTIONS.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.7 + index * 0.08 }}
                                onClick={() => handleGenerate(suggestion.prompt)}
                                className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all text-left flex flex-col gap-3"
                            >
                                <span className="text-2xl">{suggestion.icon}</span>
                                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors leading-snug">
                                    {suggestion.title}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent z-10 pointer-events-none" />
        </div>
    )
}
