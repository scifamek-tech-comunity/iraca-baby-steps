import axios from 'axios';

import { PokemonEntity } from '../domain/entities/pokemon.entity';

export class PokemonRepository {
	getByName(name: string) {
		const path = `https://pokeapi.co/api/v2/pokemon/${name}`;

		const response = axios.get(path).then((x) => {
			return {name: x.data['name'], species: x.data['species']} as PokemonEntity;
		});
		return response;
	}
}
