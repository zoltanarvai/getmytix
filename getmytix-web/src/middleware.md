"use server";
import {NextRequest, NextResponse} from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    let hostname = req.headers
        .get("host")!
        .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // special case for Vercel preview deployment URLs
    if (
        hostname.includes("---") &&
        hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
        hostname = `${hostname.split("---")[0]}.${
            process.env.NEXT_PUBLIC_ROOT_DOMAIN
        }`;
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
    }`;
    const [subDomain, domain, rootDomain] = hostname.split(".");

    // rewrites for api calls
    if (
        `${domain}.${rootDomain}` === process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
        subDomain === "api"
    ) {
        console.debug("rewriting to api", "/api", req.url);
        return NextResponse.rewrite(
            new URL(`/api${path === "/" ? "" : path}`, req.url)
        );
    }

    // rewrites for api calls
    if (
        `${domain}.${rootDomain}` === process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
        subDomain === "download"
    ) {
        console.debug("rewriting to download", "/download", req.url);
        return NextResponse.rewrite(
            new URL(`/download${path === "/" ? "" : path}`, req.url)
        );
    }

    // rewrites for event pages
    if (
        `${domain}.${rootDomain}` === process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
        subDomain !== "www" &&
        subDomain !== "api" &&
        subDomain !== "download"
    ) {
        console.debug("rewriting to event page", "/events/${subDomain}", req.url);
        return NextResponse.rewrite(
            new URL(`/events/${subDomain}${path === "/" ? "" : path}`, req.url)
        );
    }

    // special case for `vercel.pub` domain
    if (hostname === "vercel.pub") {
        return NextResponse.redirect(
            "https://vercel.com/blog/platforms-starter-kit"
        );
    }

    // rewrite root application to `/home` folder
    if (
        hostname === "localhost:3000" ||
        hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
        hostname === `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    ) {
        return NextResponse.rewrite(
            new URL(`/home${path === "/" ? "" : path}`, req.url)
        );
    }

    // rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
