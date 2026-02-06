# Secure Setup Script for Moltbot (OpenClaw)
$ErrorActionPreference = "Stop"

Write-Host "==> secure-setup: Initializing..." -ForegroundColor Cyan

# 1. Generate Security Token
if (-not (Test-Path ".env")) {
    Write-Host "Generating secure gateway token..." -ForegroundColor Yellow
    $Token = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
    
    $EnvContent = @"
OPENCLAW_GATEWAY_TOKEN=$Token
GEMINI_API_KEY=
# Add other keys here (GROQ_API_KEY, etc)
"@
    Set-Content -Path ".env" -Value $EnvContent
    Write-Host "Created .env file with new token." -ForegroundColor Green
} else {
    Write-Host ".env file already exists. Skipping generation." -ForegroundColor Gray
}

# 2. Build Secure Image
Write-Host "Building secure Docker image..." -ForegroundColor Cyan
docker build -t openclaw:secure .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed."
}

# 3. Start Container
Write-Host "Starting secure container..." -ForegroundColor Cyan
docker compose -f docker-compose.secure.yml up -d

Write-Host "`nSUCCESS! Your secure bot is running." -ForegroundColor Green
Write-Host "Gateway: http://localhost:18789"
Write-Host "Data Volume: docker volume inspect moltbot_docker_moltbot_data"
Write-Host "To view logs: docker logs -f moltbot-secure"
