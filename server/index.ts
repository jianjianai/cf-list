import { createServer, Server } from "./server";
import { executeController } from "./service/controllerManager";
import './controllers/index';
import './drives/index';
import { getDriveCreater } from "./service/driveCreaterManager";

let server: Server;

export default {
	fetch(request, env, ctx) {
		if (!server) {
			const rootDriveName: string = (env as any).ROOT_DRIVE_NAME;
			const rootDriveArgs: string = (env as any).ROOT_DRIVE_ARGS;
			if (!rootDriveName) {
				return new Response("ROOT_DRIVE_NAME is not set in environment variables", { status: 500 });
			}
			if (!rootDriveArgs) {
				return new Response("ROOT_DRIVE_ARGS is not set in environment variables", { status: 500 });
			}
			const driveCreater = getDriveCreater(rootDriveName);
			if (!driveCreater) {
				return new Response(`Drive creator for "${rootDriveName}" not found`, { status: 500 });
			}
			let args: any[];
			try {
				args = JSON.parse(rootDriveArgs);
			} catch (e) {
				return new Response(`Failed to parse ROOT_DRIVE_ARGS: ${e}`, { status: 500 });
			}
			if (!Array.isArray(args)) {
				return new Response("ROOT_DRIVE_ARGS must be an array", { status: 500 });
			}
			try {
				const rootDrive = driveCreater.create(...args);
				server = createServer(rootDrive);
			} catch (e) {
				return new Response(`Failed to create root drive: ${e}`, { status: 500 });
			}
		}
		return executeController(request, [], server);
	},
} satisfies ExportedHandler<Env>;
