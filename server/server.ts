import { ConfigPersistenceer } from "./configPersistenceer";
import { createAuthorizationManager } from "./service/authorizationManager";
import { createConfigManager } from "./service/configManager";
import { createDriveManager } from "./service/driveManager";
import { createEventManager } from "./service/eventManager";
import { createFileManager } from "./service/fileManager";
import { createUserManager } from "./service/userManager";


export type Server = Awaited<ReturnType<typeof createServer>>;
export async function createServer(configPersistenceer: ConfigPersistenceer) {
    const eventManager = createEventManager();
    const configManager = await createConfigManager(configPersistenceer, eventManager);
    const driveManager = createDriveManager(configManager);
    const fileManager = createFileManager(driveManager);
    const userManager = await createUserManager(configManager);
    const authorizationManager = createAuthorizationManager(configManager,userManager);
    return {
        driveManager,
        fileManager,
        configManager,
        eventManager,
        userManager,
        authorizationManager
    }
}