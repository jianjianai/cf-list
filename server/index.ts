import { createServer, Server } from "./server";
import { executeController } from "./service/controllerManager";
import './controllers/index';
import './drives/index';
import { createGithubRepositorieDrive } from "./drives/github-repositorie";

let server: Server;

export default {
	fetch(request, env, ctx) {
		if (!server) {
			const rootDrive = createGithubRepositorieDrive("jianjianai","Flist-Files-test","main");
			server = createServer(rootDrive);
		}
		return executeController(request, [], server);
	},
} satisfies ExportedHandler<Env>;
