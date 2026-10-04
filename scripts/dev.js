// ============================================================================
// Concurrent Dev Runner (Backend + Frontend)
// Works seamlessly on Windows, Linux, and macOS without extra dependencies
// ============================================================================

const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('=======================================================');
console.log('🚀 Starting Student Management Portal Development Servers');
console.log('=======================================================');

// 1. Spawn Backend
const backend = spawn('node', ['--watch', 'src/server.js'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

// 2. Spawn Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n[Dev] Shutting down development processes...');
  try {
    if (backend && !backend.killed) backend.kill('SIGINT');
    if (frontend && !frontend.killed) frontend.kill('SIGINT');
  } catch (e) {
    // Ignore error on exit
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
