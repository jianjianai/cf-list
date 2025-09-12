import { APIFile, APIFileList, APIFilePreviewInfo } from "../../types/api";
import { registerController, createJsonHandler } from "../controller";
import { allToAPI } from "./controllerTools/transforms";

registerController({
    path: new RegExp("/view/?.*"),
    permission: ["read"],
    handler: createJsonHandler(async (req, { fileManager }): Promise<APIFile | APIFileList | null> => {
        const url = new URL(req.url);
        const path = "/" + url.pathname.replace(/^\/view\/?/, "");
        console.log("view path:", path);
        const fileview = await fileManager.view(path);
        if (!fileview) {
            return null;
        }
        return allToAPI(fileview);
    }),
});

registerController({
    path: new RegExp("/previewInfos/?.*"),
    permission: ["read"],
    handler: createJsonHandler(async (req, { fileManager }): Promise<APIFilePreviewInfo[] | null> => {
        const url = new URL(req.url);
        const path = "/" + url.pathname.replace(/^\/previewInfos\/?/, "");
        console.log("previewInfos path:", path);
        const fileview = await fileManager.previewInfos(path);
        if (!fileview) {
            return null;
        }
        return fileview;
    }),
});