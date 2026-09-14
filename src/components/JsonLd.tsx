import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/seo";

export default function JsonLd() {
  const base = getSiteUrl();

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_TITLE,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    url: base,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: base,
      address: {
        "@type": "PostalAddress",
        streetAddress: "34A, Dr.Besant Road, Vijayalakshmi Theatre(opp)",
        addressLocality: "Kumbakonam",
        postalCode: "612001",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      telephone: ["+91-7200100864", "+91-9597552232"],
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: base,
    description: SITE_DESCRIPTION,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate solar panel kW from my TNEB bill?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your bimonthly TNEB bill amount or units in the UB Solars calculator. It estimates consumption, recommends a rooftop system size in kW, and shows subsidy, EMI, and post-solar savings.",
        },
      },
      {
        "@type": "Question",
        name: "Is this TNEB solar calculator free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The UB Solars TNEB solar kW calculator is free to use with no signup required.",
        },
      },
      {
        "@type": "Question",
        name: "Does the calculator include PM Surya Ghar subsidy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. After sizing your system, the calculator estimates PM Surya Ghar subsidy tiers, net investment, EMI, and expected savings for Tamil Nadu homes.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
