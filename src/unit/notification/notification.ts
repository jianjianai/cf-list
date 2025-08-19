import CircleCheckSvg from "@/components/icons/CircleCheckSvg.vue";
import CircleCloseOSvg from "@/components/icons/CircleCloseOSvg.vue";
import { reactive } from "vue";


export class IconComponents {
    success = CircleCheckSvg;
    error = CircleCloseOSvg;
}
export type NotificationType = keyof IconComponents;
export type Notification = {
    /** 提示类型 */
    type: NotificationType;
    /** 提示内容 */
    message: string;
    /** 自动关闭时间，毫秒 */
    timeOut?: number,
    /** 设为true则永不自动关闭 */
    noTimeOut?: boolean
}
export const notifications = reactive<{
    [key: number]: {
        notification: Notification;
        setTimeoutId: number | null;
    }
}>({});
export const iconComponents = new IconComponents();

let putNotificationId: number = 1;

/**弹出提示框*/
export function putNotification(notification: Notification) {
    const thePutNotificationId = putNotificationId++;
    notifications[thePutNotificationId] = {
        notification: notification,
        setTimeoutId: (() => {
            if (notification.noTimeOut) {
                return null;
            }
            return setTimeout(() => {
                delete notifications[thePutNotificationId];
            }, notification.timeOut || 3000) as any
        })()
    };
    return putNotificationId;
}

/**关闭提示框*/
export function closeNotification(putNotificationId: number) {
    let the = notifications[putNotificationId];
    if (!the) {
        return;
    }
    if (the.setTimeoutId) {
        clearTimeout(the.setTimeoutId);
    }
    delete notifications[putNotificationId];
}

/**取消自动关闭计时 */
export function cancelNotificationTimeout(putNotificationId: number) {
    let the = notifications[putNotificationId];
    if (!the) {
        return;
    }
    if (the.setTimeoutId) {
        clearTimeout(the.setTimeoutId);
        the.setTimeoutId = null;
    }
}

/**设置自动关闭计时 */
export function setNotificationTimeout(putNotificationId: number, timeOut?: number) {
    let the = notifications[putNotificationId];
    if (!the) {
        return;
    }
    if (the.setTimeoutId) {
        clearTimeout(the.setTimeoutId);
    }
    the.setTimeoutId = setTimeout(() => {
        delete notifications[putNotificationId];
    }, timeOut || 3000);
}