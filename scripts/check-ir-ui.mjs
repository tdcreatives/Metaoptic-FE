#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXPECTED_TAB_LABELS = [
  'Overview',
  'Events & Presentation',
  'SGX Company Announcement',
  'Analyst Coverage',
  'Governance',
  'Resources',
];

const FORBIDDEN_TAB_LABELS = ['News', 'Stock Info', 'Financials', 'Email Alerts'];

const EXPECTED_TAB_PATHS = [
  '/investor-relations',
  '/investor-relations/events-and-presentation',
  '/investor-relations/company-announcement',
  '/investor-relations/analyst-coverage',
  '/investor-relations/governance',
  '/investor-relations/resources',
];

const GATEWAY_PATTERNS = [
  /\bGateway\b/i,
  /gateway-grp\.com/i,
  /949-574-3860/,
  /949-574/,
];

const PRESENTATION_PDF = 'MOT-Company-Presentation-Sep2026.pdf';

const EXPECTED_NEXT_REDIRECTS = [
  ['/company-announcement', '/investor-relations/company-announcement'],
  ['/company-announcement/:slug', '/investor-relations/company-announcement/:slug'],
  ['/analyst-coverage', '/investor-relations/analyst-coverage'],
  ['/investor-relations/stock-info/analyst-coverage', '/investor-relations/analyst-coverage'],
  ['/investor-relations/financials/:path*', '/investor-relations/company-announcement'],
  ['/investor-relations/news/:path*', '/news'],
  ['/investor-relations/resources/email-alerts', '/investor-relations/resources/investor-faqs'],
  ['/investor-relations/stock-info/:path*', '/investor-relations'],
  ['/annountcement', '/investor-relations/company-announcement'],
  ['/annountcement/:slug', '/investor-relations/company-announcement/:slug'],
];

const APACHE_REDIRECT_CASES = [
  ['company-announcement', '/investor-relations/company-announcement'],
  ['company-announcement/', '/investor-relations/company-announcement'],
  ['company-announcement.html', '/investor-relations/company-announcement'],
  ['company-announcement/example', '/investor-relations/company-announcement/example'],
  ['company-announcement/example/', '/investor-relations/company-announcement/example'],
  ['company-announcement/example.html', '/investor-relations/company-announcement/example'],
  ['analyst-coverage', '/investor-relations/analyst-coverage'],
  ['analyst-coverage/', '/investor-relations/analyst-coverage'],
  ['analyst-coverage.html', '/investor-relations/analyst-coverage'],
  ['investor-relations/stock-info/analyst-coverage.html', '/investor-relations/analyst-coverage'],
  ['investor-relations/financials', '/investor-relations/company-announcement'],
  ['investor-relations/financials/sec-filings.html', '/investor-relations/company-announcement'],
  ['investor-relations/news/', '/news'],
  ['investor-relations/news/media.html', '/news'],
  ['investor-relations/resources/email-alerts.html', '/investor-relations/resources/investor-faqs'],
  ['investor-relations/stock-info', '/investor-relations'],
  ['investor-relations/stock-info/stock-quote.html', '/investor-relations'],
  ['investor-relations/governance/documents-and-charters', '/investor-relations/governance/board-of-directors'],
  ['investor-relations/governance/documents-and-charters/', '/investor-relations/governance/board-of-directors'],
  ['investor-relations/governance/documents-and-charters.html', '/investor-relations/governance/board-of-directors'],
  ['investor-relations/governance', '/investor-relations/governance/board-of-directors'],
  ['investor-relations/governance/', '/investor-relations/governance/board-of-directors'],
  ['investor-relations/governance.html', '/investor-relations/governance/board-of-directors'],
  ['annountcement', '/investor-relations/company-announcement'],
  ['annountcement/', '/investor-relations/company-announcement'],
  ['annountcement.html', '/investor-relations/company-announcement'],
  ['annountcement/example', '/investor-relations/company-announcement/example'],
  ['annountcement/example/', '/investor-relations/company-announcement/example'],
  ['annountcement/example.html', '/investor-relations/company-announcement/example'],
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function normalizeLabel(label) {
  return label.trim().toLowerCase();
}

function parseTabsBaseBody(tabsSource) {
  const baseMatch = tabsSource.match(
    /const investorRelationsTabsBase\s*=\s*\[([\s\S]*?)\n\];/
  );
  if (!baseMatch) {
    fail('Could not parse investorRelationsTabsBase from tabs.js');
    return null;
  }
  return baseMatch[1];
}

function extractTopLevelTabEntriesFromBody(baseBody) {
  if (!baseBody) return [];

  const entries = [];
  const lines = baseBody.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const inlineMatch = line.match(/^  \{ label: '([^']+)', path: '([^']+)'/);
    if (inlineMatch) {
      entries.push({ label: inlineMatch[1], path: inlineMatch[2] });
      continue;
    }
    const blockLabelMatch = line.match(/^    label: '([^']+)'/);
    if (blockLabelMatch) {
      const pathLine = lines[index + 1] ?? '';
      const blockPathMatch = pathLine.match(/^    path: '([^']+)'/);
      if (blockPathMatch) {
        entries.push({ label: blockLabelMatch[1], path: blockPathMatch[1] });
      }
    }
  }
  return entries;
}

function extractTopLevelTabLabelsFromBody(baseBody) {
  return extractTopLevelTabEntriesFromBody(baseBody).map((entry) => entry.label);
}

function extractAllTabLabelsFromBody(baseBody) {
  if (!baseBody) return [];
  return [...baseBody.matchAll(/label: '([^']+)'/g)].map((match) => match[1]);
}

function collectFiles(dir, extensions = ['.js', '.jsx', '.json', '.scss']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, extensions));
      continue;
    }
    if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function checkHeader() {
  const constantsSource = read('src/layouts/main/header/constants.js');
  const headerSource = read('src/layouts/main/header/index.js');
  const irEntryMatch = constantsSource.match(
    /\{\s*label:\s*["']INVESTOR RELATIONS["'],\s*path:\s*["']([^"']+)["']([\s\S]*?)\},/
  );

  if (!irEntryMatch) {
    fail('IR header entry for INVESTOR RELATIONS was not found');
    return;
  }

  const [, irPath, trailingProps] = irEntryMatch;
  if (irPath !== '/investor-relations') {
    fail(`IR header path must be /investor-relations (found ${irPath})`);
  }
  if (/dropdownKey\s*:/.test(trailingProps)) {
    fail('IR header must not define dropdownKey');
  }
  if (/investorRelations\s*:/.test(constantsSource)) {
    fail('Header constants must not define investorRelations dropdown items');
  }
  if (/IR_LAUNCH_FLAGS/.test(constantsSource)) {
    fail('Header constants must not import IR feature flags');
  }
  if (/company-announcement\//.test(headerSource.match(/const isPathActive[\s\S]*?};\s*\n\s*return/s)?.[0] ?? '')) {
    fail('isPathActive must not special-case legacy /company-announcement/* paths');
  }
  const isPathActiveBlock = headerSource.match(/const isPathActive[\s\S]*?};\s*\n\s*return/)?.[0] ?? '';
  if (!/\/investor-relations\/"/.test(isPathActiveBlock) || !/startsWith\("\/investor-relations\/"\)/.test(isPathActiveBlock)) {
    fail('isPathActive must treat /investor-relations and /investor-relations/* as active for the IR header');
  }
}

function checkTabs() {
  const tabsSource = read('src/layouts/investor-relations/tabs.js');
  const baseBody = parseTabsBaseBody(tabsSource);
  if (!baseBody) return;

  const entries = extractTopLevelTabEntriesFromBody(baseBody);
  const labels = entries.map((entry) => entry.label);
  const normalizedActual = labels.map(normalizeLabel);
  const normalizedExpected = EXPECTED_TAB_LABELS.map(normalizeLabel);

  if (normalizedActual.length !== normalizedExpected.length) {
    fail(
      `IR tabs must contain exactly ${EXPECTED_TAB_LABELS.length} tabs in order (found ${labels.length}: ${labels.join(', ')})`
    );
  } else {
    for (let index = 0; index < normalizedExpected.length; index += 1) {
      const expected = normalizedExpected[index];
      const actual = normalizedActual[index];
      if (actual !== expected) {
        fail(
          `IR tab ${index + 1} must be "${EXPECTED_TAB_LABELS[index]}" (found "${labels[index] ?? 'missing'}")`
        );
      }
      const expectedPath = EXPECTED_TAB_PATHS[index];
      const actualPath = entries[index]?.path;
      if (actualPath !== expectedPath) {
        fail(
          `IR tab ${index + 1} path must be "${expectedPath}" (found "${actualPath ?? 'missing'}")`
        );
      }
    }
  }

  const allLabels = extractAllTabLabelsFromBody(baseBody).map(normalizeLabel);
  for (const forbidden of FORBIDDEN_TAB_LABELS) {
    const normalizedForbidden = normalizeLabel(forbidden);
    if (
      normalizedActual.includes(normalizedForbidden) ||
      allLabels.includes(normalizedForbidden)
    ) {
      fail(`IR tabs must not contain "${forbidden}"`);
    }
  }
}

function checkOverviewComposition() {
  const source = read('src/app/investor-relations/page.js');
  if (/RecentPressReleases/.test(source)) {
    fail('Overview composition must not render Recent Press Releases');
  }
  if (/EmailAlerts/.test(source)) {
    fail('Overview composition must not render Email Alerts');
  }

  const contactsSource = read('src/layouts/investor-relations/overview/ir-contacts.js');
  if (!contactsSource.includes('Headquarters') || !contactsSource.includes('Depository Bank')) {
    fail('Overview contacts must retain Headquarters and Depository Bank');
  }
  if (!/md:grid-cols-2/.test(contactsSource) || /lg:grid-cols-3/.test(contactsSource)) {
    fail('Overview contacts must use the confirmed two-column layout');
  }
}

function checkGatewayRemoved() {
  const irLayoutsDir = path.join(ROOT, 'src/layouts/investor-relations');
  for (const filePath of collectFiles(irLayoutsDir)) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (GATEWAY_PATTERNS.some((pattern) => pattern.test(source))) {
      fail(`Gateway contact content remains in ${path.relative(ROOT, filePath)}`);
    }
  }

  const faqSource = read('src/constants/investor-faqs.json');
  if (GATEWAY_PATTERNS.some((pattern) => pattern.test(faqSource))) {
    fail('Gateway contact content remains in src/constants/investor-faqs.json');
  }

  const envExampleSource = read('.env.example');
  if (GATEWAY_PATTERNS.some((pattern) => pattern.test(envExampleSource))) {
    fail('Gateway configuration remains in .env.example');
  }
  if (/^NEXT_PUBLIC_IR_WEB3FORMS_ACCESS_KEY=/m.test(envExampleSource)) {
    fail('Obsolete IR Web3Forms access-key setting remains in .env.example');
  }
  if (!/^NEXT_PUBLIC_IR_CONTACT_EMAIL=sales@metaoptics\.com\.sg$/m.test(envExampleSource)) {
    fail('.env.example IR contact fallback must use sales@metaoptics.com.sg');
  }

  const web3formsSource = read('src/lib/web3forms.js');
  if (GATEWAY_PATTERNS.some((pattern) => pattern.test(web3formsSource))) {
    fail('Gateway contact content remains in src/lib/web3forms.js');
  }
  if (!/const IR_FALLBACK_EMAIL\s*=\s*[\s\S]*?\|\|\s*MAIN_FALLBACK_EMAIL;/.test(web3formsSource)) {
    fail('IR contact fallback must use the existing general contact fallback');
  }

  for (const functionName of ['buildMainContactPayload', 'buildIrContactPayload']) {
    const start = web3formsSource.indexOf(`export function ${functionName}`);
    const nextExport = web3formsSource.indexOf('\nexport ', start + 1);
    const block = start === -1
      ? ''
      : web3formsSource.slice(start, nextExport === -1 ? undefined : nextExport);
    if (!block) {
      fail(`Could not inspect ${functionName} in src/lib/web3forms.js`);
      continue;
    }
    if (/NEXT_PUBLIC_IR_WEB3FORMS_ACCESS_KEY/.test(block)) {
      fail(`${functionName} must not select NEXT_PUBLIC_IR_WEB3FORMS_ACCESS_KEY`);
    }
    if (!/access_key:\s*process\.env\.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN/.test(block)) {
      fail(`${functionName} must use NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN`);
    }
  }
}

function checkFaqStockListingCopy() {
  const faqs = JSON.parse(read('src/constants/investor-faqs.json')).faqs;
  const stockFaq = faqs.find((faq) => faq.id === 'stock-symbol');

  if (!stockFaq) {
    fail('FAQ stock-listing entry (id: stock-symbol) is missing');
    return;
  }

  const expectedAnswer =
    'MetaOptics Ltd is listed on the Singapore Exchange (SGX) under stock code 9MT.';
  if (stockFaq.answer !== expectedAnswer) {
    fail('FAQ stock-listing copy must use the confirmed SGX-only wording');
  }
  if (faqs.some((faq) => faq.id === 'ir-contact' || faq.id === 'depository-bank')) {
    fail('FAQ must not expose the Gateway contact or ADR depository-bank entries');
  }
}

function checkDeferredEmailAlerts() {
  const flagsSource = read('src/constants/ir-feature-flags.js');
  if (!/showEmailAlerts:\s*false/.test(flagsSource)) {
    fail('Email Alerts must remain disabled behind showEmailAlerts: false');
  }

  const pageSource = read('src/app/investor-relations/resources/email-alerts/page.js');
  if (
    !/!IR_LAUNCH_FLAGS\.showEmailAlerts/.test(pageSource) ||
    !/import IrLaunchRedirect from ['"]@\/layouts\/investor-relations\/ir-launch-redirect['"]/.test(pageSource) ||
    !/return <IrLaunchRedirect to=['"]\/investor-relations\/resources\/investor-faqs['"] \/>/.test(pageSource) ||
    /from ['"]next\/navigation['"]/.test(pageSource)
  ) {
    fail('Disabled Email Alerts page must use IrLaunchRedirect to Investor FAQs');
  }

  if (!read('src/layouts/investor-relations/resources/email-alerts.js').includes('buildIrEmailAlertsPayload')) {
    fail('Deferred Email Alerts implementation must be preserved');
  }
  if (!read('src/lib/web3forms.js').includes('buildIrEmailAlertsPayload')) {
    fail('Deferred Email Alerts payload builder must be preserved');
  }
}

function checkPresentationPdf() {
  const locations = [
    'src/layouts/investor-relations/overview/investor-presentation.js',
    'src/app/investor-relations/events-and-presentation/page.js',
  ];

  for (const relPath of locations) {
    const source = read(relPath);
    if (!source.includes(PRESENTATION_PDF)) {
      fail(`${relPath} must reference ${PRESENTATION_PDF}`);
    }
  }
}

function checkAnnouncementLinks() {
  const relPaths = [
    'src/layouts/investor-relations/company-announcements/table.js',
  ];
  const requiredPrefix = '/investor-relations/company-announcement/';

  for (const relPath of relPaths) {
    const source = read(relPath);
    const hrefMatches = [...source.matchAll(/href=\{`([^`]+)\$\{item\.slug\}`\}/g)];
    if (hrefMatches.length === 0) {
      fail(`${relPath} must define nested announcement links`);
      continue;
    }
    if (hrefMatches.some((match) => !match[1].startsWith(requiredPrefix))) {
      fail(`${relPath} announcement links must begin ${requiredPrefix}`);
    }
  }
}

function checkRedirects() {
  const flagsSource = read('src/constants/ir-feature-flags.js');
  if (!/['"]\/investor-relations\/financials\/quarterly-results['"]:\s*['"]\/investor-relations\/company-announcement['"]/.test(flagsSource)) {
    fail('Hidden Quarterly Results must redirect directly to Company Announcement');
  }

  const nextConfigSource = read('next.config.js');
  const nextRedirects = [...nextConfigSource.matchAll(
    /source:\s*'([^']+)'[\s\S]*?destination:\s*'([^']+)'[\s\S]*?permanent:\s*true/g
  )].map((match) => [match[1], match[2]]);

  for (const [source, destination] of EXPECTED_NEXT_REDIRECTS) {
    if (!nextRedirects.some(([actualSource, actualDestination]) =>
      actualSource === source && actualDestination === destination
    )) {
      fail(`next.config.js must permanently redirect ${source} to ${destination}`);
    }
  }
  if (nextRedirects.some(([source, destination]) =>
    source === '/investor-relations' && destination === '/company-announcement'
  )) {
    fail('next.config.js must not redirect canonical /investor-relations to a legacy route');
  }
  for (const [source, destination] of EXPECTED_NEXT_REDIRECTS) {
    if (nextRedirects.some(([nextSource]) => nextSource === destination)) {
      fail(`next.config.js redirect ${source} requires another redirect after ${destination}`);
    }
  }

  const apacheSource = read('.htaccess');
  const firstFileCheck = apacheSource.indexOf('RewriteCond %{REQUEST_FILENAME} -f');
  const apacheRules = [...apacheSource.matchAll(
    /^RewriteRule\s+(\S+)\s+(\S+)\s+\[([^\]]+)\]$/gm
  )].map((match) => ({
    pattern: match[1],
    destination: match[2],
    flags: match[3].split(',').map((flag) => flag.trim().toUpperCase()),
    index: match.index,
  }));

  for (const [requestPath, expectedDestination] of APACHE_REDIRECT_CASES) {
    const rule = apacheRules.find(({ pattern }) => new RegExp(pattern, 'i').test(requestPath));
    if (!rule) {
      fail(`.htaccess has no redirect for /${requestPath}`);
      continue;
    }
    const actualDestination = requestPath.replace(new RegExp(rule.pattern, 'i'), rule.destination);
    if (actualDestination !== expectedDestination) {
      fail(`.htaccess redirects /${requestPath} to ${actualDestination}, expected ${expectedDestination}`);
    }
    if (!rule.flags.includes('R=301') || !rule.flags.includes('L')) {
      fail(`.htaccess redirect for /${requestPath} must use R=301,L`);
    }
    if (firstFileCheck !== -1 && rule.index > firstFileCheck) {
      fail(`.htaccess redirect for /${requestPath} must precede file and internal rewrite rules`);
    }
    const destinationPath = expectedDestination.replace(/^\//, '');
    const secondRule = apacheRules.find(({ pattern, flags }) =>
      flags.some((flag) => flag.startsWith('R=')) &&
      new RegExp(pattern, 'i').test(destinationPath)
    );
    if (secondRule) {
      fail(`.htaccess redirect for /${requestPath} is not one hop; ${expectedDestination} redirects again`);
    }
  }

  if (/^RewriteRule\s+\^\/investor-relations\b.*\/company-announcement/gm.test(apacheSource)) {
    fail('.htaccess must not redirect canonical /investor-relations to a legacy route');
  }
}

function loadAnnouncementSlugs() {
  const announcements = JSON.parse(read('src/constants/announcements.json'));
  return announcements.map((item) => item.slug).filter(Boolean);
}

function builtRouteExists(outDir, route) {
  const flatHtml = path.join(outDir, `${route}.html`);
  const nestedHtml = path.join(outDir, route, 'index.html');
  return fs.existsSync(flatHtml) || fs.existsSync(nestedHtml);
}

function readBuiltRoute(outDir, route) {
  const candidates = [
    path.join(outDir, `${route}.html`),
    path.join(outDir, route, 'index.html'),
  ];
  const filePath = candidates.find((candidate) => fs.existsSync(candidate));
  return filePath ? fs.readFileSync(filePath, 'utf8') : '';
}

function checkBuiltOutput() {
  const outDir = path.join(ROOT, 'out');
  if (!fs.existsSync(outDir)) {
    fail('Built output directory out/ is missing (run npm run build first)');
    return;
  }

  const requiredRoutes = [
    'investor-relations',
    'investor-relations/company-announcement',
    'investor-relations/analyst-coverage',
  ];

  for (const route of requiredRoutes) {
    if (!builtRouteExists(outDir, route)) {
      fail(`Built route missing: ${route} (expected ${route}.html or ${route}/index.html)`);
    }
  }

  for (const slug of loadAnnouncementSlugs()) {
    const route = `investor-relations/company-announcement/${slug}`;
    if (!builtRouteExists(outDir, route)) {
      fail(`Built nested announcement route missing: ${route}`);
    }
  }

  const launchPages = [
    'investor-relations',
    'investor-relations/resources/contact-us',
    'investor-relations/resources/investor-faqs',
  ].map((route) => readBuiltRoute(outDir, route)).join('\n');

  if (/Recent Press Releases/i.test(launchPages)) {
    fail('Built IR launch pages must not expose Recent Press Releases');
  }
  if (/Email Alerts/i.test(launchPages)) {
    fail('Built IR launch pages must not expose Email Alerts');
  }
  if (GATEWAY_PATTERNS.some((pattern) => pattern.test(launchPages))) {
    fail('Built IR launch pages must not expose Gateway contact content');
  }

  const emailAlertsHtml = readBuiltRoute(
    outDir,
    'investor-relations/resources/email-alerts'
  );
  if (!emailAlertsHtml) {
    fail('Built Email Alerts route is missing');
  } else if (/__next_error__/.test(emailAlertsHtml)) {
    fail('Built Email Alerts route must not be a __next_error__ shell');
  }
}

function runChecks() {
  checkHeader();
  checkTabs();
  checkOverviewComposition();
  checkGatewayRemoved();
  checkFaqStockListingCopy();
  checkDeferredEmailAlerts();
  checkPresentationPdf();
  checkAnnouncementLinks();
  checkRedirects();

  if (process.argv.includes('--built')) {
    checkBuiltOutput();
  }
}

runChecks();

if (failures.length > 0) {
  console.error(`IR contract check FAILED (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
  for (const message of failures) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

console.log('IR contract check passed.');
