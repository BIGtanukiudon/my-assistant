import { useMemo } from "react";

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
      className={`px-4 py-2 w-[500px] text-gray-700 rounded-lg text-left text-xl ${nonRound} ${bgColor} ${animateScaleUp}`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default Chat;
