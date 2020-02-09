export default interface Hackamon {
	id: string;
	name: string;
	type: string[];
	stats: Stats;
	assets: Assets;
}

export interface Stats {
	health: number;
	physical_attack: number;
	phsyical_defence: number;
	special_attack: number;
	special_defence: number;
	speed: number
}

export interface Assets {
	regular: AssetsSet;
	shiny: AssetsSet;
}

export interface AssetsSet {
	sprite: string;
	image: string;
}
