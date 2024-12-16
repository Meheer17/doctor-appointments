import { slotDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const searchParams = request.nextUrl.searchParams;
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    try {
        if (!start_date && !end_date) {
            const data = await slotDb
                .find({ doctor_id: id, booked: true })
                .toArray();
            return NextResponse.json({ message: data });
        } else if (start_date && end_date) {
            const sutc = new Date(
                Date.UTC(
                    new Date(start_date).getUTCFullYear(),
                    new Date(start_date).getUTCMonth(),
                    new Date(start_date).getUTCDate(),
                ),
            );
            const eutc = new Date(
                Date.UTC(
                    new Date(end_date).getUTCFullYear(),
                    new Date(end_date).getUTCMonth(),
                    new Date(end_date).getUTCDate(),
                ),
            );
            eutc.setUTCDate(eutc.getUTCDate() + 1);

            const data = await slotDb
                .find({
                    doctor_id: id,
                    booked: true,
                })
                .toArray();
            data.filter((i) => {
                i.adata = data.filter((i) => {
                    return (
                        i.appointment_date > sutc && i.appointment_date < eutc
                    );
                });
            });

            return NextResponse.json({ message: data });
        } else {
            return NextResponse.json({
                success: false,
                error: "Both start_date and end_date must be provided.",
            });
        }
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch booked slots. Please try again.",
        });
    }
}
