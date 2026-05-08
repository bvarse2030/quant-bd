/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

import * as footerController from './controller';
import { handleRateLimit } from '../../utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'footer editor',
        access: 'read',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const footers = await footerController.getFooters();
    return NextResponse.json(footers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch footers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'footer editor',
        access: 'create',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }

    const body = await req.json();
    const newFooter = await footerController.createFooter(body);
    return NextResponse.json(newFooter, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create footer' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'footer editor',
        access: 'update',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updatedFooter = await footerController.updateFooter(_id, updateData);
    return NextResponse.json(updatedFooter);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'footer editor',
        access: 'delete',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await footerController.deleteFooter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete footer' }, { status: 500 });
  }
}
