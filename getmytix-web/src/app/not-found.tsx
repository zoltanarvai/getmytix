import Link from "next/link";
import {PageTitles} from "@/components/molecules";
import {Button} from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
            <PageTitles title="Hiba - 404" subtitle="Nem találtuk a keresett oldalt!"/>

            <section className="flex items-center justify-center">
                <Link href="https://getmytix.io">
                    <Button>
                        Vissza a kezdőoldalra
                    </Button>
                </Link>
            </section>
        </main>
    )
}
