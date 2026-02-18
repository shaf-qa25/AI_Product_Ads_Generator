"use client"
import React from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Search } from 'lucide-react'

function Hero() {
    return (
        <div className='flex flex-col items-center justify-center mt-24 px-5 md:px-20 gap-8'>
            <div className='text-center space-y-4'>
                <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight'>
                    Learn Smarter with <span className='text-primary'>AI</span>
                </h2>
                <p className='text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto'>
                    Turn any complex topic into an easy-to-understand video or story in seconds.
                    Power up your learning journey.
                </p>
            </div>

            <div className="w-full max-w-2xl p-2 shadow-xl rounded-xl border bg-card">
                <InputGroup className="border-none shadow-none">
                    <InputGroupTextarea
                        data-slot="input-group-control"
                        className="flex min-h-[80px] w-full resize-none bg-transparent px-4 py-3 text-lg outline-none border-none focus-visible:ring-0"
                        placeholder="What do you want to learn today?"
                    />
                    <InputGroupAddon align="block-end" className="p-2">
                        <InputGroupButton
                            className="rounded-lg px-6 py-5 h-auto text-md font-semibold transition-all hover:scale-105"
                            variant="default"
                        >
                            Generate
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <div className='flex gap-2 text-sm text-muted-foreground'>
                <span>Try:</span>
                <span className='hover:text-primary cursor-pointer underline'>Quantum Physics</span>
                <span className='hover:text-primary cursor-pointer underline'>React Hooks</span>
            </div>
        </div>
    )
}

export default Hero