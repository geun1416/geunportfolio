// 해밀이음 Figma Variables에서 내보낸 JSON(global → semantic.light / semantic.dark)을 그대로 옮긴 값
export type TokenValue = { ref: string; hex: string };
export const HAEMILEUM_TOKENS: Record<"light" | "dark", Record<string, TokenValue>> = {
  "light": {
    "bg/page": {
      "ref": "color/base/bg",
      "hex": "#F6F4F5"
    },
    "bg/surface": {
      "ref": "color/base/surface",
      "hex": "#FFFFFF"
    },
    "bg/overlay": {
      "ref": "color/base/bg",
      "hex": "#F6F4F5"
    },
    "text/primary": {
      "ref": "color/base/ink",
      "hex": "#262640"
    },
    "text/secondary": {
      "ref": "color/base/sub",
      "hex": "#6B6B80"
    },
    "text/disabled": {
      "ref": "color/base/sub",
      "hex": "#6B6B80"
    },
    "text/inverse": {
      "ref": "color/base/surface",
      "hex": "#FFFFFF"
    },
    "border/default": {
      "ref": "color/base/border",
      "hex": "#E6E3E8"
    },
    "border/strong": {
      "ref": "color/base/border-sub",
      "hex": "#C9C9DD"
    },
    "action/hae/bg": {
      "ref": "color/sector/hae/main",
      "hex": "#FE8324"
    },
    "action/hae/tint": {
      "ref": "color/sector/hae/tint",
      "hex": "#FCEEDC"
    },
    "action/hae/border": {
      "ref": "color/sector/hae/border",
      "hex": "#FDE8B4"
    },
    "action/hae/text": {
      "ref": "color/sector/hae/text",
      "hex": "#7A4F14"
    },
    "action/hae/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/mil/bg": {
      "ref": "color/sector/mil/main",
      "hex": "#E8637F"
    },
    "action/mil/tint": {
      "ref": "color/sector/mil/tint",
      "hex": "#FBE7EC"
    },
    "action/mil/border": {
      "ref": "color/sector/mil/border",
      "hex": "#FCD0DB"
    },
    "action/mil/text": {
      "ref": "color/sector/mil/text",
      "hex": "#8A2540"
    },
    "action/mil/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/ieum/bg": {
      "ref": "color/sector/ieum/main",
      "hex": "#3E9C82"
    },
    "action/ieum/tint": {
      "ref": "color/sector/ieum/tint",
      "hex": "#E3F3EE"
    },
    "action/ieum/border": {
      "ref": "color/sector/ieum/border",
      "hex": "#B8EAD8"
    },
    "action/ieum/text": {
      "ref": "color/sector/ieum/text",
      "hex": "#1E5C46"
    },
    "action/ieum/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/hamkke/bg": {
      "ref": "color/sector/hamkke/main",
      "hex": "#4A5A9E"
    },
    "action/hamkke/tint": {
      "ref": "color/sector/hamkke/tint",
      "hex": "#E7E9F5"
    },
    "action/hamkke/border": {
      "ref": "color/sector/hamkke/border",
      "hex": "#C8CDF0"
    },
    "action/hamkke/text": {
      "ref": "color/sector/hamkke/text",
      "hex": "#2A3470"
    },
    "action/hamkke/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "feedback/error": {
      "ref": "color/state/error",
      "hex": "#E8637F"
    },
    "feedback/success": {
      "ref": "color/state/success",
      "hex": "#3E9C82"
    },
    "feedback/warning": {
      "ref": "color/state/warning",
      "hex": "#ED9A35"
    }
  },
  "dark": {
    "bg/page": {
      "ref": "color/dark/bg",
      "hex": "#1A1A2E"
    },
    "bg/surface": {
      "ref": "color/dark/surface",
      "hex": "#25253E"
    },
    "bg/overlay": {
      "ref": "color/dark/bg",
      "hex": "#1A1A2E"
    },
    "text/primary": {
      "ref": "color/dark/ink",
      "hex": "#E8E8F4"
    },
    "text/secondary": {
      "ref": "color/dark/sub",
      "hex": "#9898B0"
    },
    "text/disabled": {
      "ref": "color/dark/sub",
      "hex": "#9898B0"
    },
    "text/inverse": {
      "ref": "color/base/ink",
      "hex": "#262640"
    },
    "border/default": {
      "ref": "color/dark/border",
      "hex": "#3A3A58"
    },
    "border/strong": {
      "ref": "color/dark/border-sub",
      "hex": "#4A4A68"
    },
    "action/hae/bg": {
      "ref": "color/sector/hae/main",
      "hex": "#FE8324"
    },
    "action/hae/tint": {
      "ref": "color/sector/hae/tint-dark",
      "hex": "#3A2C10"
    },
    "action/hae/border": {
      "ref": "color/sector/hae/border-dark",
      "hex": "#5A4420"
    },
    "action/hae/text": {
      "ref": "color/sector/hae/main",
      "hex": "#FE8324"
    },
    "action/hae/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/mil/bg": {
      "ref": "color/sector/mil/main",
      "hex": "#E8637F"
    },
    "action/mil/tint": {
      "ref": "color/sector/mil/tint-dark",
      "hex": "#3A1520"
    },
    "action/mil/border": {
      "ref": "color/sector/mil/border-dark",
      "hex": "#5A2535"
    },
    "action/mil/text": {
      "ref": "color/sector/mil/main",
      "hex": "#E8637F"
    },
    "action/mil/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/ieum/bg": {
      "ref": "color/sector/ieum/main",
      "hex": "#3E9C82"
    },
    "action/ieum/tint": {
      "ref": "color/sector/ieum/tint-dark",
      "hex": "#0F2E25"
    },
    "action/ieum/border": {
      "ref": "color/sector/ieum/border-dark",
      "hex": "#1E4D3A"
    },
    "action/ieum/text": {
      "ref": "color/sector/ieum/main",
      "hex": "#3E9C82"
    },
    "action/ieum/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "action/hamkke/bg": {
      "ref": "color/sector/hamkke/main",
      "hex": "#4A5A9E"
    },
    "action/hamkke/tint": {
      "ref": "color/sector/hamkke/tint-dark",
      "hex": "#151A36"
    },
    "action/hamkke/border": {
      "ref": "color/sector/hamkke/border-dark",
      "hex": "#252D5A"
    },
    "action/hamkke/text": {
      "ref": "color/sector/hamkke/main",
      "hex": "#4A5A9E"
    },
    "action/hamkke/on-bg": {
      "ref": "#FFFFFF",
      "hex": "#FFFFFF"
    },
    "feedback/error": {
      "ref": "color/state/error",
      "hex": "#E8637F"
    },
    "feedback/success": {
      "ref": "color/state/success",
      "hex": "#3E9C82"
    },
    "feedback/warning": {
      "ref": "color/state/warning",
      "hex": "#ED9A35"
    }
  }
};
export const SECTORS = [
  { id: "hae", name: "해" },
  { id: "mil", name: "밀" },
  { id: "ieum", name: "이음" },
  { id: "hamkke", name: "함께" },
] as const;
