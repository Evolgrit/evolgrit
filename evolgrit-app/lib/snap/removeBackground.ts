export async function removeBackground(imageBase64: string) {
  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.EXPO_PUBLIC_REMOVE_BG_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_file_b64: imageBase64,
      size: "auto",
    }),
  });

  const data = await res.json();
  return data.data.result_b64;
}
