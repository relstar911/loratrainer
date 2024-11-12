# First, run this command separately in PowerShell as administrator:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Check if required tools are installed
$requiredTools = @{
    "git" = "Git";
    "docker" = "Docker";
    "node" = "Node.js";
    "python" = "Python";
    "poetry" = "Poetry"
}

Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
foreach ($tool in $requiredTools.Keys) {
    if (!(Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $($requiredTools[$tool]) is not installed. Please install it first." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ All prerequisites are installed." -ForegroundColor Green

# Create project directory and clone repository
$projectName = "ai-agency-saas"
Write-Host "`n🚀 Setting up $projectName..." -ForegroundColor Blue

# Ask for repository URL
$repoUrl = Read-Host "Please enter the repository URL"
if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required" -ForegroundColor Red
    exit 1
}

# Clone repository
git clone $repoUrl $projectName
Set-Location $projectName

# Setup Backend
Write-Host "`n📦 Setting up backend..." -ForegroundColor Blue
Set-Location backend

# Create and setup .env file
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env file. Please edit it with your credentials." -ForegroundColor Yellow
    Write-Host "Press any key to continue after editing .env..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Install backend dependencies
Write-Host "`n📥 Installing backend dependencies..." -ForegroundColor Blue
poetry install

# Start Docker containers
Write-Host "`n🐳 Starting Docker containers..." -ForegroundColor Blue
docker-compose up -d db redis

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Run migrations
Write-Host "`n🔄 Running database migrations..." -ForegroundColor Blue
poetry run alembic upgrade head

# Setup Frontend
Write-Host "`n🎨 Setting up frontend..." -ForegroundColor Blue
Set-Location ../frontend

# Create and setup frontend .env
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created frontend .env file. Please edit if needed." -ForegroundColor Yellow
}

# Install frontend dependencies
Write-Host "`n📥 Installing frontend dependencies..." -ForegroundColor Blue
npm install

# Start all services in new windows
Write-Host "`n🚀 Starting all services..." -ForegroundColor Blue

# Start backend
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$PWD/../backend'; poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`"" -WindowStyle Normal

# Start Celery worker
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$PWD/../backend'; poetry run celery -A app.core.celery_app worker -l info -Q generation-queue`"" -WindowStyle Normal

# Start frontend
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$PWD'; npm run dev`"" -WindowStyle Normal

Write-Host "`n✅ Setup completed!" -ForegroundColor Green
Write-Host "
🌐 Services running at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
" -ForegroundColor Cyan

Write-Host "
📝 To test the application:
1. Open http://localhost:3000 in your browser
2. Register a new account
3. Create a project and try generating images
" -ForegroundColor Yellow

Write-Host "
❗ If you need to stop all services:
1. Close all opened PowerShell windows
2. Run 'docker-compose down' to stop containers
" -ForegroundColor Magenta