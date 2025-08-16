import { Drive } from "../service";


export function createGithubRepositorieDrive(
    owner: string,
    repo: string,
    branch: string = "main"
): Drive {
    return {
        async list(path: string): Promise<string[]> {
            return [];
        },

        async downloadUrl(path: string): Promise<string> {
            return "";
        },
    };
}