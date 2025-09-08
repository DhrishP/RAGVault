import os from 'os';
import path from 'path';

export function isWindows(): boolean {
  return os.platform() === 'win32';
}

export function isMacOS(): boolean {
  return os.platform() === 'darwin';
}

export function isLinux(): boolean {
  return os.platform() === 'linux';
}

export function getPlatformName(): string {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    default:
      return 'Unknown';
  }
}

export function getHomePath(): string {
  return os.homedir();
}

export function joinPaths(...paths: string[]): string {
  return path.join(...paths);
}

export function normalizePath(inputPath: string): string {
  return path.normalize(inputPath);
}

export function getAppDataPath(appName: string): string {
  if (isWindows()) {
    return path.join(os.homedir(), 'AppData', 'Roaming', appName);
  } else if (isMacOS()) {
    return path.join(os.homedir(), 'Library', 'Application Support', appName);
  } else {
    return path.join(os.homedir(), `.${appName}`);
  }
}