'use client';

const STAMPS_KEY_PREFIX = 'moonlit:stamps:';
export const STAMPS_PER_REWARD = 8;

export interface StampCardState {
  stamps: number;
  rewardsEarned: number;
}

function key(userId: string) {
  return `${STAMPS_KEY_PREFIX}${userId}`;
}

export function getStampCard(userId: string): StampCardState {
  if (typeof window === 'undefined') {
    return { stamps: 0, rewardsEarned: 0 };
  }
  const raw = window.localStorage.getItem(key(userId));
  if (!raw) {
    const initial: StampCardState = { stamps: 0, rewardsEarned: 0 };
    window.localStorage.setItem(key(userId), JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as StampCardState;
  } catch {
    return { stamps: 0, rewardsEarned: 0 };
  }
}

function saveStampCard(userId: string, state: StampCardState) {
  window.localStorage.setItem(key(userId), JSON.stringify(state));
}

/** Called whenever a signed-in member places an order. Adds one stamp, redeeming a reward at 8. */
export function addStampForOrder(userId: string): { card: StampCardState; rewardEarned: boolean } {
  const card = getStampCard(userId);
  const nextStamps = card.stamps + 1;
  if (nextStamps >= STAMPS_PER_REWARD) {
    const next: StampCardState = { stamps: 0, rewardsEarned: card.rewardsEarned + 1 };
    saveStampCard(userId, next);
    return { card: next, rewardEarned: true };
  }
  const next: StampCardState = { stamps: nextStamps, rewardsEarned: card.rewardsEarned };
  saveStampCard(userId, next);
  return { card: next, rewardEarned: false };
}

/** Payload encoded in the member's own QR code, shown for staff to scan for account lookups. */
export function getMemberQrValue(userId: string) {
  const bucket = Math.floor(Date.now() / 30000); // rotates every 30s
  return `MOONLIT:MEMBER:${userId}:${bucket}`;
}
