"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { crmDatabase } from '@/lib/supabase-crm';

const SupabaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [envVars, setEnvVars] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
    });

    // Test connection
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await crmDatabase.checkConnection();
      if (result.success) {
        setConnectionStatus('Connected');
      } else {
        setConnectionStatus(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionStatus(`Exception: ${error.message}`);
    }
  };

  const testDimensions = async () => {
    const results: any = {};
    
    try {
      results.statuses = await crmDatabase.getCompanyStatuses();
    } catch (error: any) {
      results.statuses = { error: error.message };
    }

    try {
      results.sources = await crmDatabase.getLeadSources();
    } catch (error: any) {
      results.sources = { error: error.message };
    }

    try {
      results.scores = await crmDatabase.getLeadScores();
    } catch (error: any) {
      results.scores = { error: error.message };
    }

    setTestResults(results);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Supabase Debug Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium mb-2">Environment Variables</h4>
          <div className="space-y-1 text-sm">
            <div>SUPABASE_URL: <span className={envVars.NEXT_PUBLIC_SUPABASE_URL === 'Set' ? 'text-green-600' : 'text-red-600'}>{envVars.NEXT_PUBLIC_SUPABASE_URL}</span></div>
            <div>SUPABASE_KEY: <span className={envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'Set' ? 'text-green-600' : 'text-red-600'}>{envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}</span></div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Connection Status</h4>
          <div className={`text-sm ${connectionStatus.includes('Connected') ? 'text-green-600' : 'text-red-600'}`}>
            {connectionStatus}
          </div>
          <Button onClick={testConnection} size="sm" className="mt-2">
            Test Connection
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={testDimensions} size="sm" className="mr-2">
          Test Dimensions
        </Button>
        <Button onClick={() => setTestResults({})} size="sm" variant="outline">
          Clear Results
        </Button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Test Results</h4>
          <div className="bg-white p-3 rounded text-sm">
            <pre className="whitespace-pre-wrap overflow-auto max-h-40">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug;
