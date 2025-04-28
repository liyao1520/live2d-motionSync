export const tts = async (text: string) => {
  const response = await fetch(
    "https://edge-tts-stream-api.vercel.app/tts/stream",
    {
      method: "POST",
      body: JSON.stringify({
        voice: "zh-CN-XiaoxiaoNeural",
        text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.arrayBuffer());
  return response;
};
