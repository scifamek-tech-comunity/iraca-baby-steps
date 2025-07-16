import { PokemonRepository } from '../../../infrastructure/pokemon.repository';
import { GetFullPokemonParam } from './get-full-pokemon.param';
import { GetFullPokemonUsecase } from './get-full-pokemon.usecase';

export class GetFullPokemonUsecaseImpl extends GetFullPokemonUsecase {
	constructor(private pokemonRepository: PokemonRepository) {
		super();
	}

	async execute(param: GetFullPokemonParam) {
		const response = await this.pokemonRepository.getByName(param.name);
		return response;
	}
}
