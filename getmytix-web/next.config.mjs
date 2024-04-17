/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["networkingkonferencia.hu", "localhost", "framerusercontent.com", "jegyertekesites.figyelo.hu"],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ["jegyertekesites.figyelo.hu", "getmytix.io"]
        }
    }
};

export default nextConfig;
