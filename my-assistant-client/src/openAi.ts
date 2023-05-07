import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

type ResponseProps = {
  role: string;
  content: string;
};

const config = new Configuration({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(config);

export const requestToOpenAi = async (
  contents: ChatCompletionRequestMessage[]
): Promise<ResponseProps | null> => {
  return await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは優しい秘書です。どんな質問にも優しく短く100文字以内で回答してください。",
        },
        ...contents,
      ],
    })
    .then((res) => {
      const data = res.data;

      if (data) {
        const message = data.choices[0].message;
        if (message === undefined) {
          return null;
        }

        return {
          role: message.role,
          content: message.content,
        };
      }

      return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
