import Image from "next/image";

type Props = {
  storeName: string;
  primaryColor: string;
};

export function HeroSection({ storeName, primaryColor }: Props) {
  return (
    <section className="relative w-full min-w-0 overflow-hidden bg-stone-950 text-white">
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover object-[center_right] sm:object-right"
        sizes="100vw"
      />
      {/* Darken left side so headline stays readable over the photo */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15 sm:from-black/85 sm:via-black/45 sm:to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 20% 50%, ${primaryColor}, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[min(88vh,640px)] w-full max-w-6xl min-w-0 items-center px-4 py-14 sm:min-h-[min(85vh,720px)] sm:px-6 sm:py-16 md:py-20">
        <div className="w-full max-w-md text-left sm:max-w-lg md:max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75 sm:text-sm sm:tracking-[0.2em]">
            Fresh · Handcrafted · Order Online
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight break-words sm:mt-4 sm:text-4xl md:text-5xl">
            Steaming dumplings, made to order
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 break-words sm:text-lg">
            Welcome to {storeName}. Explore the full menu, add your favourites,
            and checkout in minutes — pickup or delivery.
          </p>
          <a
            href="#menu"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition sm:mt-8 sm:w-fit sm:hover:scale-[1.02]"
            style={{ backgroundColor: primaryColor }}
          >
            Order now
          </a>
        </div>
      </div>
    </section>
  );
}
