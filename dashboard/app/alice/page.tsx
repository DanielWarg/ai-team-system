'use client';

import { useState, useEffect } from 'react';

interface AgentStatus {
  name: string;
  lastRun: string;
  nextRun: string;
  status: 'ok' | 'error' | 'running';
  lastDuration: number;
  consecutiveErrors: number;
}

interface CostData {
  today: number;
  week: number;
  month: number;
  byAgent: Record<string, number>;
}

export default function AliceControl() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [cost, setCost] = useState<CostData>({ today: 0, week: 0, month: 0, byAgent: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agent status
        const agentRes = await fetch('/api/alice/agents');
        const agentData = await agentRes.json();
        setAgents(agentData.agents || []);

        // Fetch cost data
        const costRes = await fetch('/api/alice/cost');
        const costData = await costRes.json();
        setCost(costData);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-orange-400">🐇 Alice Control</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-orange-400">🐇 Alice Control</h1>

        {/* Cost Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Today</div>
            <div className="text-3xl font-bold text-green-400">${cost.today.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">This Week</div>
            <div className="text-3xl font-bold text-blue-400">${cost.week.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">This Month</div>
            <div className="text-3xl font-bold text-purple-400">${cost.month.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Budget: $50/mån</div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Agent Pipeline Status</h2>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-4 bg-gray-750 rounded border border-gray-600">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'ok' ? 'bg-green-500' :
                    agent.status === 'running' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-bold">{agent.name}</div>
                    <div className="text-sm text-gray-400">
                      Last: {new Date(agent.lastRun).toLocaleTimeString('sv-SE')} ({agent.lastDuration}ms)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Next run</div>
                  <div className="font-mono text-sm">{new Date(agent.nextRun).toLocaleTimeString('sv-SE')}</div>
                  {agent.consecutiveErrors > 0 && (
                    <div className="text-xs text-red-400 mt-1">Errors: {agent.consecutiveErrors}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost by Agent */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Cost Breakdown (Today)</h2>
          <div className="space-y-2">
            {Object.entries(cost.byAgent).sort((a, b) => b[1] - a[1]).map(([agent, amount]) => (
              <div key={agent} className="flex justify-between items-center p-3 bg-gray-750 rounded">
                <span className="font-medium">{agent}</span>
                <span className="font-mono text-green-400">${amount.toFixed(3)}</span>
              </div>
            ))}
            {Object.keys(cost.byAgent).length === 0 && (
              <p className="text-gray-500 text-center py-4">No costs logged yet today</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-orange-400">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-bold">
              Spawn Builder
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-bold">
              View Products
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-bold">
              Cost Report
            </button>
            <button className="bg-red-600 hover:bg-red-700 p-4 rounded font-bold">
              Pause Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
