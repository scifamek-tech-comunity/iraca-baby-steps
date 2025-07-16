import { GetFullPokemonParam } from './get-full-pokemon.param';

export abstract class GetFullPokemonUsecase {
	abstract execute(param: GetFullPokemonParam): Promise<any>;
}
