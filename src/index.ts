import express from 'express';
// import { Container } from 'inversify';
// import { PokemonRepository } from './infrastructure/pokemon.repository';

import { IracaContainer } from '@scifamek-open-source/iraca/dependency-injection';
import { Graph } from '@scifamek-open-source/iraca/grapher';
import { GetPokemonParam } from './domain/usecases/get-pokemon/get-pokemon.param';
import { GetPokemonUsecase } from './domain/usecases/get-pokemon/get-pokemon.usecase';
import { PokemonRepository } from './infrastructure/pokemon.repository';

const app = express();

async function main() {
	//Con Iraca
	const container = new IracaContainer();

	container.add({
		component: PokemonRepository,
	});

	await container.addByPattern({
		abstractionPattern: /Usecase$/g,
		directory: `${__dirname}/domain/usecases`,
		directoryPatterns: ['usecase-impl\\.'],
	});

	console.log('\n-----------------------------\n');
	container.print();
	if (container.pendingParticles.size) {
		process.exit(1);
	}
	console.log('-----------------------------\n');

	const graph = new Graph();

	graph.sketch({
		container,
		controllers: [],
		initializer:'is-root',
		outputFolder: 'flujos'
	});

	app.get('/', async (req, res) => {
		const myUsecase = await container.getInstance<GetPokemonUsecase>(GetPokemonUsecase);
		const query = req.query;
		const param: GetPokemonParam = {name: query.name};
		const r = await myUsecase.execute(param);
		res.send(r);
	});

	const port = 3000;

	app.listen(port, () => {
		console.log('Running at ', port);
	});
}
main();
// Con Inversify

// const container: Container = new Container();

// container.bind(GetPokemonUsecase).toSelf();
// container.bind(PokemonRepository).toSelf();

// app.get('/', (req, res) => {
// 	const myUsecase = container.get(GetPokemonUsecase);

// 	const query = req.query;
// 	console.log(query.name);

// 	const param = {name: query.name} as GetPokemonParam;
// 	myUsecase.execute(param).then((r) => {
// 		res.send(r);
// 	});
// });

//Sin inyección de dependencias
// app.get('/', (req, res) => {
// 	const repository = new PokemonRepository();

// 	const myUsecase = new GetPokemonUsecase(repository);

// 	myUsecase.execute().then((r) => {
// 		res.send(r);
// 	});
// });
