/** 控制器执行前事件 */
export type ControllerExecuteBeforeEvent = {
    request: Request,
    /** 修改执行时使用的请求 */
    setRequest: (request: Request) => void
}

/** 控制器执行后事件 */
export type ControllerExecuteAfterEvent = {
    response: Response,
    /** 修改执行后返回的响应 */
    setResponse: (response: Response) => void
}

type EventFunction<T> = (event: T) => void | Promise<void>
export type EventManager = ReturnType<typeof createEventManager>
export function createEventManager() {
    const controllerBeforeEvents: EventFunction<ControllerExecuteBeforeEvent>[] = []
    const controllerAfterEvents: EventFunction<ControllerExecuteAfterEvent>[] = []

    return {
        registerControllerExecuteBeforeEvent: (event: EventFunction<ControllerExecuteBeforeEvent>) => {
            controllerBeforeEvents.push(event)
        },
        registerControllerExecuteAfterEvent: (event: EventFunction<ControllerExecuteAfterEvent>) => {
            controllerAfterEvents.push(event)
        },
        triggerBeforeControllerCallbacks: async (event: ControllerExecuteBeforeEvent) => {
            let errors = [];
            for (const fn of controllerBeforeEvents) {
                try {
                    await fn(event)
                }catch(e){
                    errors.push(e)
                }
            }
            if(errors.length>0){
                throw new Error(`Before controller callbacks failed: ${errors.join(", ")}`);
            }
        },
        triggerControllerAfterEvents: async (event: ControllerExecuteAfterEvent) => {
            let errors = [];
            for (const fn of controllerAfterEvents) {
                try {
                    await fn(event)
                }catch(e){
                    errors.push(e)
                }
            }
            if(errors.length>0){
                throw new Error(`After controller callbacks failed: ${errors.join(", ")}`);
            }
        }
    }
}