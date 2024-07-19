export async function sendMessage(channelId: string, message: string) {
  try {
    const response = await fetch("/api/slack/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId, message }),
    });
    const data = await response.json();
    if (data.result?.ok) {
      return data;
    } else {
      console.error("Error fetching channels:", data.error);
    }
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
}
