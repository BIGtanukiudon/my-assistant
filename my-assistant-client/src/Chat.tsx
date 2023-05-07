type Props = {
  role: string;
  content: string;
};

const Chat: React.FC<Props> = ({ role, content }) => {
  return (
    <div>
      <p>
        <span>{role}</span>: {content}
      </p>
    </div>
  );
};

export default Chat;
