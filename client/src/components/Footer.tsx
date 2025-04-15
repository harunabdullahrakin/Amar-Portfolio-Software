interface FooterProps {
  name: string;
}

export default function Footer({ name }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center text-gray-500 text-sm py-4">
      <p>© {currentYear} {name}. All rights reserved.</p>
      <p className="mt-1 text-xs">made with 💝 by Harun Abdullah</p>
    </footer>
  );
}
