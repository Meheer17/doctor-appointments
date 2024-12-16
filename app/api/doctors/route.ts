import { doctorsDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export type Doctor = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    slot_details: SlotDetails[];
};

export type SlotDetails = {
    slot_duration: 0;
    slot_start_date: string;
    slot_end_date: string;
    slot_type: "daily" | "weekly" | "specific";
    days: string[];
    start_time: "";
    end_time: "";
};

export type SlotsData = {
    slot_id: string;
    start_time: string;
    end_time: string;
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    patient_visit_reason: string;
    doctor_id: string;
    appoitment_date: Date;
    booked: boolean;
};

export async function GET() {
    const data = await doctorsDb.find().toArray();
    return NextResponse.json({ data: data });
}

export async function POST(req: NextRequest) {
    const doctorData = await req.json();
    const doctor: Doctor = {
        username: doctorData.username,
        first_name: doctorData.first_name,
        last_name: doctorData.last_name,
        email: doctorData.email,
        slot_details: [],
    };

    const existingDoctor = await doctorsDb.findOne({ email: doctor.email });

    if (existingDoctor) {
        return NextResponse.json({
            success: false,
            message: "Email already exists",
        });
    }

    const data = await doctorsDb.insertOne(doctor);
    return NextResponse.json({ success: true, data });
}

export async function DELETE(req: NextRequest) {
    const doctor: Doctor = await req.json();
    const data = await doctorsDb.findOneAndDelete({ email: doctor.email });
    return NextResponse.json({ success: true, data });
}
