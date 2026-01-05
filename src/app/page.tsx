'use client';

import Link from 'next/link';
import { ArrowRight, Smartphone, Palette, Server, Zap, Shield, Github } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <span className="font-semibold text-xl">MifosForge</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="https://github.com/openMF" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Build White-Labeled
            <span className="text-primary"> Mobile Banking</span> Apps
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Generate production-ready Mifos KMP mobile banking applications with custom branding,
            themes, and complete CI/CD pipelines in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/openMF/mobile-wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-input bg-background px-8 py-3 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Source
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <FeatureCard
            icon={<Smartphone className="w-6 h-6" />}
            title="Multiple Base Apps"
            description="Choose from Mobile Wallet, Client App, or Field Officer App as your starting point"
          />
          <FeatureCard
            icon={<Palette className="w-6 h-6" />}
            title="Custom Branding"
            description="Configure colors, themes, icons, and splash screens to match your brand"
          />
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Server Configuration"
            description="Set up multiple environments with custom API endpoints and settings"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="CI/CD Pipelines"
            description="Pre-configured GitHub Actions for Firebase, Play Store, and App Store deployment"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Security Features"
            description="Biometric auth, SSL pinning, root detection, and more security options"
          />
          <FeatureCard
            icon={<Github className="w-6 h-6" />}
            title="Ready to Deploy"
            description="Download a complete project ZIP or push directly to GitHub"
          />
        </div>

        {/* Supported Apps */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Supported Base Applications</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AppCard
              name="Mobile Wallet"
              description="P2P payments, QR transfers, mobile money"
              repo="mobile-wallet"
            />
            <AppCard
              name="Mifos Mobile"
              description="Client self-service for accounts, loans, savings"
              repo="mifos-mobile"
            />
            <AppCard
              name="Android Client"
              description="Field officer tools for loan management"
              repo="android-client"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Built by the Mifos Initiative. Open source under Apache 2.0 License.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function AppCard({ name, description, repo }: { name: string; description: string; repo: string }) {
  return (
    <a
      href={`https://github.com/openMF/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all"
    >
      <h3 className="font-semibold mb-2">{name}</h3>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>
      <span className="text-primary text-sm font-medium">View on GitHub &rarr;</span>
    </a>
  );
}
