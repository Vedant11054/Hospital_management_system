import { 
  Building2, 
  UserCog, 
  Stethoscope, 
  Heart,
  Bot,
  Lock,
  BarChart3,
  Calendar,
  FileText,
  CreditCard
} from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Multi-Hospital Management',
    description: 'Manage multiple hospitals from a single dashboard with complete isolation and custom configurations.',
    color: 'primary'
  },
  {
    icon: UserCog,
    title: 'Role-Based Access Control',
    description: 'Four distinct roles with granular permissions: Super Admin, Hospital Admin, Doctor, and Patient.',
    color: 'accent'
  },
  {
    icon: Bot,
    title: 'AI-Powered Assistant',
    description: 'Intelligent chatbot with role-specific behavior. Helps with scheduling, FAQs, and clinical references.',
    color: 'info'
  },
  {
    icon: Lock,
    title: 'Blockchain Verification',
    description: 'Immutable audit trails and tamper-proof verification for medical records and prescriptions.',
    color: 'success'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Flexible appointment management with emergency slots, walk-ins, and automated reminders.',
    color: 'warning'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards with insights on revenue, appointments, and resource utilization.',
    color: 'primary'
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Create, sign, and verify prescriptions digitally with complete audit trails.',
    color: 'accent'
  },
  {
    icon: CreditCard,
    title: 'Integrated Billing',
    description: 'Seamless payment processing, invoicing, and financial reporting for hospitals.',
    color: 'success'
  }
];

const roleCards = [
  {
    icon: Building2,
    role: 'Super Admin',
    description: 'Global platform management, hospital onboarding, and SaaS configuration.',
    features: ['Hospital Management', 'Global Analytics', 'Billing & Invoices', 'System Configuration']
  },
  {
    icon: UserCog,
    role: 'Hospital Admin',
    description: 'Complete hospital operations control within their institution.',
    features: ['Doctor Management', 'Appointment Config', 'Revenue Reports', 'Staff Scheduling']
  },
  {
    icon: Stethoscope,
    role: 'Doctor',
    description: 'Patient care, appointments, and medical documentation.',
    features: ['Patient Records', 'Prescriptions', 'Availability', 'Clinical Notes']
  },
  {
    icon: Heart,
    role: 'Patient',
    description: 'Self-service portal for health management and appointments.',
    features: ['Book Appointments', 'View Records', 'Pay Bills', 'Family Profiles']
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Run a Modern Hospital
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed for healthcare organizations of all sizes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Four Distinct User Experiences
          </h3>
          <p className="text-muted-foreground">
            Each role has a tailored dashboard, permissions, and AI assistant behavior
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleCards.map((card, index) => (
            <div 
              key={index}
              className="relative p-6 rounded-2xl bg-card border border-border overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">{card.role}</h4>
                <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                <ul className="space-y-2">
                  {card.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
