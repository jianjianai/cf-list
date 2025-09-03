import { APIFile, APIFileList, APIFilePreviewInfo } from "../../types/api";
import { registerController, createJsonHandler } from "../controller";


registerController({
    path: "/users/login",
    permission: undefined,
    handler: createJsonHandler(async (req, { fileManager }): Promise<string> => {

    }),
});