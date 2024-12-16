import { doctorsDb, session } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { SlotDetails, SlotsData } from "../../route";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const data = await doctorsDb.find({ _id: new ObjectId(id) }).toArray();
    return NextResponse.json({ message: data });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const slotdata: SlotDetails = await request.json();

    if (
        !slotdata.slot_duration ||
        !slotdata.slot_start_date ||
        !slotdata.slot_end_date ||
        !slotdata.slot_type ||
        !slotdata.start_time ||
        !slotdata.end_time
    ) {
        return NextResponse.json({
            success: false,
            error: "U must fill all the details!",
        });
    } else if (slotdata.slot_type != "weekly" && !slotdata.days) {
        return NextResponse.json({ success: false, error: "Select the days!" });
    }
    
    try {
        session.startTransaction();
    } catch (error) {
        console.log("An error occurred during the transaction:" + error);
        await session.abortTransaction();
    } finally {
        await session.endSession();
    }
}
