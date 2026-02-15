import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Get cron jobs status via openclaw CLI
    const { stdout } = await execAsync('openclaw cron list --json');
    const data = JSON.parse(stdout);
    
    const agents = data.jobs.map((job: any) => ({
      name: job.name,
      lastRun: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : 'Never',
      nextRun: job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : 'Unknown',
      status: job.state?.runningAtMs ? 'running' : 
              job.state?.lastStatus === 'ok' ? 'ok' : 
              job.state?.consecutiveErrors > 0 ? 'error' : 'ok',
      lastDuration: job.state?.lastDurationMs || 0,
      consecutiveErrors: job.state?.consecutiveErrors || 0
    }));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json({ agents: [], error: 'Failed to fetch agent status' }, { status: 500 });
  }
}
