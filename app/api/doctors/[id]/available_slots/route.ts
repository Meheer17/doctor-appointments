import { slotDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("date");

    try {
        if (!query) {
            const data = await slotDb
                .find({ doctor_id: id, booked: false })
                .toArray();
            return NextResponse.json({ message: data });
        } else {
            const queryDate = new Date(query);
            const sutc = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate()));
            const eutc = new Date(sutc);
            eutc.setUTCDate(sutc.getUTCDate() + 1);

            const data = await slotDb
                .find({
                    doctor_id: id,
                    booked: false,
                    appoitment_date: {
                        $gte: sutc,
                        $lt: eutc,
                    },
                })
                .toArray();
            return NextResponse.json({ message: data });
        }
    } catch (error) {
        console.error("Error retrieving slots:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to retrieve slots. Please try again.",
        });
    }
}
