import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

type RouteParams = {
    params: Promise<{ slug: string; }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a specific event by its slug
 */

export async function GET(req: NextResponse, { params }: RouteParams): Promise<NextResponse> {
    try {
        // connect to database
        await connectDB();

        // await and extract slug from params
        const { slug } = await params;

        // Validate slug parameter
        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                { message: "Invalid or missing slug parameter" },
                { status: 400 }
            );
        }

        // sanitize slug (remove any potential malicious input)
        const sanitizedSlug = slug.trim().toLowerCase();

        // query event by slug
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();

        //handle event not found
        if (!event) {
            return NextResponse.json(
                { message: `Event with slug ${sanitizedSlug} not found` },
                { status: 404 }
            );
        }

        // return successful response with event data
        return NextResponse.json(
            { message: "Event Fetched Successfully", event },
            { status: 200 }
        );
    } catch (e) {
        // log error for debugging (only in development mode)
        if (process.env.NODE_ENV === 'development') {
            console.error("Error fetching event by slug:", e);
        }

        // handle specific error cases
        if (e instanceof Error) {
            // handle database connection error
            if (e.message.includes('MONGODB_URI')) {
                return NextResponse.json(
                    { message: "Database connection error" },
                    { status: 500 }
                )
            }

            // handle generic error with error message
            return NextResponse.json(
                { message: 'Failed to fetch event', error: e.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "An unexpected error occured" },
            { status: 500 }
        );
    }
}