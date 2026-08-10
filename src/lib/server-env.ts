import "server-only";

export class ServerEnvError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ServerEnvError";
	}
}

export function getGeoNamesUsername(): string {
	const username = process.env.GEONAMES_USERNAME?.trim();

	if (!username) {
		throw new ServerEnvError("GEONAMES_USERNAME tanımlanmamış.");
	}

	if (username.toLowerCase() === "demo") {
		throw new ServerEnvError("GEONAMES_USERNAME tanımlanmamış.");
	}

	return username;
}
