import type { APIFile, APIFileList, APIFilePreviewInfo } from "@ftypes/api";
import { fileListCache, previewInfoCache } from "../utils/cache";
import { AppError, ErrorType, withErrorHandling } from "../utils/errorHandling";
import { authorizationFetchJson } from "./authorization";

export const serverApiBrowse = {
    async view(path: string, abort?: AbortController): Promise<APIFile | APIFileList | null> {
        // Check cache first
        const cacheKey = `view:${path}`;
        const cached = fileListCache.get(cacheKey);
        if (cached) {
            return cached;
        }

        return withErrorHandling(async () => {
            const result = await authorizationFetchJson<APIFile | APIFileList | null>(`/view${path}`, {
                method: "GET",
                signal: abort?.signal
            });
            
            // Cache the result
            if (result) {
                fileListCache.set(cacheKey, result);
            }
            
            return result;
        }, ErrorType.NETWORK).catch(error => {
            if ((error as any)?.name === "AbortError") {
                return null;
            }
            throw error;
        });
    },

    async previewInfos(path: string, abort?: AbortController): Promise<APIFilePreviewInfo[] | null> {
        // Check cache first
        const cacheKey = `preview:${path}`;
        const cached = previewInfoCache.get(cacheKey);
        if (cached) {
            return cached;
        }

        return withErrorHandling(async () => {
            const result = await authorizationFetchJson<APIFilePreviewInfo[] | null>(`/previewInfos${path}`, {
                method: "GET",
                signal: abort?.signal
            });
            
            // Cache the result
            if (result) {
                previewInfoCache.set(cacheKey, result);
            }
            
            return result;
        }, ErrorType.NETWORK).catch(error => {
            if ((error as any)?.name === "AbortError") {
                return null;
            }
            throw error;
        });
    }
}