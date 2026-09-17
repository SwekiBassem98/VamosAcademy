import { recordGameSession, getStudentGameSessions } from '../../../lib/exercises/index.ts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      gameId,
      gameType,
      bandTarget,
      score,
      durationSeconds,
      totalQuestions,
      correctAnswers,
      questionAttempts,
    } = body;

    if (!studentId || !gameId || !gameType || !bandTarget) {
      return Response.json(
        {
          success: false,
          error: 'Missing required parameters: studentId, gameId, gameType, bandTarget',
        },
        { status: 400 }
      );
    }

    const result = await recordGameSession({
      studentId,
      gameId,
      gameType,
      bandTarget,
      score: score || 0,
      durationSeconds: durationSeconds || 30,
      totalQuestions: totalQuestions || 1,
      correctAnswers: correctAnswers || 0,
      questionAttempts,
    });

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to record game session',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return Response.json(
        {
          success: false,
          error: 'Missing studentId parameter',
        },
        { status: 400 }
      );
    }

    const sessions = await getStudentGameSessions(studentId);

    return Response.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve game sessions',
      },
      { status: 500 }
    );
  }
}
