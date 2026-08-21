export type AudioWindow = {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

export function resolveAudioContext(existing: AudioContext | null): AudioContext | null {
  const win = window as unknown as AudioWindow;
  const Ctx = win.AudioContext ?? win.webkitAudioContext;
  if (existing) return existing;
  return Ctx ? new Ctx() : null;
}
