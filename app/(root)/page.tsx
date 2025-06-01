import Footer4Col from "@/components/mvpblocks/footer-4col";
import HeroGeometric from "@/components/mvpblocks/geometric-hero";
import LogoCLoud from "@/components/mvpblocks/logo-cloud";

export default function Home() {
  return (
    <>
      <HeroGeometric
        title1="Discover Your Perfect"
        title2="Career Path"
        badge="KaziCoach"
      />

      <LogoCLoud />

      <Footer4Col imgPath="/coach.svg" logoTitle="KaziCoach" />
    </>
  );
}
