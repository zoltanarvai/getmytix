import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {NextRequest} from "next/server";

const client = new S3Client({region: "eu-central-1"});

export async function GET(_request: NextRequest, {params}: { params: { ticketId: string } }) {
    const downloadCommand = new GetObjectCommand({
        Bucket: "getmytix-tickets-prod.getmytix.io",
        Key: `${params.ticketId}.pdf`,
    });

    const data = await client.send(downloadCommand);
    const inputStream = data.Body;

    if (!inputStream) {
        return Response.json({error: "Not found"}, {status: 404});
    }


    // set the headers to tell the browser to download the file
    const headers = new Headers();
    // remember to change the filename `test.pdf` to whatever you want the downloaded file called
    headers.append("Content-Disposition", `attachment; filename="test.pdf"`);
    headers.append("Content-Type", 'application/octet-stream');

    const stream = inputStream.transformToWebStream();

    return new Response(stream, {
        headers,
    });
}