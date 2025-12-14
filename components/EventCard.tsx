import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}
const EventCard = ({ title, image, slug, location, date, time }: Props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} className="poster"></Image>
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" width={20} height={20} alt="location" />
                <p>{location}</p>
            </div>
            <p className="title">{title}</p>
            <div className="datetime">
                <div> 
                    <Image src="/icons/calendar.svg" width={20} height={20} alt="location" />
                    <p>{date}</p>
                </div>
                <div> 
                    <Image src="/icons/clock.svg" width={20} height={20} alt="location" />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard