import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  role: string;
  content: string;
};

const Chat: React.FC<Props> = ({ role, content }) => {
  const bgColor = useMemo(() => {
    switch (role) {
      case "user":
        return "bg-indigo-300";
      default:
        return "bg-gray-300";
    }
  }, [role]);

  const nonRound = useMemo(() => {
    switch (role) {
      case "user":
        return "rounded-br-none";
      default:
        return "rounded-bl-none";
    }
  }, [role]);

  const animateScaleUp = useMemo(() => {
    switch (role) {
      case "user":
        return "animate-scale-up-hor-right";
      default:
        return "animate-scale-up-hor-left";
    }
  }, [role]);

  return (
    <div
      className={`px-4 py-2 w-[500px] text-gray-700 rounded-lg text-left text-base ${nonRound} ${bgColor} ${animateScaleUp}`}
    >
      <ReactMarkdown
        children={content}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, "")}
                style={vscDarkPlus}
                language={
                  match !== null && match.length >= 1 ? match[1] : undefined
                }
                PreTag="div"
                wrapLongLines={true}
                codeTagProps={{ className: "text-base" }}
              />
            ) : (
              <code {...props} className="inline-code">
                {children}
              </code>
            );
          },
          ul({ children }) {
            return <ul className="list-disc px-5 my-0">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal px-5 my-0">{children}</ol>;
          },
        }}
        className="whitespace-pre-wrap"
      />
    </div>
  );
};

export default Chat;
