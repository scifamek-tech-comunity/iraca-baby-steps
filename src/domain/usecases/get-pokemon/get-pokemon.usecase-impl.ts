import { PokemonRepository } from '../../../infrastructure/pokemon.repository';
import { GottenPokemonDomainEvent } from '../../domain-events';
import { GetFullPokemonUsecase } from '../get-full-pokemon/get-full-pokemon.usecase';
import { GetPokemonParam } from './get-pokemon.param';
import { GetPokemonUsecase } from './get-pokemon.usecase';

export class GetPokemonUsecaseImpl extends GetPokemonUsecase {
	constructor(
		private pokemonRepository: PokemonRepository,
		private getFullPokemonUsecase: GetFullPokemonUsecase
	) {
		super();
	}

	async execute(param: GetPokemonParam) {
		const response = await this.pokemonRepository.getByName(param.name);

		return GottenPokemonDomainEvent(response);
	}
}
