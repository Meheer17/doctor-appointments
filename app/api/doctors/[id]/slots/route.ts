import { doctors } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id
    const data = await doctors.find({_id: new ObjectId(id)}).toArray();
    return NextResponse.json({ message: data });
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
