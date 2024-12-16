import { doctorsDb, session, slotDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { SlotsData } from "../../route";

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
    const slotdetail = await request.json();

    if (
        !slotdetail.slot_duration ||
        !slotdetail.slot_start_date ||
        !slotdetail.slot_end_date ||
        !slotdetail.slot_type ||
        !slotdetail.start_time ||
        !slotdetail.end_time
    ) {
        return NextResponse.json({
            success: false,
            error: "You must fill all the details!",
        });
    } else if (slotdetail.slot_type != "weekly" && !slotdetail.days) {
        return NextResponse.json({ success: false, error: "Select the days!" });
    } else if (
        (new Date(slotdetail.end_time).getTime() -
            new Date(slotdetail.start_time).getTime()) %
            slotdetail.slot_duration !==
        0
    ) {
        return NextResponse.json({
            success: false,
            error: "Invalid time interval!",
        });
    }

    const result: SlotsData[] = [];
    try {
        session.startTransaction();

        for (
            let i = new Date(slotdetail.slot_start_date);
            i <= new Date(slotdetail.slot_end_date);
            i.setUTCDate(i.getUTCDate() + 1)
        ) {
            if (slotdetail.slot_type === "daily") {
                CreateSlots(
                    slotdetail.start_time,
                    slotdetail.end_time,
                    slotdetail.slot_duration,
                    new Date(i),
                    id,
                ).forEach((slot) => {
                    result.push(slot);
                });
            } else if (slotdetail.slot_type === "weekly") {
                const weekday = ["su", "m", "tu", "w", "th", "f", "sa"];
                if (slotdetail.days.includes(weekday[i.getUTCDay()])) {
                    CreateSlots(
                        slotdetail.start_time,
                        slotdetail.end_time,
                        slotdetail.slot_duration,
                        new Date(i),
                        id,
                    ).forEach((slot) => {
                        result.push(slot);
                    });
                }
            } else if (slotdetail.slot_type === "specific") {
                CreateSlots(
                    slotdetail.start_time,
                    slotdetail.end_time,
                    slotdetail.slot_duration,
                    new Date(i),
                    id,
                ).forEach((slot) => {
                    result.push(slot);
                });
            }
        }

        if (result.length !== 0) {
            await doctorsDb.updateOne(
                { _id: new ObjectId(id) },
                { $push: { slot_details: slotdetail } },
                { session },
            );
            await slotDb.insertMany(result, { session });
        }

        await session.commitTransaction();
    } catch (error) {
        console.log("An error occurred during the transaction: " + error);
        await session.abortTransaction();
        return NextResponse.json({
            success: false,
            error: (error as Error).message,
        });
    }
    await session.endSession();
    return NextResponse.json({
        success: true,
        message: "Slots created successfully!",
        id: result.map((slot) => slot.slot_id),
    });
}

function CreateSlots(
    start_time: string,
    end_time: string,
    slot_duration: number,
    date: Date,
    doctor_id: string,
) {
    const start = new Date(start_time);
    const end = new Date(end_time);

    const adjustedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const result: SlotsData[] = [];
    for (
        let i = new Date(start);
        i < end;
        i.setMinutes(i.getMinutes() + slot_duration)
    ) {
        const t = new Date(i);
        result.push({
            slot_id: new ObjectId().toString(),
            start_time: t.toISOString(),
            end_time: new Date(t.getTime() + slot_duration * 60000).toISOString(),
            patient_name: "",
            patient_phone: "",
            patient_email: "",
            patient_visit_reason: "",
            doctor_id: doctor_id,
            appoitment_date: adjustedDate,
            booked: false,
        });
    }
    return result;
}