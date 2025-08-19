import { cGenericDownInfo } from "../controllerTools/previewInfoCreateer";
import { registerDriveCreater } from "../service/driveCreaterManager";
import { Drive, Folder, File, FilePreviewInfo, FileList } from "../service/driveManager";


function toP(download_url:string): FilePreviewInfo[] {
    return [
        cGenericDownInfo(download_url)
    ]
}
function gfToSf(gf: any): File | FileList {
    function toF({ name, size, download_url }: any): File {//文件
        return {
            type: "file",
            name: name,
            size: size,
            previewInfos: toP(download_url),
        }
    }
    function toD({ name }: any): Folder {//文件夹
        return {
            type: "folder",
            name: name,
        };
    }
    if (Array.isArray(gf)) {
        return gf.map(item => {
            if (item.type === "file") {
                return toF(item);
            } else if (item.type === "dir") {
                return toD(item);
            } else {
                throw new Error("Unknown item type in GitHub response");
            }
        });
    } else if (gf.type === "file") {
        return toF(gf);
    }
    throw new Error("Unknown GitHub response format");
}

export function createGithubRepositorieDrive(
    owner: string,
    repo: string,
    branch: string = "main",
    githubToken: string
): Drive {
    const requestHandler = new Headers();
    requestHandler.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0");
    requestHandler.set("Accept", "application/vnd.github+json");
    requestHandler.set("Authorization", `Bearer ${githubToken}`);
    requestHandler.set("X-GitHub-Api-Version", "2022-11-28");
    return {
        view: async function (path: string): Promise<FileList | File | undefined> {
            const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${path}?ref=${encodeURIComponent(branch)}`, { headers: requestHandler });
            if (response.status === 404) {
                return undefined; // 如果路径不存在，返回 undefined
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch view for path "${path}": ${response.statusText} | ${await response.text()}`);
            }
            const data = await response.json();
            return gfToSf(data);
        },
        previewInfos: async function (path: string): Promise<FilePreviewInfo[] | undefined> {
            const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${path}?ref=${encodeURIComponent(branch)}`, { headers: requestHandler });
            if (response.status === 404) {
                return undefined; // 如果路径不存在，返回 undefined
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch preview info for path "${path}": ${response.statusText} | ${await response.text()}`);
            }
            const data = await response.json();
            if ((data as any)?.type === "file") {
                const download_url = (data as any).download_url;
                if(download_url){
                    return toP(download_url);
                }
            }
            return undefined; // 如果不是文件或没有下载链接，返回 undefined
        }
    };
}

registerDriveCreater({
    name: "github-repositorie",
    description: "GitHub 仓库驱动",
    create: createGithubRepositorieDrive,
    args: [
        {
            name: "owner",
            type: "string",
            description: "仓库所有者用户名",
            required: true,
        },
        {
            name: "repo",
            type: "string",
            description: "仓库名称",
            required: true,
        },
        {
            name: "branch",
            type: "string",
            description: "分支名称",
            defaultValue: "main",
        },
        {
            name: "githubToken",
            type: "string",
            description: "GitHub 访问令牌",
            required: true,
        }
    ],
});