type PageTitlesProps = {
    title: string;
    subtitle: string;
};

export const PageTitles: React.FC<PageTitlesProps> = ({title, subtitle}) => {
    return (
        <section className="flex self-center flex-col mt-20 mb-20 max-md:mb-10 items-center">
            <h1 className="text-6xl max-md:text-5xl font-bold tracking-tight text-center">
                {title}
            </h1>
            <h2 className="text-2xl text-gray-500 mt-2 text-center">{subtitle}</h2>
        </section>
    );
};
