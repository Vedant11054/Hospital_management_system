import { Shield, Lock, FileCheck, Eye, Database, Key } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'JWT Authentication',
    description: 'Secure token-based authentication with automatic refresh and session management.'
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'RBAC enforced at both API and database levels with strict data isolation.'
  },
  {
    icon: Eye,
    title: 'Audit Logging',
    description: 'Complete trail of who accessed what, when, and from where.'
  },
  {
    icon: FileCheck,
    title: 'Blockchain Integrity',
    description: 'SHA-256 hashes of critical documents stored on immutable ledger.'
  },
  {
    icon: Database,
    title: 'Data Encryption',
    description: 'AES-256 encryption at rest and TLS 1.3 for data in transit.'
  },
  {
    icon: Key,
    title: 'Signed URLs',
    description: 'Time-limited secure file access with automatic expiration.'
  }
];

export const SecuritySection = () => {
  return (
    <section id="security" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Enterprise-Grade Security</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built for Healthcare
              <span className="block text-gradient">Compliance Standards</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              MediCore is designed from the ground up with healthcare compliance in mind. 
              Every feature meets or exceeds HIPAA, GDPR, and industry security standards.
            </p>

            <div className="flex flex-wrap gap-4">
              {['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001'].map((badge) => (
                <div key={badge} className="px-4 py-2 rounded-lg bg-card border border-border font-semibold text-sm">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className="p-5 rounded-xl bg-card border border-border hover:border-success/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-success" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
