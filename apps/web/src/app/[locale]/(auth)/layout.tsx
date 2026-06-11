export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crema to-arena p-4">
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
