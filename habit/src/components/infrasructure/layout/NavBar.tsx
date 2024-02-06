import Link from "next/link";

type NavBarProps = {
  children: React.ReactNode;
};

export default function NavBar({ children }: NavBarProps) {
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex flex-row justify-between w-full">{children}</div>
    </div>
  );
}
