// run-with-env.mjs
import 'dotenv/config'; // Loads .env into process.env
import { spawn } from 'child_process';

console.log("🚀 Launcher: Loaded .env variables");
console.log("   ✅ GROQ Key:      ", !!process.env.GROQ_API_KEY ? "Present" : "Missing");
console.log("   ✅ Gemini Key:    ", !!process.env.GEMINI_API_KEY ? "Present" : "Missing");
console.log("   ✅ Anthropic Key: ", !!process.env.ANTHROPIC_API_KEY ? "Present" : "Missing");
console.log("   ✅ OpenAI Key:    ", !!process.env.OPENAI_API_KEY ? "Present" : "Missing");

// Get args passed to this script (e.g. "gateway")
const args = process.argv.slice(2);

console.log(`🚀 Starting OpenClaw with args: ${args.join(' ')}`);

const child = spawn('node', ['openclaw.mjs', ...args], {
    stdio: 'inherit',
    env: { ...process.env } // Pass loaded env vars to child
});

child.on('close', (code) => {
    process.exit(code);
});
