import type { APIFile, APIFileList, APIFilePreviewInfo } from "@ftypes/api";
import { authorizationFetchJson } from "./authorization";

export const serverApiBrowse = {
    async view(path: string, abort?: AbortController): Promise<APIFile | APIFileList | null> {
        try {
            return await authorizationFetchJson<APIFile | APIFileList | null>(`/view${path}`, {
                method: "GET",
                signal: abort?.signal
            });
        } catch (error) {
            if ((error as any)?.name !== "AbortError") {
                throw error;
            }
            return null;
        }
    },
    async previewInfos(path: string, abort?: AbortController): Promise<APIFilePreviewInfo[] | null> {
        try {
            return await authorizationFetchJson<APIFilePreviewInfo[] | null>(`/previewInfos${path}`, {
                method: "GET",
                signal: abort?.signal
            });
        } catch (error) {
            if ((error as any)?.name !== "AbortError") {
                throw error;
            }
            return null;
        }
    }
}