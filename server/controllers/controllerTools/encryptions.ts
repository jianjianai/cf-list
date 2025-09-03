// 生成一个随机16位字符串
export function generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 生成密码hash
export async function generatePasswordHash(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const saltBytes = encoder.encode(salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const combinedBuffer = new Uint8Array(hashBuffer.byteLength + saltBytes.byteLength);
    combinedBuffer.set(new Uint8Array(hashBuffer), 0);
    combinedBuffer.set(new Uint8Array(saltBytes), hashBuffer.byteLength);
    const finalHashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
    return Array.from(new Uint8Array(finalHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}