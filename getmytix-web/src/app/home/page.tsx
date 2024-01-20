import clientPromise from "../../lib/mongodb";

type ConnectionStatus = {
  isConnected: boolean;
};

async function connectToMongoDB(): Promise<ConnectionStatus> {
  try {
    await clientPromise;
    return { isConnected: true };
  } catch (e) {
    console.error(e);
    return { isConnected: false };
  }
}

export default async function Home() {
  const connection = await connectToMongoDB();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to GetMyTix.io!</h1>
      <h2>DB Connection: {connection.isConnected ? "Active" : "Not Active"}</h2>
    </main>
  );
}
