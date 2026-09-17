import { submitExerciseAttempt, getStudentAttempts, getStudentAttemptStats } from '../../../lib/exercises/index.ts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, studentAnswer, timeTakenSeconds, context } = body;

    if (!studentId || !exerciseId) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: studentId, exerciseId',
        },
        { status: 400 }
      );
    }

    const result = await submitExerciseAttempt(
      {
        studentId,
        exerciseId,
        studentAnswer,
        timeTakenSeconds: timeTakenSeconds || 30,
      },
      context
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to submit attempt',
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

    const attempts = await getStudentAttempts(studentId);
    const stats = await getStudentAttemptStats(studentId);

    return Response.json({
      success: true,
      data: {
        attempts,
        stats,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve attempts',
      },
      { status: 500 }
    );
  }
}
