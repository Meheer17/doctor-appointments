import { doctors } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await doctors.find().toArray();
    return NextResponse.json({ data: data });
}

export async function POST(req: NextRequest) {
    const { username, first_name, last_name, email } = await req.json();
    const existingDoctor = await doctors.findOne({ email });

    if (existingDoctor) {
        return NextResponse.json({
            success: false,
            message: "Email already exists",
        });
    }

    const data = await doctors.insertOne({
        username,
        first_name,
        last_name,
        email,
    });
    return NextResponse.json({ success: true, data });
}
