import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">DT</span>
          </div>
          <span className="font-bold text-xl text-text">
            Decreto<span className="text-primary">Track</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-light hover:text-primary transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-text-light hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-text-light hover:text-primary transition-colors">
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero-gradient pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
          Built for Act 60 Decree Holders in Puerto Rico
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Never Lose Your
          <br />
          Tax Decree Again
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Track your 183-day presence requirement, charitable donations, and
          compliance deadlines — all in one dashboard. Stay audit-ready 365 days
          a year.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Start 14-Day Free Trial
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 text-lg"
          >
            See How It Works
          </a>
        </div>
        <p className="text-white/60 text-sm mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "$0", label: "Capital Gains Tax" },
    { value: "4%", label: "Corporate Tax Rate" },
    { value: "183", label: "Days Required in PR" },
    { value: "$10K+", label: "Charitable Donations/yr" },
  ];
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-sm text-text-light mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "📅",
      title: "183-Day Presence Tracker",
      description:
        "Interactive calendar to log your days in Puerto Rico. See your running count, projected year-end total, and get alerts if you're falling behind.",
    },
    {
      icon: "💝",
      title: "Donation Tracker",
      description:
        "Track charitable contributions to approved PR nonprofits. Upload receipts, monitor totals, and ensure you meet the annual requirement.",
    },
    {
      icon: "📊",
      title: "Compliance Score",
      description:
        "Real-time compliance score across all requirements. One glance tells you if you're on track or need to take action.",
    },
    {
      icon: "🔔",
      title: "Filing Deadline Alerts",
      description:
        "Never miss an annual report or filing deadline. Get email and in-app reminders weeks before every due date.",
    },
    {
      icon: "📁",
      title: "Document Vault",
      description:
        "Securely store travel records, donation receipts, employment contracts, and other compliance documents in one place.",
    },
    {
      icon: "🤖",
      title: "AI Compliance Assistant",
      description:
        "Ask questions about your decree requirements and get instant answers. Powered by AI trained on Act 60 regulations.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Everything You Need to Stay Compliant
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Stop paying consultants thousands just to track your compliance.
            DecretoTrack automates it all.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-text-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect Your Decree",
      description:
        "Enter your decree type (Act 20, 22, or 60) and specific requirements. We'll customize your dashboard accordingly.",
    },
    {
      step: "02",
      title: "Track Daily",
      description:
        "Log your presence days, donations, and employment activities. Takes less than 30 seconds a day.",
    },
    {
      step: "03",
      title: "Stay Compliant",
      description:
        "Your compliance score updates in real-time. Get alerts before deadlines and export reports for your CPA.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            How It Works
          </h2>
          <p className="text-lg text-text-light">
            Get set up in under 5 minutes
          </p>
        </div>
        <div className="space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {item.title}
                </h3>
                <p className="text-text-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "29",
      description: "For individual decree holders",
      features: [
        "183-day presence tracker",
        "Donation tracking",
        "Compliance score",
        "Email deadline reminders",
        "Basic document storage (1 GB)",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "59",
      description: "For active investors & entrepreneurs",
      features: [
        "Everything in Starter",
        "AI compliance assistant",
        "CPA export reports",
        "Multi-decree support",
        "Priority support",
        "Document storage (10 GB)",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "99",
      description: "For families & advisors managing multiple decrees",
      features: [
        "Everything in Professional",
        "Unlimited decree profiles",
        "Team/family access",
        "API access",
        "Dedicated account manager",
        "Unlimited document storage",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-text-light">
            Less than a single hour of CPA time per month
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? "bg-primary text-white shadow-xl scale-105"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="text-sm font-medium text-accent-light mb-4">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-xl font-semibold ${
                  plan.popular ? "text-white" : "text-text"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  plan.popular ? "text-white/70" : "text-text-light"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-6 mb-8">
                <span
                  className={`text-5xl font-bold ${
                    plan.popular ? "text-white" : "text-text"
                  }`}
                >
                  ${plan.price}
                </span>
                <span
                  className={plan.popular ? "text-white/70" : "text-text-light"}
                >
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className={plan.popular ? "text-accent-light" : "text-success"}>
                      &#10003;
                    </span>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white/90" : "text-text-light"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-gray-50"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What is Act 60 and who is this for?",
      a: "Act 60 (consolidating former Acts 20, 22, and others) provides tax incentives for individuals and businesses that relocate to Puerto Rico. DecretoTrack is built for decree holders who need to maintain compliance with their specific requirements.",
    },
    {
      q: "How does the 183-day presence test work?",
      a: "To maintain your tax benefits, you must be physically present in Puerto Rico for at least 183 days per year. DecretoTrack makes it easy to log and verify each day, with projections so you always know where you stand.",
    },
    {
      q: "Can my CPA access my data?",
      a: "Yes! On Professional and Enterprise plans, you can export compliance reports in PDF and CSV formats, or grant your CPA read-only access to your dashboard.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. All data is encrypted at rest and in transit. We use bank-level security and never share your information with third parties.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. No contracts, no cancellation fees. You can export all your data at any time.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-surface rounded-2xl p-6 cursor-pointer"
            >
              <summary className="flex items-center justify-between font-semibold text-text list-none">
                {faq.q}
                <span className="text-primary ml-4 group-open:rotate-45 transition-transform text-2xl">
                  +
                </span>
              </summary>
              <p className="text-text-light mt-4 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-text py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <span className="font-bold text-xl text-white">
              Decreto<span className="text-accent">Track</span>
            </span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
            <a href="mailto:hello@decretotrack.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DecretoTrack. Built in Puerto Rico.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
