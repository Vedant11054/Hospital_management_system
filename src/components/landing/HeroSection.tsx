import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Building2, Users, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden pt-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted by 500+ Hospitals Worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Healthcare Management
            <span className="block text-gradient">Reimagined</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A complete multi-tenant hospital management system with AI-powered assistance, 
            blockchain-verified records, and enterprise-grade security.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/demo">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Schedule a Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">HIPAA Compliant</p>
                <p className="text-sm text-muted-foreground">Enterprise Security</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Multi-Tenant</p>
                <p className="text-sm text-muted-foreground">SaaS Architecture</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Role-Based</p>
                <p className="text-sm text-muted-foreground">Access Control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
