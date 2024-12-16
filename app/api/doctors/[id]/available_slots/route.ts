import { slotDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("date");
    if (!query) {
        const data = await slotDb
            .find({ doctor_id: id, booked: false })
            .toArray();

        return NextResponse.json({ message: data });
    } else {
        const data = await slotDb
            .find({
                doctor_id: id,
                booked: false,
                appoitment_date: new Date(query).toLocaleDateString(),
            })
            .toArray();
        console.log(new Date(query).toLocaleDateString());
        return NextResponse.json({ message: data });
    }
}
