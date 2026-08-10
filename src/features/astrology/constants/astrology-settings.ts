export const ASTROLOGY_CALCULATION_VERSION = 1;
export const ASTROLOGY_PROVIDER_ID = "celestine" as const;
export const DEFAULT_ZODIAC_TYPE = "tropical" as const;
export const DEFAULT_HOUSE_SYSTEM = "placidus" as const;

export const CORE_PLANET_KEYS = [
	"sun",
	"moon",
	"mercury",
	"venus",
	"mars",
	"jupiter",
	"saturn",
	"uranus",
	"neptune",
	"pluto",
] as const;

export const MAJOR_ASPECT_TYPES = [
	"conjunction",
	"sextile",
	"square",
	"trine",
	"opposition",
] as const;
