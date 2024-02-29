/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["networkingkonferencia.hu", "localhost", "framerusercontent.com", "egyertekesites.figyelo.hu"],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ["jegyertekesites.figyelo.hu", "getmytix.io"]
        }
    }
};

export default nextConfig;
