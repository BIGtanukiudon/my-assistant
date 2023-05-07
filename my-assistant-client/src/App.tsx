import { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Chat from "./Chat";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { requestToOpenAi } from "./openAi";
import { generateVoice } from "./voicevox";
import { Howl } from "howler";

type MessageProps = {
  role: string;
  content: string;
};

function App() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [audioArrayBuffer, setAudioArrayBuffer] = useState<ArrayBuffer | null>(
    null
  );

  const messagesLength = useMemo(() => messages.length, [messages]);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const requestOpenAi = useCallback(
    async (contents: ChatCompletionRequestMessage[]) => {
      const data = await requestToOpenAi(contents);

      if (data !== null) {
        setMessages((preV) => [
          ...preV,
          { role: data.role, content: data.content },
        ]);
      }
    },
    [messages.toString()]
  );

  useEffect(() => {
    if (transcript !== "" && !listening) {
      const reqContents: ChatCompletionRequestMessage[] = [];

      const limitCount = messagesLength >= 3 ? 3 : messagesLength;

      for (let i = messagesLength - limitCount; i < messagesLength; i++) {
        const message = messages[i];
        const content = message.content;

        let role: ChatCompletionRequestMessageRoleEnum | null = null;

        switch (message.role) {
          case "user":
            role = ChatCompletionRequestMessageRoleEnum.User;
            break;
          case "assistant":
            role = ChatCompletionRequestMessageRoleEnum.Assistant;
            break;
          case "system":
            role = ChatCompletionRequestMessageRoleEnum.System;
            break;
          default:
            return;
        }

        if (role === null || content === "") {
          return;
        }

        reqContents.push({
          role,
          content,
        });
      }

      reqContents.push({ role: "user", content: transcript });

      setMessages((preV) => [...preV, { role: "user", content: transcript }]);

      requestOpenAi(reqContents);
    }
  }, [listening]);

  useEffect(() => {
    const reqVoicevox = async (text: string) => {
      setAudioArrayBuffer(await generateVoice(text));
    };

    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === "assistant") {
        reqVoicevox(latestMessage.content);
      }
    }
  }, [messages.toString()]);

  useEffect(() => {
    if (audioArrayBuffer !== null) {
      const arrayBufferView = new Uint8Array(audioArrayBuffer);
      const blob = new Blob([arrayBufferView], { type: "audio/wav" });
      new Howl({
        src: URL.createObjectURL(blob),
        format: ["wav"],
        autoplay: true,
      });
    }
  }, [audioArrayBuffer]);

  return (
    <>
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button
          type="button"
          onClick={() => SpeechRecognition.startListening()}
        >
          Start
        </button>
        <button type="button" onClick={() => SpeechRecognition.stopListening()}>
          Stop
        </button>
        <button type="button" onClick={() => resetTranscript()}>
          Reset
        </button>

        {messages.map((message, idx) => (
          <Chat key={idx} role={message.role} content={message.content} />
        ))}
      </div>
    </>
  );
}

export default App;
