import clientPromise from "@/lib/mongodb";

export async function getSubdomains(): Promise<any> {
  try {
    const client = await clientPromise;
    const db = client.db("getmytix");
    //
    // Then you can execute queries against your database like so:
    const result = await db.collection("events").find({}).toArray();

    const domains = result.map((event) => {
      return event.subdomain;
    });

    return domains;
  } catch (e) {
    console.error(e);
  }
}
