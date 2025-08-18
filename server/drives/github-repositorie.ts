import { registerDriveCreater } from "../service/driveCreaterManager";
import { Drive, Folder, File, FileDownloadInfo, FilePreviewInfo, FileList } from "../service/driveManager";


export function createGithubRepositorieDrive(
    owner: string,
    repo: string,
    branch: string = "main"
): Drive {
    return {
        view: async function (path: string): Promise<FileList | File | undefined> {
            // TODO: 实现 GitHub 仓库的文件浏览逻辑
            // return [
            //     {
            //         type: "folder",
            //         name: "example-folder",
            //     },
            //     {
            //         type: "file",
            //         name: "example-file.txt",
            //     }
            // ];
            return {
                type: 'file',
                name: 'example-file.txt',
            }
            return undefined;
        },
        downloadInfo: async function (path: string): Promise<FileDownloadInfo | undefined> {
            throw new Error("Function not implemented.");
        },
        previewInfo: async function (path: string): Promise<FilePreviewInfo | undefined> {
            throw new Error("Function not implemented.");
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
    ],
});