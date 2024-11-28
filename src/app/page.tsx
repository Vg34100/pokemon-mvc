import Link from "next/link";
import Image from "next/image";

export default function Home() {
    const sections = [
        {
            title: "Parties",
            link: "/parties",
            bgColor: "bg-blue-400",
            icon: "/images/parties.png",
            size: "col-span-1 row-span-4",
        },
        {
            title: "Pokédex",
            link: "/pokedex",
            bgColor: "bg-red-500",
            icon: "/images/pokeball.png",
            size: "col-span-2 row-span-3",
        },
        {
            title: "Moves",
            link: "/moves",
            bgColor: "bg-yellow-400",
            icon: "/images/moves.png",
            size: "col-span-1 row-span-3",
        },
        {
            title: "Natures",
            link: "/natures",
            bgColor: "bg-purple-400",
            icon: "/images/natures.png",
            size: "col-span-1 row-span-4",
        },
        {
            title: "Abilities",
            link: "/abilities",
            bgColor: "bg-green-400",
            icon: "/images/abilities.png",
            size: "col-span-2",
        },
        {
            title: "Items",
            link: "/items",
            bgColor: "bg-orange-400",
            icon: "/images/items.png",
            size: "col-span-1",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-5 gap-6 p-6 h-[calc(100vh-3rem)] auto-rows-[minmax(150px,1fr)]">
                {sections.map((section, index) => (
                    <Link
                        key={index}
                        href={section.link}
                        className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md hover:scale-105 transition-transform ${section.bgColor} ${section.size}`}
                    >
                        {section.icon && (
                            <Image
                                src={section.icon}
                                alt={section.title}
                                width={
                                    section.title === "Parties"
                                        ? 220
                                        : section.title === "Natures"
                                            ? 120
                                            : section.title === "Moves"
                                                ? 76
                                                : 64
                                }
                                height={
                                    section.title === "Parties"
                                        ? 200
                                        : section.title === "Natures"
                                            ? 110
                                            : section.title === "Moves"
                                                ? 76
                                                : 64
                                }
                            />
                        )}
                        <h2 className="text-xl font-pokemon">{section.title}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}