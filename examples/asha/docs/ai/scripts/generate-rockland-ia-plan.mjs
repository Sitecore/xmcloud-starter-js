/**
 * Generates the Rockland IA creation plan with field values for each page.
 * Run: node docs/ai/scripts/generate-rockland-ia-plan.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TREE = `
  - shared
    - Deposit Protection
    - Treasury Management
    - Merchant Services
    - Equipment Leasing
    - International Banking
    - Condo Association Banking and Lending
    - Foreign Currency Exchange Locations
    - Business Credit Cards
    - Online Banking
  - Personal
    - Banking
      - Checking Products
        - Checking Product Rates
        - Free Checking
        - Free Student Checking
        - Advantage Checking
        - Rockland Complete Checking
        - Overdraft Services
      - Savings Products
        - Savings, CDs and Money Market Rates
        - Free Savings
        - Certificates of Deposit (CDs)
        - Money Market Savings
        - Rockland Complete Money Market Savings
      - Credit Cards
    - Loans
      - Mortgage Products
        - Fixed-Rate Mortgages
        - Adjustable-Rate Mortgages
        - Jumbo Mortgages
        - Mortgage Refinancing
        - First-Time Homebuyers
        - Government Mortgage Programs
        - Home Loan Pre-Approval
        - Mortgage FAQs
        - Construction Loans
      - Home Equity Products
        - Home Equity Rates
        - Home Equity Lines of Credit
        - Home Equity Loans
        - Express Mortgage
        - Home Equity FAQs
    - Services
      - NH Student Loans
      - Online & Mobile Banking
      - Branch Services
      - Branches with Coin Counters
      - Branches with Sunday Hours
      - Debit Card
    - Helpful Info
      - Contact Us Form
      - Mortgage Team
      - First Time Home Buyers
  - Small Business
    - Banking
      - Business Checking
      - Business Debit Cards
      - Business Payments and Invoicing
      - Savings, Money Markets & CDs
    - Loans
      - Small Business Loan Options
      - SBA Loans
      - Business Loans and Lines of Credit
      - Business Equipment Loans
    - Specialized Banking
      - Premier Banking for Professionals
    - Services
      - Contact the Team
      - Business Team
  - Commercial
    - Banking
      - Commercial Purchase Card
      - Commercial Checking
      - Savings, Money Markets & CDs
    - Loans
      - Asset-Based Loans
      - Commercial Mortgage Loans
      - Equipment Loans
      - Security Alarm Lending
      - Real Estate Owned Properties
      - Franchise Financing
      - Construction and Development Loans
    - Specialized Banking
      - Account Verification Services
      - Non-Profit Banking and Lending
      - Escrow Services
      - Government and Municipal Banking
    - Helpful Info
      - Contact the Team
      - Commercial Lending Centers
      - Commercial Economic Insights
  - Wealth & Investments
    - Individuals & Families
      - Financial & Retirement Planning
      - Investment Management
      - Personal Insurance
      - Trust & Estate Services
      - Special Needs Services
      - Premier Banking
    - Business Owners
      - Business Retirement Plan Services
      - Business Insurance
      - Business Financial Planning
      - Business Investment Management
      - Business Owner Advisory Services
    - Institutions/Government
      - Government & Municipal Investing
      - Investing for Non-Profits
      - Institutional Investing
    - Getting Started
    - Helpful Info
      - Insights
      - Contact Investment Management Group
      - Investment Team
  - Learning Center
    - Personal Banking Resources
      - Everyday Finances
      - Homebuying & Homeownership
      - Planning for the Future
      - Fraud Prevention
      - Expert Insights
      - Financial Tools
      - Podcasts
        - Behind The Curtain: Money Made Simple
    - Business Banking Resources
      - Finance & Cash Flow
      - Plan & Manage
      - Fraud Prevention
      - Community Insights
      - Business Webinars
        - Rockland Trust Business Strategy Series
    - Financial Literacy
      - Ms. Money's Classroom
      - About Ms. Money
      - Credit for Life Fair - Money Management for Teens
      - CFPB Multi-Lingual Resources
    - Recent Articles
  - Locations
  - Careers
  - Contact Us
  - About Us
  - FAQs
  - Rates
`;

function toItemName(label) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function shortTitle(label) {
  if (label.length <= 40) return label;
  return label.replace(/\s+(Products|Overview|Services|Banking|Resources)$/i, '').slice(0, 40);
}

function buildFields(label, contextPath) {
  const section = contextPath[0] ?? 'Rockland Trust';
  const parent = contextPath[contextPath.length - 1] ?? section;
  const brand = 'Rockland Trust';

  const summaries = {
    shared: `${label} resources from ${brand} — trusted banking solutions for personal, business, and commercial clients across Massachusetts and Rhode Island.`,
    Personal: `${label} from ${brand} personal banking — checking, savings, loans, and services designed to help you manage everyday finances with confidence.`,
    'Small Business': `${label} for small business clients at ${brand} — practical banking, lending, and payment solutions to support growth.`,
    Commercial: `${label} for commercial clients at ${brand} — specialized banking, lending, and treasury services for complex business needs.`,
    'Wealth & Investments': `${label} through ${brand} wealth and investment services — planning, management, and advisory support for individuals and institutions.`,
    'Learning Center': `${label} in the ${brand} Learning Center — articles, tools, and resources to help you make informed financial decisions.`,
    Locations: `Find ${brand} branch and ATM locations across Massachusetts and Rhode Island.`,
    Careers: `Explore career opportunities at ${brand} — where each relationship matters.`,
    'Contact Us': `Contact ${brand} for personal, business, or commercial banking support.`,
    'About Us': `Learn about ${brand} — a full-service commercial bank headquartered in Massachusetts.`,
    FAQs: `Frequently asked questions about ${brand} products, services, and accounts.`,
    Rates: `View current rates for ${brand} deposit, loan, and credit products.`,
  };

  const rootKey = contextPath[0] ?? 'Rockland Trust';
  const summaryBase =
    summaries[rootKey] ??
    `${label} — part of ${parent} at ${brand}. Explore products, services, and guidance tailored to your financial goals.`;

  return {
    pageTitle: label,
    pageShortTitle: shortTitle(label),
    pageHeaderTitle: label.includes(brand) ? label : `${label} | ${brand}`,
    pageSummary: summaryBase,
    pageSubtitle: `Banking solutions from ${brand} — where each relationship matters.`,
  };
}

function parseTree(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().startsWith('-'));

  const nodes = [];
  const stack = [{ depth: -1, label: 'Home', path: [] }];

  for (const line of lines) {
    const depth = (line.match(/^(\s*)/)?.[1].length ?? 0) / 2;
    const label = line.replace(/^\s*-\s*/, '').trim();

    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    const path = [...parent.path, label];
    const node = {
      label,
      itemName: toItemName(label),
      depth,
      parentLabel: parent.label,
      path,
      fields: buildFields(label, path),
    };
    nodes.push(node);
    stack.push({ depth, label, path });
  }

  return nodes;
}

const nodes = parseTree(TREE);
const plan = {
  siteName: 'rockland',
  contentRootPath: '/sitecore/content/rockland/rockland/Home',
  contentRootId: '4c79978f-0af7-4f41-bcfb-30af877cc77e',
  templateId: 'd47bddda-da7c-491a-b1a0-f41e060f8839',
  language: 'en',
  deleteBeforeCreate: [{ label: 'Learning Center', itemId: '10924323-44e5-45c9-aabb-25a1d1c5e8ee' }],
  totalNodes: nodes.length,
  nodes,
};

const outPath = join(__dirname, '..', 'ia', 'rockland-ia-plan.json');
writeFileSync(outPath, JSON.stringify(plan, null, 2));
console.log(`Wrote ${nodes.length} nodes to ${outPath}`);
