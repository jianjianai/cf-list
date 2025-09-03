import { createServer, Server } from "./server";
import './controllers/index';
import './drives/index';
import './configPersistenceer/index';
import { executeController } from "./controller";
import { getConfigPersistenceer } from "./configPersistenceer";

let server: Server;

export default {
	async fetch(request, env, ctx) {
		if (!server) {
			if (!(env as any).CCP) {
				return new Response("CCP environment variable not configured", { status: 500 });
			}
			let ccp;
			try {
				ccp = JSON.parse((env as any).CCP);
			} catch (e) {
				return new Response("Failed to parse CCP environment variable", { status: 500 });
			}
			const configPersistenceerName = ccp.name;
			const configPersistenceerArgs = ccp.args;
			if (!configPersistenceerName) {
				return new Response("CCP name not configured", { status: 500 });
			}
			if (!configPersistenceerArgs) {
				return new Response("CCP args not configured", { status: 500 });
			}
			if (!Array.isArray(configPersistenceerArgs)) {
				return new Response("CCP args must be an array", { status: 500 });
			}
			try {
				const configPersistenceer = getConfigPersistenceer(configPersistenceerName);
				if (!configPersistenceer) {
					return new Response(`Failed to create root drive: ${configPersistenceerName} not found`, { status: 500 });
				}
				server = await createServer(await configPersistenceer(...configPersistenceerArgs));
			} catch (e) {
				return new Response(`Failed to start server: ${e}`, { status: 500 });
			}
		}
		let requestc: Request = request;
		try {
			await server.eventManager.triggerBeforeControllerCallbacks({ request: requestc, setRequest: (req) => { requestc = req } });
		} catch (e) {
			return new Response(`Failed to execute before events: ${e}`, { status: 500 });
		}
		let permissions: string[] = [];
		try {
			const token = requestc.headers.get("Authorization");
			if (token) {
				const user = await server.authorizationManager.verifyUserAuthorization(token);
				if (!user) {
					return new Response("Unauthorized", { status: 401 });
				}
				permissions = user.permissions;
			} else {
				permissions = server.userManager.getVisitorPermissions();
			}
		} catch (e) {
			return new Response(`Failed to get user permissions: ${e}`, { status: 500 });
		}
		let response;
		try {
			response = await executeController(requestc, permissions, server);
		} catch (e) {
			return new Response(`Failed to execute controller: ${e}`, { status: 500 });
		}
		try {
			await server.eventManager.triggerControllerAfterEvents({ response, setResponse: (res) => { response = res } });
		} catch (e) {
			return new Response(`Failed to execute after events: ${e}`, { status: 500 });
		}
		return response;
	},
} satisfies ExportedHandler<Env>;
