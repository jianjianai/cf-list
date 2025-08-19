import { type Component, defineAsyncComponent } from "vue";
import type { APIFile, previewType } from "@ftypes/api";
import LoadError from "./LoadError.vue";
import Loading from "./Loading.vue";


export type ViewComponent = {
    component: Component<{ file: APIFile }>,
    name: string,
};


function defineViewComponent(name: string, f: () => Promise<Component>): ViewComponent {
    return {
        component: defineAsyncComponent({
            errorComponent: LoadError,
            loadingComponent: Loading,
            loader: f
        }),
        name: name,
    }
}

export const previewComponents: Record<previewType, ViewComponent> = {
    "download": defineViewComponent("文件下载", () => import("./GenericDown.vue")),
}

export function getPreviewComponents(types: previewType[]): ViewComponent[] {
    return types.map(type => {
        const component = previewComponents[type];
        if (!component) {
            throw new Error(`Preview component for type "${type}" not found`);
        }
        return component;
    });
}



