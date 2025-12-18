import Bookevent from "@/components/Bookevents";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailsItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Image src={icon} width={20} height={20} alt={alt} />
      <p>{label}</p>
    </div>
  )
}

const EventAgenda = ({ agendaItem }: { agendaItem: string[] }) => {
  return (
    <div className="agenda">
      <ul>
        {agendaItem.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>{tag}</div>
      ))}
    </div>
  )
}

const EventDetailsPages = async ({ params }: { params: Promise<{ slug: string }> }) => {
  
  'use cache'
  cacheLife('hours');
  
  const { slug } = await params;

  let event;

  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch event: ${request.statusText}`);
    }
    const response = await request.json();
    event = response.event;
    if (!event) {
      return notFound();
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return notFound();
  }

  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

  if (!description) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  console.log(similarEvents)
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
        <div className="details">
          { /*left side - event content*/}
          <div className="content">
            <Image src={image} className="banner" width={800} height={800} alt="Event Banner" />
            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{overview}</p>
            </section>
            <section className="flex-col-gap-2">
              <h2>Event Details</h2>
              <EventDetailsItem icon="/icons/calendar.svg" alt="date" label={date} />
              <EventDetailsItem icon="/icons/clock.svg" alt="time" label={time} />
              <EventDetailsItem icon="/icons/pin.svg" alt="location" label={location} />
              <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode} />
              <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience} />
            </section>

            <EventAgenda agendaItem={agenda} />

            <section className="flex-col-gap-2">
              <h2>Organizer</h2>
              <p>{organizer}</p>
            </section>

            <EventTags tags={tags} />
          </div>
          { /*right side - booking form*/}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              {bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} others who have already signed up
                </p>
              ) : (
                <p className="text-sm">
                  Be the first to book your spot
                </p>
              )}

              <Bookevent eventId={event._id} slug={event.slug} />
            </div>
          </aside>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailsPages;