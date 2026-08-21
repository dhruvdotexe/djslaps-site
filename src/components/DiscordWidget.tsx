"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type DiscordWidgetProps = {
  guildId: string;
  inviteUrl: string;
};

type WidgetData = {
  presence_count?: number;
  name?: string;
};

/**
 * Live Discord presence card. The server must enable the widget
 * (Server Settings → Widget → Enable) for data to appear; until then
 * the card shows the invite CTA only.
 */
export default function DiscordWidget({ guildId, inviteUrl }: DiscordWidgetProps) {
  const [data, setData] = useState<WidgetData | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${guildId}/widget.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: WidgetData) => setData(d))
      .catch(() => setDisabled(true));
  }, [guildId]);

  return (
    <div className="card p-8">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-[#5865F2]" aria-hidden />
        <h2 className="font-display text-2xl font-bold">Join the Discord</h2>
      </div>

      {data?.presence_count !== undefined && data.presence_count > 0 ? (
        <p className="mt-3 leading-relaxed text-dim">
          <b className="font-medium text-text">{data.presence_count}</b>{" "}
          {data.presence_count === 1 ? "member" : "members"} online right now.
        </p>
      ) : (
        <p className="mt-3 leading-relaxed text-dim">
          Stream pings, meme channels, gang announcements and chaos. Right this
          way.
        </p>
      )}

      {disabled && (
        <p className="mt-2 text-xs text-dim/70">
          (Live member count appears once the server enables its widget — Server
          Settings → Widget.)
        </p>
      )}

      <a
        href={inviteUrl}
        target="_blank"
        rel="noopener"
        className="mt-5 inline-block rounded-full bg-[#5865F2] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
      >
        Join the server
      </a>
    </div>
  );
}
