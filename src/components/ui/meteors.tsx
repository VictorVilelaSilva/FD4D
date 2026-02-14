"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
    number?: number
    minDelay?: number
    maxDelay?: number
    minDuration?: number
    maxDuration?: number
    angle?: number
    className?: string
}

export const Meteors = ({
    number = 30,
    minDelay = 0.2,
    maxDelay = 2.2,
    minDuration = 20,
    maxDuration = 50,
    angle = 205,
    className,
}: MeteorsProps) => {
    const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
        []
    )

    useEffect(() => {
        // Calcular offset baseado no ângulo para cobrir toda a tela
        const angleRad = (angle * Math.PI) / 180
        const offsetX = Math.abs(Math.tan(angleRad) * window.innerHeight)
        const totalWidth = window.innerWidth + offsetX

        const styles = [...new Array(number)].map(() => ({
            "--angle": -angle + "deg",
            top: "-10%",
            left: `calc(0% + ${Math.floor(Math.random() * totalWidth)}px)`,
            animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
            animationDuration:
                Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
                "s",
        }))
        setMeteorStyles(styles)
    }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

    return (
        <>
            {[...meteorStyles].map((style, idx) => (
                // Meteor Head
                <span
                    key={idx}
                    style={{ ...style }}
                    className={cn(
                        "animate-meteor pointer-events-none absolute size-0.5 rotate-[var(--angle)] rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
                        className
                    )}
                >
                    {/* Meteor Tail */}
                    <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-transparent" />
                </span>
            ))}
        </>
    )
}
