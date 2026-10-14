
interface BookPillProps {
  subscriptionRequired: boolean;
}

export default function BookPill({
  subscriptionRequired,
}: BookPillProps) {
  if (!subscriptionRequired) return null;

  return (
    <span className="absolute -top-5 right-0 rounded-full bg-[#032b41] px-2 py-0.5 text-xs text-white">
      Premium
    </span>
  );
}
