import { exec } from "child_process";
import { promisify } from "util";
import { platform } from "os";

const execAsync = promisify(exec);

export async function isDockerRunning(): Promise<boolean> {
  try {
    // Attempt to run a simple docker command to check connectivity to the daemon
    await execAsync("docker info");
    return true;
  } catch (error) {
    return false;
  }
}

export async function startDockerDaemon(): Promise<boolean> {
  const currentPlatform = platform();

  try {
    if (currentPlatform === "darwin") {
      await execAsync("open -a Docker");
      return true;
    } else if (currentPlatform === "win32") {
      // Windows - assumes default install path, might need adjustment
      await execAsync('start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"');
      return true;
    } else if (currentPlatform === "linux") {
      // Linux - systemd
      try {
        await execAsync("sudo systemctl start docker");
        return true;
      } catch {
        // Fallback for non-systemd or permission issues
         console.error("Could not start Docker automatically on Linux. Please start it manually.");
         return false;
      }
    }
    return false;
  } catch (error) {
    console.error("Failed to start Docker:", error);
    return false;
  }
}

