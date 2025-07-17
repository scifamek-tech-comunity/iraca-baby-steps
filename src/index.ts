// import { Container } from 'inversify';
// import { PokemonRepository } from './infrastructure/pokemon.repository';

import { IracaContainer } from '@scifamek-open-source/iraca/dependency-injection';
import { Graph } from '@scifamek-open-source/iraca/grapher';
import {
	ControllerConfiguration,
	IracaController,
	IracaServer,
} from '@scifamek-open-source/iraca/web-api';
import { IncomingMessage, ServerResponse } from 'http';
import { GetPokemonParam } from './domain/usecases/get-pokemon/get-pokemon.param';
import { GetPokemonUsecase } from './domain/usecases/get-pokemon/get-pokemon.usecase';
import { PokemonRepository } from './infrastructure/pokemon.repository';

const app = new IracaServer();

class PokemonController extends IracaController {
	constructor(configuration: ControllerConfiguration) {
		super(configuration);
	}
	configureEndpoints(): void {
		// this.register({
		// 	usecase: GetPokemonUsecase, //Agregar al register individual
		// 	path: 'charry',
		// 	metaDataForExporting: ['time']
		// });

		//convertir a regex
		this.configureEndpointsByPattern('[\\w]+Usecase$', {
			enabledHandler: (usecaseId) => {
				return (request: IncomingMessage, response: ServerResponse<IncomingMessage>) =>
					Promise.resolve(true);
			},
			methodMapper: [
				{
					method: 'patch',
					patterns: ['^GetFull'],
				},
				{
					method: 'get',
					patterns: ['.*'],
				},
			],
			pathTransformer(tempPath) {
				console.log(tempPath);
				console.log(4);
				return tempPath;
			},
		});
	}
}

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

	const myController = new PokemonController({
		container,
		prefix: 'pokemon',
		methodToInvoke: 'execute',
		identifier: 'Pokemon',
	});

	const graph = new Graph();

	graph.sketch({
		container,
		controllers: [myController],
		outputFolder: 'flujos',
		highlights: [
			{
				customization: {
					background: '0158ff',
					color: 'fff',
				},
				pattern: /[\w]+Full[\w]+/g,
			},
		],

		triggers: [
			{
				kind: 'relation',
				child: /[\w]+Full/,
				parent: /.+/,
				operation: 'have',
				trigger(parent: string, child: string) {
					console.error('>>> Error de dependencia: ', parent, child, '\n');
					process.exit(1);
				},
			},
		],
	});

	app.request('get', '/', async (req: IncomingMessage, res: ServerResponse) => {
		const myUsecase = await container.getInstance<GetPokemonUsecase>(GetPokemonUsecase);
		const param: GetPokemonParam = {name: 'charizard'};
		const r = await myUsecase.execute(param);
		console.log(r);
		res.end(JSON.stringify(r));
	});

	const routes = myController.print();
	console.log(routes);

	app.addController(myController);

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
