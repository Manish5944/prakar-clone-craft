import { Star, Crown, Zap, Check } from "lucide-react";
import Layout from "@/components/Layout";

const Premium = () => {
  const plans = [
    {
      name: "Free",
      icon: <Star className="w-5 h-5" />,
      iconBg: "bg-white/10",
      description: "Get started with limited access.",
      price: "$0",
      period: "/mo",
      billing: null,
      features: [
        "For personal use only",
        "Limited generation access",
        "Lower processing priority",
        "All creations are public",
      ],
      buttonText: "Switch to Free",
      buttonClass: "bg-white/10 hover:bg-white/15 text-white border border-white/10",
      highlight: false,
      badge: null,
    },
    {
      name: "Starter",
      icon: <Crown className="w-5 h-5 text-yellow-400" />,
      iconBg: "bg-orange-500/20",
      description: "For enthusiasts creating occasionally.",
      price: "$16.16",
      period: "/ mo",
      billing: "billed yearly ($194/year)",
      features: [
        "3,600 total generation credits",
        "Private generations",
        "Access to all models",
        "Faster generation speed",
      ],
      buttonText: "Upgrade to Starter",
      buttonClass: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white",
      highlight: false,
      badge: null,
    },
    {
      name: "Pro",
      icon: <Zap className="w-5 h-5 text-green-400" />,
      iconBg: "bg-green-500/20",
      description: "For experts creating daily.",
      price: "$24.66",
      period: "/ mo",
      billing: "billed yearly ($296/year)",
      features: [
        "7,200 total generation credits",
        "All STARTER Features",
        "Fewer content restrictions",
        "Maximum generation speed",
      ],
      buttonText: "Upgrade to Pro",
      buttonClass: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white",
      highlight: true,
      badge: "Best Value",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] relative">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
          <p className="text-center text-green-400 text-sm font-semibold mb-8">
            Save up to 15% with yearly billing!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.highlight
                    ? 'border-purple-500/40 bg-white/[0.04]'
                    : 'border-white/[0.08] bg-white/[0.03]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-5 bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}>
                  {plan.icon}
                </div>

                <h3 className="text-white text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1 min-h-[40px]">{plan.description}</p>

                <div className="mt-4 mb-1">
                  <span className="text-white text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-base ml-1">{plan.period}</span>
                </div>
                {plan.billing && (
                  <p className="text-gray-600 text-xs mb-6">{plan.billing}</p>
                )}
                {!plan.billing && <div className="mb-6" />}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${plan.buttonClass}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Premium;
