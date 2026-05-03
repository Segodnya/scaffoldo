import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-sm text-muted-foreground">That page does not exist.</p>
      <Link href="/" className="text-sm underline">Home</Link>
    </main>
  );
}
