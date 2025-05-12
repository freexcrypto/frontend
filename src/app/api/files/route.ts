import { pinata } from "@/config/PinataConfig";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    // const { cid } = await pinata.upload.public.file(file);
    // const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const uploadData = await pinata.upload.public.file(file);
    // Construct the IPFS URL manually since pinata.gateways.convert() seems to return undefined
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${uploadData.cid}`;
    return NextResponse.json(ipfsUrl, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
