import { DomainEventKind } from '@scifamek-open-source/iraca/domain';
import { PokemonEntity } from './entities/pokemon.entity';

export const GottenPokemonDomainEvent = DomainEventKind<PokemonEntity>('GottenPokemonDomainEvent');
