import 'dotenv/config'; // Load .env
import https from 'https';

console.log("🔍 Diagnostic: Testing Groq API Connection...");

const apiKey = process.env.GROQ_API_KEY;
const model = "llama-3.3-70b-versatile";

if (!apiKey) {
    console.error("❌ ERROR: GROQ_API_KEY is missing from process.env");
    console.log("   Make sure .env file exists and contains GROQ_API_KEY");
    process.exit(1);
} else {
    console.log(`✅ API Key found: ${apiKey.substring(0, 8)}...`);
}

const data = JSON.stringify({
    messages: [
        { role: "user", content: "Hello! Are you working?" }
    ],
    model: model,
    temperature: 0.7
});

const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
    }
};

console.log(`📡 Sending request to Groq (Model: ${model})...`);

const req = https.request(options, (res) => {
    console.log(`📥 Response Status: ${res.statusCode} ${res.statusMessage}`);

    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const parsed = JSON.parse(body);
                const reply = parsed.choices[0].message.content;
                console.log("\n✅ SUCCESS! Model replied:");
                console.log("---------------------------------------------------");
                console.log(reply);
                console.log("---------------------------------------------------");
            } catch (e) {
                console.error("❌ Failed to parse response:", e);
                console.log("Raw body:", body);
            }
        } else {
            console.error("\n❌ API Error:");
            console.log(body);

            if (res.statusCode === 401) console.log("   -> Check your API Key.");
            if (res.statusCode === 429) console.log("   -> Rate limited.");
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Network Error: ${e.message}`);
});

req.write(data);
req.end();
