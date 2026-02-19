"use client"
import React, { useState } from 'react' // Hooks add kiye
import { Send } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Suggestion, SUGGESTIONS } from '@/data/constant'

function Hero() {
    // State handle karne ke liye
    const [userInput, setUserInput] = useState<string>("");

    return (
        <div className='flex flex-col items-center justify-center mt-24 px-5 md:px-20 gap-8'>
            <div className='text-center space-y-4'>
                <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight'>
                    Learn Smarter with <span className='text-primary'>AI</span>
                </h2>
                <p className='text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto'>
                    Turn any complex topic into an easy-to-understand video or story in seconds.
                </p>
            </div>

            {/* Input Box */}
            <div className="w-full max-w-2xl relative p-1 shadow-2xl rounded-2xl border bg-card">
                <textarea
                    className="flex min-h-[140px] w-full resize-none bg-transparent px-4 py-4 text-lg outline-none border-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    placeholder="What do you want to learn today?"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="pointer-events-auto">
                        <Select defaultValue="course">
                            <SelectTrigger className="w-[160px] bg-background border-none shadow-sm h-9">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="course">Full-Course</SelectItem>
                                    <SelectItem value="video">Quick-Explain</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pointer-events-auto">
                        <button
                            className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                            onClick={() => console.log("Sending:", userInput)}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Suggestions List */}
            <div className='flex flex-wrap items-center justify-center gap-2 max-w-2xl'>
                <span className='text-sm text-muted-foreground mr-1'>Try:</span>
                {SUGGESTIONS.map((item: Suggestion) => (
                    <button
                        key={item.id}
                        onClick={() => setUserInput(item.prompt)}
                        className="text-xs font-medium bg-secondary/50 hover:bg-secondary border px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
                    >
                        <span>{item.icon}</span>
                        {item.title}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Hero