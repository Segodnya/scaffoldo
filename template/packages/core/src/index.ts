export * from './errors.js';
export * from './env.js';

export type Brand<T, B extends string> = T & { readonly __brand: B };
export type UserId = Brand<string, 'UserId'>;
export type OrgId = Brand<string, 'OrgId'>;
