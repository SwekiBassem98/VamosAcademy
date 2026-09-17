import { getGameLeaderboardData } from '../../../lib/exercises/index.ts';
import type { AgeBand } from '../../../theme/types.ts';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId') || 'gc_1';
    const band = (url.searchParams.get('band') as AgeBand) || 'BAND_C';
    const scoreStr = url.searchParams.get('score');
    const studentName = url.searchParams.get('studentName') || undefined;

    const studentScore = scoreStr ? parseInt(scoreStr, 10) : undefined;

    const leaderboard = await getGameLeaderboardData(
      gameId,
      band,
      studentScore,
      studentName
    );

    return Response.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch leaderboard',
      },
      { status: 500 }
    );
  }
}
