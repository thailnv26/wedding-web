import { config } from "@/data/config";
import { Polaroid } from "./Polaroid";
import { SectionHeading } from "./SectionHeading";
import { Blossom } from "./Blossom";

export function OurStory() {
  const [first, ...rest] = config.story.photos;

  return (
    <section id="chuyen-tinh" className="relative px-6 py-12">
      <SectionHeading
        overline="Từ ngày đầu tiên"
        script="Chuyện"
        title="Chúng Mình"
        className="reveal"
      />

      <div className="relative mt-8">
        <Polaroid
          src={first}
          alt="Ảnh kỷ niệm"
          rotate={-4}
          reveal
          className="mx-auto w-[62%] max-w-[240px]"
        />
        <div className="mt-4 flex justify-center gap-3">
          {rest.map((src, i) => (
            <Polaroid
              key={src}
              src={src}
              alt="Ảnh kỷ niệm"
              ratio="1 / 1"
              rotate={i === 0 ? 5 : -6}
              reveal
              className="w-[36%] max-w-[140px]"
            />
          ))}
        </div>
        <Blossom className="reveal absolute -top-2 right-0 w-16 text-blush-dark/80" />
      </div>

      <div className="reveal mx-auto mt-9 max-w-[420px] space-y-4 text-left text-[0.9rem] leading-[1.9] text-ink">
        {config.story.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="reveal mt-8 text-center font-script text-2xl text-seal">{config.couple.hashtag}</p>
    </section>
  );
}
