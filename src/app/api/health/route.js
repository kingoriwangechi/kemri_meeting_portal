// Health check endpoint for monitoring application status
// Can be extended to check database connections and other services

export async function GET() {
  // Get package.json version
  const packageJson = require('../../../../package.json');
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
