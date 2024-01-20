import clientPromise from "@/lib/mongodb";
import { Button } from "@/components/ui/button";

async function getEvent(eventId: string): Promise<any> {
  try {
    const client = await clientPromise;
    const db = client.db("getmytix");
    //
    // Then you can execute queries against your database like so:
    const result = await db.collection("events").findOne({
      subdomain: eventId,
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

type HomeProps = {
  params: {
    ":id": string;
  };
};

export default async function Home(props: HomeProps) {
  console.log(props);
  const event = await getEvent(props.params[":id"]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to my Event!</h1>
      <h2>Details: {JSON.stringify(event, null, 4)}</h2>
      <Button>Click me</Button>
    </main>
  );
}
