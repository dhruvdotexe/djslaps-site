import { NextResponse } from "next/server";

export const revalidate = 60;

type TwitchTokenResponse = {
  access_token: string;
};

type TwitchStreamResponse = {
  data: Array<{ id: string; user_login: string; title: string }>;
};

type LiveStatus = {
  live: boolean;
  title?: string;
};

async function getAppToken(clientId: string, clientSecret: string): Promise<string | null> {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST", next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as TwitchTokenResponse;
  return json.access_token;
}

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json<LiveStatus>({ live: false, title: undefined });
  }

  const token = await getAppToken(clientId, clientSecret);
  if (!token) {
    return NextResponse.json<LiveStatus>({ live: false });
  }

  const res = await fetch(
    "https://api.twitch.tv/helix/streams?user_login=djslapsx",
    {
      headers: {
        "Client-Id": clientId,
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) {
    return NextResponse.json<LiveStatus>({ live: false });
  }
  const json = (await res.json()) as TwitchStreamResponse;
  const stream = json.data.find((s) => s.user_login === "djslapsx");
  return NextResponse.json<LiveStatus>({
    live: Boolean(stream),
    title: stream?.title,
  });
}
