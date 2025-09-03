import { regConfigPersistenceerCreateer } from "../configPersistenceer";


regConfigPersistenceerCreateer("github-repositorie-file", (
    owner: string,
    repo: string,
    branch: string,
    path: string,
    githubToken: string,
    committer: { name: string; email: string }
) => {
    const requestHandler = new Headers();
    requestHandler.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0");
    requestHandler.set("Accept", "application/vnd.github+json");
    requestHandler.set("Authorization", `Bearer ${githubToken}`);
    requestHandler.set("X-GitHub-Api-Version", "2022-11-28");
    let sha: string | undefined = undefined;
    return {
        get: async () => {
            const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${path}?ref=${encodeURIComponent(branch)}`, { headers: requestHandler });
            if (response.status === 404) {
                return undefined;
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch preview info for path "${path}": ${response.statusText} | ${await response.text()}`);
            }
            const data = await response.json();
            if ((data as any)?.type !== "file") {
                throw new Error(`Path "${path}" is not a file`);
            }
            const content = (data as any).content;
            const decodedContent = atob(content);
            const r = JSON.parse(decodedContent);
            sha = (data as any).sha;
            return r;
        },
        set: async (config: any) => {
            const content = JSON.stringify(config,null,2);
            const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${path}?ref=${encodeURIComponent(branch)}`, {
                headers: requestHandler,
                method: "PUT",
                body: JSON.stringify({ 
                    "message": "update config", 
                    "committer": committer || { "name": "cflist", "email": "cflist@github.com" }, 
                    "content": btoa(content),
                    "sha": sha
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to update config at path "${path}": ${response.statusText} | ${await response.text()}`);
            }
            sha = (await response.json() as any).sha;
        }
    }
});