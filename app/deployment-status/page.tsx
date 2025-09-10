'use client';

import { useState, useEffect } from 'react';

interface HealthData {
  status: string;
  timestamp: string;
  environment: {
    nodeEnv: string;
    hasSupabaseUrl: boolean;
    hasSupabaseKey: boolean;
    supabaseUrlPreview: string;
  };
  version: string;
}

export default function DeploymentStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
        } else {
          setError('Health check failed');
        }
      } catch (err) {
        setError('Failed to connect to health endpoint');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking deployment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🚀 Pomera CRM - Deployment Status
          </h1>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h2>
              <p className="text-red-600">{error}</p>
            </div>
          ) : health ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-800 mb-4">✅ Application Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      health.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {health.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Version:</span>
                    <span className="ml-2 text-gray-600">{health.version}</span>
                  </div>
                  <div>
                    <span className="font-medium">Environment:</span>
                    <span className="ml-2 text-gray-600">{health.environment.nodeEnv}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Check:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(health.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">🔧 Environment Configuration</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-40">Supabase URL:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      health.environment.hasSupabaseUrl ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {health.environment.hasSupabaseUrl ? '✅ Configured' : '❌ Missing'}
                    </span>
                    {health.environment.hasSupabaseUrl && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({health.environment.supabaseUrlPreview})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-40">Supabase Key:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      health.environment.hasSupabaseKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {health.environment.hasSupabaseKey ? '✅ Configured' : '❌ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-yellow-800 mb-4">📋 Next Steps</h2>
                <div className="space-y-2 text-sm">
                  {!health.environment.hasSupabaseUrl || !health.environment.hasSupabaseKey ? (
                    <>
                      <p>1. Add environment variables to GitHub Secrets:</p>
                      <ul className="ml-4 space-y-1">
                        <li>• Go to Settings → Secrets and variables → Actions</li>
                        <li>• Add NEXT_PUBLIC_SUPABASE_URL</li>
                        <li>• Add NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                      </ul>
                      <p>2. Re-run the GitHub Actions workflow</p>
                    </>
                  ) : (
                    <>
                      <p>✅ All environment variables are configured!</p>
                      <p>🎉 Your application should be fully functional.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">🔗 Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="/"
                    className="block p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    🏠 Home Page
                  </a>
                  <a
                    href="/crm"
                    className="block p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    📊 CRM Dashboard
                  </a>
                  <a
                    href="/admin"
                    className="block p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                  >
                    ⚙️ Admin Panel
                  </a>
                  <a
                    href="/ats"
                    className="block p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center"
                  >
                    👥 ATS System
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
