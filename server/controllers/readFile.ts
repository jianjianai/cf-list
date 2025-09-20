import { APIFile, APIFileList, APIFilePreviewInfo, APIView } from "../../types/api";
import { registerController, createJsonHandler } from "../controller";
import { allToAPI } from "./controllerTools/transforms";

registerController({
    path: new RegExp("/view/?.*"),
    permission: ["read"],
    handler: createJsonHandler(async (req, { fileManager }): Promise<APIView> => {
        const url = new URL(req.url);
        const path = "/" + url.pathname.replace(/^\/view\/?/, "");
        const fileview = await fileManager.view(path);
        if (!fileview) {
            return { list: null, infoFile: null };
        }
        return allToAPI(fileview,path);
    }),
});

registerController({
    path: new RegExp("/previewInfos/?.*"),
    permission: ["read"],
    handler: createJsonHandler(async (req, { fileManager }): Promise<APIFilePreviewInfo[] | null> => {
        const url = new URL(req.url);
        const path = "/" + url.pathname.replace(/^\/previewInfos\/?/, "");
        const fileview = await fileManager.previewInfos(path);
        if (!fileview) {
            return null;
        }
        return fileview;
    }),
});