import { createJsonHandler, registerController } from "../service/controllerManager";
import { APIFile, APIFileList } from "../../types/api";
import { Folder,File } from "../service/driveManager";
import { allToAPI, fileToAPIFile } from "../controllerTools/transforms";

registerController({
    path: new RegExp("/view/?.*"),
    permission: undefined,
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