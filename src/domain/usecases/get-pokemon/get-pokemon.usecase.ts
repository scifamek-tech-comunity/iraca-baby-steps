import { GetPokemonParam } from './get-pokemon.param';

export abstract class GetPokemonUsecase {
	abstract execute(param: GetPokemonParam): Promise<any>;
}
