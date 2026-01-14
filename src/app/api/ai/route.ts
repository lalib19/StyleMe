import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

fal.config({
    credentials: process.env.FAL_KEY
});

export async function POST(request: Request) {
    const { model, garment } = await request.json();

    try {
        const result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
            input: {
                model_image: model,
                garment_image: garment,
                output_format: "png"
                // Doc : Output format of the generated images. 'png' is highest quality, while 'jpeg' is faster. Default value: "png"
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });

        console.log(result);
        return NextResponse.json(result);
    } catch (err) {
        console.error("Image generation error:", err);
        return NextResponse.json(
            { error: "Image generation failed" },
            { status: 500 }
        );
    }

}