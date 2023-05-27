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
import { healthCheck, generateVoice } from "./voicevox";
import { Howl } from "howler";
import { ReactComponent as Mic } from "./assets/mic.svg";
import { ReactComponent as MicOff } from "./assets/mic_off.svg";
import { ReactComponent as VolumeUp } from "./assets/volume_up.svg";
import { ReactComponent as VolumeOff } from "./assets/volume_off.svg";
import { useScroll } from "./hooks/scroll";
import { useHotkeys } from "react-hotkeys-hook";

type MessageProps = {
  role: string;
  content: string;
};

const CHAT_AREA_ID = "chat-area";

function App() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [audioArrayBuffer, setAudioArrayBuffer] = useState<ArrayBuffer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [enableVoicevox, setEnableVoicevox] = useState(false);
  const [isVoicevoxOn, setIsVoicevoxOn] = useState(true);

  useEffect(() => {
    const f = async () => {
      setEnableVoicevox(await healthCheck());
    };

    f();
  }, []);

  const messagesLength = useMemo(() => messages.length, [messages]);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const requestOpenAi = useCallback(
    async (contents: ChatCompletionRequestMessage[]) => {
      setIsLoading(true);

      const data = await requestToOpenAi(contents);

      if (data !== null) {
        setMessages((preV) => [
          ...preV,
          { role: data.role, content: data.content },
        ]);
      }

      setIsLoading(false);
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

      resetTranscript();
    }
  }, [listening]);

  const requestGenerateVoicevox = useCallback(async (text: string) => {
    const arrayBuffer = await generateVoice(text);
    if (arrayBuffer !== null) {
      setAudioArrayBuffer(arrayBuffer);
    } else {
      setEnableVoicevox(false);
    }
  }, []);

  useEffect(() => {
    if (enableVoicevox && isVoicevoxOn) {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role === "assistant") {
          requestGenerateVoicevox(latestMessage.content);
        }
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

  const { scrollDownToTargetElement } = useScroll();
  useEffect(() => {
    scrollDownToTargetElement(CHAT_AREA_ID);
  }, [messages.toString()]);

  useHotkeys("shift+r", () => SpeechRecognition.startListening());
  useHotkeys("shift+s", () => SpeechRecognition.stopListening());

  return (
    <>
      <div className="flex flex-col gap-2 content-center scroll-smooth">
        {messages.length > 0 && (
          <div
            id={CHAT_AREA_ID}
            className="grid grid-rows-none content-start gap-4 w-[700px] max-h-[700px] overflow-y-auto px-5 py-3"
          >
            {messages.map((message, idx) => (
              <div
                className={`w-fit ${
                  message.role === "user"
                    ? "justify-self-end"
                    : "justify-self-start"
                }`}
              >
                <Chat key={idx} role={message.role} content={message.content} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          {listening ? (
            <Mic className="animate-bounce w-14 h-14 fill-green-500 inline-block" />
          ) : (
            <MicOff className="w-14 h-14 fill-red-500 inline-block" />
          )}
        </div>

        <div className="flex flex-col items-center  gap-2 my-8">
          {enableVoicevox ? (
            <>
              <div className="text-md">
                Voice:{" "}
                {isVoicevoxOn ? (
                  <span className=" text-green-500">ON</span>
                ) : (
                  <span className=" text-red-500">OFF</span>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <p className="text-md">Turn Voice ON/OFF</p>

                <button
                  type="button"
                  className="custom-icon-btn"
                  onClick={() => setIsVoicevoxOn((preV) => !preV)}
                >
                  <div className="flex flex-col items-center">
                    {isVoicevoxOn ? (
                      <>
                        <VolumeOff className="w-8 h-8" />
                      </>
                    ) : (
                      <>
                        <VolumeUp className="w-8 h-8" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </>
          ) : (
            <div className="text-md">
              <div>Voicevoxサーバーが動いていません...</div>
              <div>
                Voicevoxサーバーを動かして、このアプリをリロードしてください...
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => SpeechRecognition.startListening()}
            disabled={listening || isLoading}
            className="custom-btn text-center disabled:cursor-not-allowed"
          >
            {!listening && !isLoading ? (
              <span>入力</span>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin h-5 w-5 border-4 border-white rounded-full border-t-transparent"></div>
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => SpeechRecognition.stopListening()}
            className="custom-btn"
          >
            Stop
          </button>
        </div>

        <div className="text-md mt-10 mx-auto">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">動作</th>
                <th className="border px-4 py-2">ショートカットキー</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">入力</td>
                <td className="border px-4 py-2">Shift + R</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Stop</td>
                <td className="border px-4 py-2">Shift + S</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
