import { Hero } from '../components/Hero';
import { Eras } from '../components/Eras';
import { Attractions } from '../components/Attractions';
import { MenuHighlights } from '../components/MenuHighlights';
import { VisitInfo } from '../components/VisitInfo';
import { FAQ } from '../components/FAQ';

export function Home({ onOpenTickets }: { onOpenTickets: () => void }) {
  return (
    <>
      <Hero onOpenTickets={onOpenTickets} />
      <Eras onOpenTickets={onOpenTickets} />
      <Attractions onOpenTickets={onOpenTickets} />
      <MenuHighlights />
      <VisitInfo onOpenTickets={onOpenTickets} />
      <FAQ />
    </>
  );
}
