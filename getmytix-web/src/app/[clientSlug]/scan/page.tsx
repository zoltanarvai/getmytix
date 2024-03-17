"use client"

import {ChangeEvent, useEffect, useRef, useState} from "react";
import QrScanner from "qr-scanner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import type {TicketDetails} from "@/app/[clientSlug]/api/tickets/[ticketId]/validate/route";

export default function Scan() {
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    const [scannedResult, setScannedResult] = useState<string | undefined>("");
    const [scannedTicket, setScannedTicket] = useState<TicketDetails>();
    const [ticketCode, setTicketCode] = useState("");
    const [noSuchTicket, setNoSuchTicket] = useState(false);

    useEffect(() => {
        if (scannedResult) {
            retrieveTicketData(scannedResult!).catch();
        }

    }, [scannedResult]);

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl?.current || undefined,
            });

            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!qrOn)
            alert(
                "A kamera nem hozzáférhető. Kérem engedélyezze a kamera hozzáférést és frissítse be az oldalt."
            );
    }, [qrOn]);

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        setScannedResult(result?.data);
    };

    const onScanFail = (_err: string | Error) => {
    };

    const retrieveTicketData = async (ticketId: string) => {
        setTicketCode("");
        setNoSuchTicket(false);

        const response = await fetch(`api/tickets/${ticketId}/validate`);
        if (response.status === 404) {
            setNoSuchTicket(true);
        } else {
            const ticketDetails = await response.json();
            setScannedTicket(ticketDetails);
        }
    }

    const handleCodeInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value
        setTicketCode(code);
    }

    const handleCodeSubmit = async () => {
        if (ticketCode) {
            setNoSuchTicket(false);
            setScannedTicket(undefined);
            setTicketCode("");
            setScannedResult(undefined);

            const response = await fetch(`api/tickets/${ticketCode.toUpperCase()}/validate-code`);
            if (response.status === 404) {
                setNoSuchTicket(true);
            } else {
                const ticketDetails = await response.json();
                setScannedTicket(ticketDetails);
            }
        }
    }

    return (
        <section className="flex flex-col mx-2 mt-4">
            <div className="h-1/2 w-full">
                <video ref={videoEl}
                       className="w-full h-full max-h-64 m-auto relative object-cover"></video>
                <div ref={qrBoxEl} className="w-full max-h-64 left-0">
                    <img
                        src="/qr-frame.svg"
                        alt="Qr Frame"
                        width={200}
                        height={200}
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-items-center items-center my-4">
                <h2 className="font-bold">Kód ellenőrzése</h2>
                <Input type="text" onChange={handleCodeInputChange} className="w-2/3 mt-2 text-md"/>
                <Button onClick={handleCodeSubmit} className="w-2/3 mt-2" disabled={!ticketCode}>Ellenőriz</Button>
            </div>
            <div className="w-full m-auto border border-gray-200 my-2"/>
            {noSuchTicket && (
                <div className="w-full">
                    <p className="font-bold text-center">A jegy nem található!</p>
                </div>
            )}
            {!noSuchTicket && (
                <div className="h-1/2 w-full mb-4">
                    <div className="flex justify-between">
                        <p className="font-bold">Azonosító</p>
                        <p>{scannedTicket?.ticketId || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Kód</p>
                        <p>{scannedTicket?.ticketCode || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Név</p>
                        <p>{scannedTicket?.name || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Cégnév</p>
                        <p>{scannedTicket?.company || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Pozíció</p>
                        <p>{scannedTicket?.position || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Esemény</p>
                        <p className="w-1/2 text-right">{scannedTicket?.eventName || "-"}</p>
                    </div>
                </div>
            )}
        </section>
    )
}