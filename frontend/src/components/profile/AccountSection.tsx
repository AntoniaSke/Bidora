import ProfileNav from "./ProfileNav";

type AccountSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AccountSection({
  title,
  description,
  children,
}: AccountSectionProps) {
  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-14
        lg:py-20
      "
    >
      {/* PAGE HEADER */}
      <div>
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--bidora-accent)]
          "
        >
          Your account
        </p>

        <h1
          className="
            mt-3
            text-4xl
            sm:text-5xl
            font-bold
            tracking-tight
            text-[var(--bidora-text)]
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-4
            text-[var(--bidora-text-secondary)]
          "
        >
          {description}
        </p>
      </div>

      {/* NAV + CONTENT */}
      <div className="mt-10">
        <ProfileNav />

        <div className="mt-10">
          {children}
        </div>
      </div>
    </section>
  );
}