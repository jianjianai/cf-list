import { type Component, defineAsyncComponent } from "vue";
import type { APIFile } from "@ftypes/api";
import LoadError from "../smallElements/LoadError.vue";
import Loading from "../smallElements/Loading.vue";
import type { GenericDownInfo } from "./GenericDown.vue";


export type ViewComponent<T> = {
    component: Component<{ file: APIFile, previewInfo: T }>,
    lable: string,
};


function defineViewComponent<T>(name: string, f: () => Promise<Component<{ file: APIFile, previewInfo: T }>>): ViewComponent<T> {
    return {
        component: defineAsyncComponent({
            errorComponent: LoadError,
            loadingComponent: Loading,
            loader: f
        }),
        lable: name,
    }
}
export type PIB<T extends keyof typeof previewComponents,P> = {type: T,previewInfo: P};


export type PreviewInfo = PIB<"GenericDown", GenericDownInfo>;
export const previewComponents = {
    "GenericDown": defineViewComponent("文件下载", () => import("./GenericDown.vue")),
}






