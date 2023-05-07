import axios from "axios";

const voicevoxClient = axios.create({
  baseURL: "http://localhost:50021/",
  proxy: false,
});

export const generateVoice = async (
  text: string
): Promise<ArrayBuffer | null> => {
  const responseAudioJson = await voicevoxClient
    .post("audio_query?text=" + encodeURI(text) + "&speaker=1")
    .then((res) => {
      const data = res.data;
      if (data && data.speedScale !== undefined) {
        data.speedScale = 1.5;
        return data;
      }

      return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (responseAudioJson === null) {
    return null;
  }

  try {
    const reqJson = JSON.stringify(responseAudioJson);

    return await voicevoxClient
      .post("synthesis?speaker=1", reqJson, {
        responseType: "arraybuffer",
        headers: {
          accept: "audio/wav",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const data = res.data;
        if (data) {
          return data as ArrayBuffer;
        }

        return null;
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
  } catch (e) {
    console.log(e);
    return null;
  }
};
