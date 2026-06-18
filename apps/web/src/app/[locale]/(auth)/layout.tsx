export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-crema p-4 sm:p-6">
      <main className="w-full max-w-4xl">{children}</main>
    </div>
  );
}
