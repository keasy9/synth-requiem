export type Environment = 'dev' | 'prod';

export function env(): Environment {
    return import.meta.env.DEV ? 'dev' : 'prod';
}

export function isDebug(): boolean {
    return env() === 'dev';
}
