import { NextResponse } from 'next/server';
import * as dashboardEditorController from './controller';
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'dashboard editor',
        access: 'read',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const records = await dashboardEditorController.getDashboardEditors();
    return NextResponse.json(records);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'dashboard editor',
        access: 'create',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }

    const body = await req.json();
    const newRecord = await dashboardEditorController.createDashboardEditor(body);
    return NextResponse.json(newRecord, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'dashboard editor',
        access: 'update',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updatedRecord = await dashboardEditorController.updateDashboardEditor(_id, updateData);
    return NextResponse.json(updatedRecord);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'dashboard editor',
        access: 'delete',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await dashboardEditorController.deleteDashboardEditor(id);
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
