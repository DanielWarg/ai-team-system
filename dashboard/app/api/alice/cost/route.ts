import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), '../../cost-tracking/costs.db');

function getCostData() {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    // Get costs by time period
    const today = db.prepare(`
      SELECT SUM(cost) as total FROM api_calls WHERE timestamp >= ?
    `).get(todayStart) as any;

    const week = db.prepare(`
      SELECT SUM(cost) as total FROM api_calls WHERE timestamp >= ?
    `).get(weekStart) as any;

    const month = db.prepare(`
      SELECT SUM(cost) as total FROM api_calls WHERE timestamp >= ?
    `).get(monthStart) as any;

    // Get costs by agent (today)
    const byAgent = db.prepare(`
      SELECT agent, SUM(cost) as total 
      FROM api_calls 
      WHERE timestamp >= ?
      GROUP BY agent
    `).all(todayStart) as any[];

    const byAgentMap: Record<string, number> = {};
    byAgent.forEach((row) => {
      byAgentMap[row.agent] = row.total;
    });

    db.close();

    return {
      today: today?.total || 0,
      week: week?.total || 0,
      month: month?.total || 0,
      byAgent: byAgentMap
    };
  } catch (error) {
    console.error('Cost tracking DB error:', error);
    return { today: 0, week: 0, month: 0, byAgent: {} };
  }
}

export async function GET() {
  const costData = getCostData();
  return NextResponse.json(costData);
}
