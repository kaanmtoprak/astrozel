export const CHART_VIEWBOX_SIZE = 800;
export const CHART_CENTER_X = 400;
export const CHART_CENTER_Y = 400;

export const CHART_RADIUS = {
	outer: 380,
	zodiacSymbol: 340,
	zodiacInner: 300,
	planetOuter: 285,
	planetInner: 250,
	houseNumber: 215,
	aspect: 190,
	angleLabel: 392,
	tickMajor: 380,
	tickMinor: 372,
	tickTiny: 376,
} as const;

export const PLANET_MIN_SEPARATION_DEGREES = 8;
export const PLANET_CLUSTER_GAP_DEGREES = 12;

export const ZODIAC_SIGN_ORDER = [
	"aries",
	"taurus",
	"gemini",
	"cancer",
	"leo",
	"virgo",
	"libra",
	"scorpio",
	"sagittarius",
	"capricorn",
	"aquarius",
	"pisces",
] as const;

export const ZODIAC_SIGN_GLYPHS = {
	aries: "♈",
	taurus: "♉",
	gemini: "♊",
	cancer: "♋",
	leo: "♌",
	virgo: "♍",
	libra: "♎",
	scorpio: "♏",
	sagittarius: "♐",
	capricorn: "♑",
	aquarius: "♒",
	pisces: "♓",
} as const;

export const ZODIAC_RING_FILLS = [
	"color-mix(in srgb, var(--sky-blue) 45%, white)",
	"color-mix(in srgb, var(--lavender) 40%, white)",
	"color-mix(in srgb, #dce8dc 55%, white)",
	"color-mix(in srgb, #f0e4ec 50%, white)",
	"color-mix(in srgb, var(--accent-gold) 18%, white)",
	"color-mix(in srgb, var(--sky-blue) 35%, white)",
	"color-mix(in srgb, var(--lavender) 32%, white)",
	"color-mix(in srgb, #dce8dc 45%, white)",
	"color-mix(in srgb, #f0e4ec 42%, white)",
	"color-mix(in srgb, var(--accent-gold) 14%, white)",
	"color-mix(in srgb, var(--sky-blue) 28%, white)",
	"color-mix(in srgb, var(--lavender) 28%, white)",
] as const;

export const PLANET_LANE_RADII = [
	CHART_RADIUS.planetOuter,
	(CHART_RADIUS.planetOuter + CHART_RADIUS.planetInner) / 2,
	CHART_RADIUS.planetInner,
] as const;
