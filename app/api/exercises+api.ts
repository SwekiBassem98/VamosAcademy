import { fetchExercisesForStudent } from '../../lib/exercises/index.ts';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId') || undefined;
    const subject = url.searchParams.get('subject') || undefined;
    const levelStr = url.searchParams.get('level');
    const levelCode = url.searchParams.get('levelCode') || undefined;
    const band = (url.searchParams.get('band') as any) || undefined;

    const studentAcademicLevel = levelStr ? parseInt(levelStr, 10) : undefined;

    const exercises = await fetchExercisesForStudent({
      studentId,
      subject,
      studentAcademicLevel,
      levelCode,
      band,
    });

    return Response.json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch exercises',
      },
      { status: 500 }
    );
  }
}
