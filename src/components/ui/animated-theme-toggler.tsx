import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

const Moon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const Sun = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
    </svg>
);

interface AnimatedThemeTogglerProps
    extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
}

export const AnimatedThemeToggler = ({
    className,
    duration = 400,
    ...props
}: AnimatedThemeTogglerProps) => {
    const [isDark, setIsDark] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        if (!document.startViewTransition) {
            // Fallback para browsers sem suporte a View Transitions
            const newTheme = !isDark;
            setIsDark(newTheme);
            document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = !isDark;
                setIsDark(newTheme);
                document.documentElement.classList.toggle("dark");
                localStorage.setItem("theme", newTheme ? "dark" : "light");
            });
        }).ready;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    }, [isDark, duration]);

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn(className)}
            {...props}
        >
            {isDark ? <Sun /> : <Moon />}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
