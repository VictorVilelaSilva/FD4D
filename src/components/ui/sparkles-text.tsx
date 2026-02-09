"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, memo, CSSProperties } from "react";

interface Sparkle {
    id: string;
    x: string;
    y: string;
    color: string;
    delay: number;
    scale: number;
}

interface SparklesTextProps {
    children: React.ReactNode;
    className?: string;
    sparklesCount?: number;
    colors?: {
        first: string;
        second: string;
    };
    style?: CSSProperties;
}

const Sparkle = memo(({ sparkle }: { sparkle: Sparkle }) => {
    return (
        <motion.svg
            key={sparkle.id}
            className="pointer-events-none absolute z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0, sparkle.scale, 0],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut",
            }}
            style={{
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.scale * 16,
                height: sparkle.scale * 16,
            }}
            viewBox="0 0 160 160"
            fill="none"
        >
            <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill={sparkle.color}
            />
        </motion.svg>
    );
});

Sparkle.displayName = "Sparkle";

export function SparklesText({
    children,
    className,
    sparklesCount = 10,
    colors = { first: "#8c52ff", second: "#a855f7" },
    ...props
}: SparklesTextProps) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    const generateSparkle = useCallback((): Sparkle => {
        return {
            id: `${Date.now()}-${Math.random()}`,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            color: Math.random() > 0.5 ? colors.first : colors.second,
            delay: Math.random() * 2,
            scale: Math.random() * 0.6 + 0.4,
        };
    }, [colors.first, colors.second]);

    useEffect(() => {
        const initialSparkles = Array.from({ length: sparklesCount }, generateSparkle);
        setSparkles(initialSparkles);
    }, [sparklesCount, generateSparkle]);

    return (
        <span
            className={cn("relative inline-block", className)}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <Sparkle key={sparkle.id} sparkle={sparkle} />
                ))}
            </AnimatePresence>
        </span>
    );
}
