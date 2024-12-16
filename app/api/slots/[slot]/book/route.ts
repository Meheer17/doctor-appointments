import { session, slotDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slot: string }> },
) {
    const slot = (await params).slot;
    const book = await req.json();
    let data;
    try {
        session.startTransaction();

        const slotData = await slotDb
            .find({ slot_id: slot, booked: false }, { session })
            .toArray();

        if (slotData.length == 0) {
            throw Error("Already Slot Booked");
        }

        console.log(slotData);

        await slotDb.updateOne(
            { slot_id: slot },
            {
                $set: {
                    booked: true,
                    ...book,
                },
            },
            { session },
        );

        await session.commitTransaction();
    } catch (error) {
        console.log("An error occurred during the transaction:" + error);
        await session.abortTransaction();
        return NextResponse.json({
            success: false,
            error: (error as Error).message,
        });
    }
    await session.endSession();
    return NextResponse.json({
        success: true,
        message: "Booked successfully!",
        data,
    });
}
