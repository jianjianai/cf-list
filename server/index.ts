import { createDriveManager } from "./service";

export type SetUpConfig = {

}

export default {
	fetch(request) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {

			const test = createDriveManager();

			test.mount("/",{root:"root"});
			test.mount("/a",{root:"a"});
			test.mount("/b/c",{root:"b"});
			test.mount("/b/c/d/d",{root:"d"});
			test.mount("/b/r/d/d",{root:"e"});

			console.log(test.retrieveDrive("/c/d/e"),"/c/d/e");
			console.log(test.retrieveDrive("/"),"/");
			console.log(test.retrieveDrive("/a/b/c"),"/b/c");
			console.log(test.retrieveDrive("/a"),"/");
			console.log(test.retrieveDrive("/b"),"/b");
			console.log(test.retrieveDrive("/b/c/d"),"/d");
			console.log(test.retrieveDrive("/b/c"),"/");
			console.log(test.retrieveDrive("/b/c/d/d/e/f/g"),"/e/f/g");

			console.log(test.retrieveFolder("/"),1);
			console.log(test.retrieveFolder("/b"),1);
			console.log(test.retrieveFolder("/b/c"),1);

			return Response.json({
				name: "Cloudflare",
			});
		}
		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
