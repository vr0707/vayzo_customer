import storage from './async-storage';

const TOKEN_KEY = '@vayzo/auth-token';

export async function saveToken(token: string): Promise<void> {
  await storage.set(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return storage.get<string>(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await storage.remove(TOKEN_KEY);
}