export function isAuthEnabled(): boolean {
    const enableAuthEnv: string = process.env.ENABLE_AUTH || 'false';

    return enableAuthEnv.toLowerCase() === 'true';
}
