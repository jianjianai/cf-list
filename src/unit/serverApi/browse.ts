import type { APIFile, APIFileList } from "@ftypes/api";

export const serverApiBrowse = {
    async view(path: string): Promise<APIFile | APIFileList | null> {
        const response = await fetch(`/view/${encodeURI(path)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch view for path "${path}": ${response.statusText}`);
        }
        const data = await response.json();
        return data as APIFile | APIFileList | null;
    }
}