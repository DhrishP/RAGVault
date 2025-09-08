#!/usr/bin/env node

// Cross-platform development setup script

import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const platform = os.platform();
const isWindows = platform === 'win32';
const isMacOS = platform === 'darwin';
const isLinux = platform === 'linux';

console.log(`🔧 Setting up development environment for ${platform}...`);

async function checkDependency(command, name) {
  try {
    await execAsync(command);
    console.log(`✅ ${name} is available`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} is not available`);
    return false;
  }
}

async function installDependencies() {
  console.log('📦 Installing dependencies...');
  try {
    await execAsync('npm install');
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

async function buildProject() {
  console.log('🏗️  Building project...');
  try {
    await execAsync('npm run build');
    console.log('✅ Project built successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

async function setupDevelopment() {
  console.log(`\n🚀 RAGVault Development Setup`);
  console.log(`Platform: ${platform} (${os.arch()})`);
  console.log(`Node.js: ${process.version}\n`);

  // Check required dependencies
  const nodeAvailable = await checkDependency('node --version', 'Node.js');
  const npmAvailable = await checkDependency('npm --version', 'npm');
  const dockerAvailable = await checkDependency('docker --version', 'Docker');

  if (!nodeAvailable || !npmAvailable) {
    console.log('❌ Missing required dependencies. Please install Node.js and npm.');
    process.exit(1);
  }

  if (!dockerAvailable) {
    console.log('⚠️  Docker is not available. Install Docker to use ChromaDB features.');
    if (isWindows) {
      console.log('   Windows: https://docs.docker.com/desktop/install/windows-install/');
    } else if (isMacOS) {
      console.log('   macOS: https://docs.docker.com/desktop/install/mac-install/');
    } else {
      console.log('   Linux: https://docs.docker.com/engine/install/');
    }
  }

  await installDependencies();
  await buildProject();

  console.log('\n🎉 Development environment setup complete!');
  console.log('\n📚 Available scripts:');
  console.log('  npm run dev     - Build and start the application');
  console.log('  npm run build   - Build the TypeScript code');
  console.log('  npm start       - Start the built application');
  console.log('  npm run clean   - Clean the dist directory');

  // Platform-specific notes
  if (isWindows) {
    console.log('\n💡 Windows-specific notes:');
    console.log('  - Make sure Docker Desktop is running');
    console.log('  - Use PowerShell or Command Prompt');
  } else if (isMacOS) {
    console.log('\n💡 macOS-specific notes:');
    console.log('  - Docker Desktop for Mac is recommended');
    console.log('  - Use Terminal or your preferred shell');
  } else {
    console.log('\n💡 Linux-specific notes:');
    console.log('  - Make sure Docker daemon is running');
    console.log('  - You may need to add your user to the docker group');
  }
}

setupDevelopment().catch(console.error);