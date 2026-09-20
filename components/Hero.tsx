import type { ResolvedSide } from "@/lib/side";
import { config } from "@/data/config";
import { Blossom } from "./Blossom";
import { Polaroid } from "./Polaroid";

export function Hero({ side }: { side: ResolvedSide }) {
  const [firstName, secondName] = side.headline;

  return (
    <section id="trang-chu" className="relative px-6 pt-14 pb-10 text-center">
      <p className="text-[0.6rem] tracking-[0.4em] text-ink-soft uppercase">Lễ {side.ceremony}</p>

      <h1 className="mt-3 font-script text-[2.7rem] leading-[1.1] text-wine sm:text-6xl">
        <span className="block">{firstName}</span>
        <span className="block font-display text-3xl text-petal italic sm:text-4xl">&amp;</span>
        <span className="block">{secondName}</span>
      </h1>

      <p className="mt-4 text-xs tracking-[0.42em] text-ink-soft">{side.dateLine}</p>

      <div className="relative mt-9">
        <Polaroid
          src={config.hero.photo}
          alt={`${firstName} và ${secondName}`}
          rotate={-3}
          priority
          reveal
          className="mx-auto w-[74%] max-w-[300px]"
        />
        <Polaroid
          src={config.hero.sidePhoto}
          alt="Ảnh cưới"
          rotate={7}
          ratio="1 / 1"
          reveal
          className="absolute right-2 -bottom-6 w-[38%] max-w-[150px] sm:right-8"
        />
        <Blossom className="absolute -top-4 -left-1 w-20 text-blush-dark" />
      </div>

      <p className="mt-16 text-[0.6rem] tracking-[0.35em] text-ink-soft uppercase">
        Cuộn xuống để xem thiệp
      </p>
    </section>
  );
}
