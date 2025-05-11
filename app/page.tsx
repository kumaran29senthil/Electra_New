import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { VoteIcon, ShieldCheckIcon, TrophyIcon, ActivityIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <VoteIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Electra</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Secure. Transparent. <span className="text-primary">Blockchain Voting.</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Electra provides a secure, transparent, and efficient voting system powered by blockchain technology and advanced AI verification.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="animate-pulse">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px]">
                {/* Stylized voting illustration would go here */}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/10 animate-pulse">
                  <VoteIcon className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
              Our platform combines cutting-edge technology to ensure secure and transparent elections.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Authentication</h3>
              <p className="text-center text-muted-foreground">Multi-factor authentication with biometrics and OTP verification</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Blockchain Voting</h3>
              <p className="text-center text-muted-foreground">Immutable, transparent, and verifiable voting records on Ethereum</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrophyIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Results</h3>
              <p className="text-center text-muted-foreground">Live tallying and result verification with fraud detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Electra Voting System. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}