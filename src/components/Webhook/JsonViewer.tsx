import { useMemo, type ReactElement } from "react";
import "./JsonViewer.css";

interface JsonViewerProps {
    content: string;
    maxHeight?: string;
}

interface JsonToken {
    type: "key" | "string" | "number" | "boolean" | "null" | "punctuation";
    value: string;
}

function tokenizeJson(content: string): JsonToken[] {
    const tokens: JsonToken[] = [];

    try {
        // Try to parse and format JSON
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);

        // Regex to match JSON tokens (including empty strings)
        const regex = /"([^"]*)"(?=\s*:)|"([^"]*)"|(-?\d+\.?\d*)|true|false|null|[{}[\],:]/g;
        let match;

        while ((match = regex.exec(formatted)) !== null) {
            const value = match[0];

            if (value === "{" || value === "}" || value === "[" || value === "]" || value === "," || value === ":") {
                tokens.push({ type: "punctuation", value });
            } else if (match[1] !== undefined) {
                // Matched key (before colon)
                tokens.push({ type: "key", value: `"${match[1]}"` });
            } else if (match[2] !== undefined) {
                // Matched string value
                tokens.push({ type: "string", value: `"${match[2]}"` });
            } else if (match[3]) {
                // Matched number
                tokens.push({ type: "number", value: match[3] });
            } else if (value === "true" || value === "false") {
                tokens.push({ type: "boolean", value });
            } else if (value === "null") {
                tokens.push({ type: "null", value });
            }
        }

        return tokens;
    } catch {
        // Not valid JSON, return as plain text
        return [{ type: "string", value: content }];
    }
}

function formatTokensToJsx(tokens: JsonToken[]): ReactElement {
    let indentLevel = 0;
    const lines: ReactElement[] = [];
    let currentLine: ReactElement[] = [];
    let lineIndex = 0;

    const addLine = () => {
        if (currentLine.length > 0) {
            lines.push(
                <div key={lineIndex} className="json-line">
                    {currentLine}
                </div>
            );
            currentLine = [];
            lineIndex++;
        }
    };

    const addIndent = () => {
        currentLine.push(
            <span key={`indent-${lineIndex}-${currentLine.length}`} className="json-indent">
                {"  ".repeat(indentLevel)}
            </span>
        );
    };

    tokens.forEach((token, idx) => {
        if (token.value === "{" || token.value === "[") {
            currentLine.push(
                <span key={idx} className="json-punctuation">
                    {token.value}
                </span>
            );
            addLine();
            indentLevel++;
        } else if (token.value === "}" || token.value === "]") {
            addLine();
            indentLevel--;
            addIndent();
            currentLine.push(
                <span key={idx} className="json-punctuation">
                    {token.value}
                </span>
            );
        } else if (token.value === ",") {
            currentLine.push(
                <span key={idx} className="json-punctuation">
                    {token.value}
                </span>
            );
            addLine();
        } else if (token.value === ":") {
            currentLine.push(
                <span key={idx} className="json-punctuation">
                    {token.value}{" "}
                </span>
            );
        } else {
            if (currentLine.length === 0) {
                addIndent();
            }
            currentLine.push(
                <span key={idx} className={`json-${token.type}`}>
                    {token.value}
                </span>
            );
        }
    });

    addLine();

    return <>{lines}</>;
}

export default function JsonViewer({ content, maxHeight = "300px" }: JsonViewerProps) {
    const formatted = useMemo(() => {
        if (!content || content.trim() === "") {
            return <span className="json-empty">(vazio)</span>;
        }

        const tokens = tokenizeJson(content);

        // If it's just one token and it's a string (invalid JSON), display as plain text
        if (tokens.length === 1 && tokens[0].type === "string") {
            return <span className="json-plain">{content}</span>;
        }

        return formatTokensToJsx(tokens);
    }, [content]);

    return (
        <pre className="json-viewer" style={{ maxHeight }}>
            <code>{formatted}</code>
        </pre>
    );
}
