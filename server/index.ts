import { createServer, Server } from "./server";
import './controllers/index';
import './drives/index';
import './configPersistenceer/index';
import { executeController } from "./controller";
import { getConfigPersistenceer } from "./configPersistenceer";
import { User } from "./service/userManager";

let serverPromise: Promise<Server> | undefined;

export default {
	async fetch(request, env, ctx) {
		// 防止重复初始化server
		if(!serverPromise){
			serverPromise = loadServer(env);
		}
		let server = await serverPromise;

		//处理请求
		//BeforeController事件
		let requestc: Request = request;
		try {
			await server.eventManager.triggerBeforeControllerCallbacks({ request: requestc, setRequest: (req) => { requestc = req } });
		} catch (e) {
			console.error(e);
			return new Response(`Failed to execute before events: ${e}`, { status: 500 });
		}

		//执行Controller
		let user: User | undefined | null = undefined;
		try {
			const token = requestc.headers.get("Authorization");
			if (token) {
				user = await server.authorizationManager.verifyUserAuthorization(token);
			} else {
				user = server.userManager.getVisitorUser();
			}
			if (!user) {
				return new Response("Unauthorized", { status: 401 });
			}
		} catch (e) {
			console.error(e);
			return new Response(`Failed to get user permissions: ${e}`, { status: 500 });
		}
		let response;
		try {
			response = await executeController(requestc, user, server);
		} catch (e) {
			console.error(e);
			return new Response(`Failed to execute controller: ${e}`, { status: 500 });
		}

		//AfterController事件
		try {
			await server.eventManager.triggerControllerAfterEvents({ response, setResponse: (res) => { response = res } });
		} catch (e) {
			console.error(e);
			return new Response(`Failed to execute after events: ${e}`, { status: 500 });
		}
		return response;
	},
} satisfies ExportedHandler<Env>;


async function loadServer(env: Env): Promise<Server> {
	if (!(env as any).CCP) {
		throw new Error("CCP environment variable not configured");
	}
	let ccp;
	try {
		ccp = JSON.parse((env as any).CCP);
	} catch (e) {
		throw new Error(`Failed to parse CCP environment variable ${e}`);
	}
	const configPersistenceerName = ccp.name;
	const configPersistenceerArgs = ccp.args;
	if (!configPersistenceerName) {
		throw new Error("CCP name not configured")
	}
	if (!configPersistenceerArgs) {
		throw new Error("CCP args not configured");
	}
	if (!Array.isArray(configPersistenceerArgs)) {
		throw new Error("CCP args must be an array");
	}
	try {
		const configPersistenceer = getConfigPersistenceer(configPersistenceerName);
		if (!configPersistenceer) {
			throw new Error(`Failed to create root drive: ${configPersistenceerName} not found`);
		}
		return await createServer(await configPersistenceer(...configPersistenceerArgs));
	} catch (e) {
		throw new Error(`Failed to start server: ${e}`);
	}
}
