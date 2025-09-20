import type { APIFile, APIFileList, APIFilePreviewInfo, APIView } from "@ftypes/api";
import { authorizationFetchJson } from "./authorization";

export const serverApiBrowse = {
    async view(path: string, abort?: AbortController): Promise<APIView> {
        try {
            return await authorizationFetchJson<APIView>(`/view${path}`, {
                method: "GET",
                signal: abort?.signal
            });
        } catch (error) {
            if ((error as any)?.name !== "AbortError") {
                throw error;
            }
            return { list: null, infoFile: null };
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