import { BlurFade } from "../ui/blur-fade";
import { AuroraText } from "../ui/aurora-text";
import { SparklesText } from "../ui/sparkles-text";
import { TypingAnimation } from "../ui/typing-animation";

export default function HomePage() {
    return (
        <div className="home-welcome">
            <div className="brand-logo">
                <span className="brand-line-from bevan-regular">FROM</span>
                <span className="brand-line-dev bevan-regular">
                    <SparklesText
                        sparklesCount={6}
                        colors={{ first: "#8c52ff", second: "#a855f7" }}
                    >
                        DEV
                    </SparklesText>
                </span>
                <span className="brand-line brand-line-last bevan-regular">
                    <AuroraText
                        className="brand-accent"
                        colors={["#8c52ff", "#a855f7", "#7c3aed", "#c084fc"]}
                        speed={2}
                    >
                        4
                    </AuroraText>
                    DEVS
                </span>
            </div>

            <BlurFade delay={0.3} duration={0.6} direction="up">
                <p className="home-subtitle">
                    Uma ferramenta feita{" "}
                    <TypingAnimation
                        className="home-subtitle-typing"
                        words={["por um desenvolvedor.", "para desenvolvedores."]}
                        typeSpeed={80}
                        deleteSpeed={50}
                        pauseDelay={2000}
                        delay={800}
                        loop
                        showCursor
                        cursorStyle="line"
                        cursorColor="var(--bg-accent)"
                    />
                </p>
            </BlurFade>
        </div>
    );
}
