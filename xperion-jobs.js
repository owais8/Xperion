/* ════════════════════════════════════════════════════════════════════
   XPERION · Careers data + rendering system
   ────────────────────────────────────────────────────────────────────
   Single source of truth for open roles. To post a new job, add one
   object to XPERION_JOBS below — the careers list, every job-detail
   page, the team counts, the filters, and the JobPosting structured
   data all render from this array. No backend required.

   Detail URL:   job?id=<id>
   Careers list: rendered into #xpJobsRoot on careers
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Team display order (drives grouping + the filter chips). */
  var TEAM_ORDER = ['Engineering', 'AI / ML', 'Design & UX', 'Marketing', 'Consulting & Advisory', 'Operations'];

  var ORG = {
    name: 'Xperion',
    site: 'https://xperion.ai',
    logo: 'https://xperion.ai/xperion-favicon-512.png',
    email: 'careers@xperion.ai'
  };

  /* Shared closing line used in every JD "About Xperion" block. */
  var ABOUT_XPERION = 'Xperion runs senior-led teams across the United States and Pakistan, partnering with enterprises on resource augmentation, managed services, production AI, consulting, marketing, and design under one MSA. No bench-and-bill, no hidden pyramids — a senior lead stays accountable for every engagement.';

  var JOBS = [
    /* ─── ENGINEERING ─────────────────────────────────────────────── */
    {
      id: 'staff-principal-backend-engineer',
      title: 'Staff / Principal Backend Engineer',
      team: 'Engineering',
      type: 'Full-time', employment: 'Permanent', level: 'Staff / Principal',
      location: 'Remote (NA / EMEA)', regions: ['NA', 'EMEA'],
      comp: '$205,000 – $255,000 + equity',
      posted: '2026-05-12',
      summary: 'Set the technical bar on the build practice — architect the backends behind our AI and platform engagements, and stay embedded long enough to see them run in production.',
      about: 'You will be the most senior engineer in the room on multiple client engagements at once — owning architecture, reviewing the work, and making the calls that decide whether a system survives its second year. This is hands-on: you write the load-bearing code, not just the diagrams.',
      responsibilities: [
        'Own the architecture of production backends across concurrent client engagements, from data model to deploy.',
        'Write the load-bearing code yourself, and set the review standard the rest of the team is held to.',
        'Make the build-vs-buy, sync-vs-async, and consistency-vs-latency calls that decide long-term cost.',
        'Embed with client teams so the systems you ship are run by people who understand them.',
        'Mentor senior engineers without becoming a layer between them and the work.'
      ],
      requirements: [
        '10+ years building and operating backend systems at production scale.',
        'Depth in at least one of Go, Rust, TypeScript/Node, Python, or the JVM — and fluency reading the rest.',
        'A track record of distributed-systems decisions that aged well, and the scars from ones that did not.',
        'Comfort owning a system end to end: schema, API, queue, cache, deploy, on-call.',
        'The judgement to push back on a brief when the requested design will hurt the outcome.'
      ],
      niceToHave: [
        'Experience standing up the data plane behind LLM or retrieval systems.',
        'Multi-tenant SaaS or regulated-industry (HIPAA, PCI-DSS, SR 11-7) background.'
      ]
    },
    {
      id: 'senior-fullstack-engineer-typescript',
      title: 'Senior Full-Stack Engineer (TypeScript)',
      team: 'Engineering',
      type: 'Full-time', employment: 'Permanent', level: 'Senior',
      location: 'Remote · Multiple regions', regions: ['NA', 'EMEA', 'APAC'],
      comp: '$165,000 – $205,000 + equity',
      posted: '2026-05-12',
      summary: 'Ship product across the full stack — React/Next on the front, typed services behind it — embedded directly in client teams.',
      about: 'You are happiest owning a feature from the database to the pixel. You will join client engagements where the brief is real product work, not staff-augmentation seat-filling, and you will be expected to make product calls, not just take tickets.',
      responsibilities: [
        'Build and ship full-stack features in TypeScript across React/Next.js and typed backend services.',
        'Own the contract between front and back ends — API shape, types, error states, loading states.',
        'Instrument what you ship so the team can see whether it actually worked.',
        'Collaborate directly with client product and design, not through a relay.',
        'Hold a high bar on accessibility and Core Web Vitals as a default, not a follow-up.'
      ],
      requirements: [
        '7+ years building production web applications, several of them full-stack.',
        'Deep TypeScript across the stack, with strong React/Next.js and a typed backend (Node, or polyglot).',
        'Fluency with relational data modelling and the query patterns that keep it fast.',
        'A portfolio of shipped product you can walk through and defend.',
        'Direct, low-ego communication with non-engineers.'
      ],
      niceToHave: [
        'Experience wiring LLM features into product surfaces (streaming, evals, fallbacks).',
        'Comfort in a second framework (Vue/Nuxt, Svelte) for engagements that call for it.'
      ]
    },

    /* ─── AI / ML ──────────────────────────────────────────────────── */
    {
      id: 'llm-retrieval-engineer',
      title: 'LLM & Retrieval Engineer',
      team: 'AI / ML',
      type: 'Full-time', employment: 'Permanent', level: 'Senior',
      location: 'Remote (NA / EMEA)', regions: ['NA', 'EMEA'],
      comp: '$180,000 – $225,000 + equity',
      posted: '2026-05-08',
      summary: 'Own the retrieval quality that makes or breaks enterprise AI — chunking, embeddings, ranking, and the evals that keep them honest.',
      about: 'You know that "just add RAG" is where the real work starts. You will own retrieval and context engineering across AI engagements, and you will measure your way to quality rather than guessing.',
      responsibilities: [
        'Design and tune retrieval pipelines: chunking, embeddings, hybrid search, re-ranking.',
        'Build the eval sets and metrics that turn "feels better" into a number.',
        'Engineer context and prompt strategies that hold up across edge cases.',
        'Manage the cost and latency budget of retrieval at production volume.',
        'Partner with data engineering on the pipelines that feed the index.'
      ],
      requirements: [
        '6+ years engineering, with focused recent work on LLM and retrieval systems.',
        'Hands-on with vector stores (pgvector, Pinecone, Weaviate) and hybrid retrieval.',
        'Rigour with offline and online evaluation of retrieval and generation quality.',
        'Strong Python; comfort with the data plumbing behind an index.',
        'A scientific temperament — you trust measurements over vibes.'
      ],
      niceToHave: [
        'Experience with fine-tuning or distillation where retrieval is not enough.',
        'Familiarity with eval tooling (Braintrust, Langfuse).'
      ]
    },
    {
      id: 'mlops-ai-platform-engineer',
      title: 'MLOps / AI Platform Engineer',
      team: 'AI / ML',
      type: 'Full-time', employment: 'Permanent', level: 'Senior',
      location: 'Remote (EMEA)', regions: ['EMEA'],
      comp: '$175,000 – $220,000 + equity',
      posted: '2026-05-08',
      summary: 'Build the platform that lets AI engagements ship safely and repeatedly — pipelines, deployment, monitoring, and the guardrails around models in production.',
      about: 'You make the difference between an AI system that ships once and one that ships every week without drama. You will own the MLOps and AI platform layer across engagements, treating reliability and observability as the product.',
      responsibilities: [
        'Build CI/CD and deployment paths for models, prompts, and AI services.',
        'Stand up monitoring for drift, cost, latency, and quality — with alerts that mean something.',
        'Own model and prompt versioning, rollback, and safe-deploy practices.',
        'Manage inference infrastructure cost and scaling across clouds.',
        'Pave the AI platform roads so forward-deployed engineers move faster.'
      ],
      requirements: [
        '7+ years in platform, infrastructure, or MLOps roles.',
        'Strong with Kubernetes, Docker, Terraform/Pulumi, and at least one major cloud.',
        'Experience operating ML or LLM systems in production, including observability.',
        'Python plus the systems depth to debug an inference path under load.',
        'A reliability mindset and calm under incident pressure.'
      ],
      niceToHave: [
        'Experience with LLM observability tooling and token-cost control.',
        'Background in regulated or high-availability environments.'
      ]
    },

    /* ─── DESIGN & UX ──────────────────────────────────────────────── */
    {
      id: 'senior-product-designer',
      title: 'Senior Product Designer (B2B SaaS / AI surfaces)',
      team: 'Design & UX',
      type: 'Full-time', employment: 'Permanent', level: 'Senior',
      location: 'Remote (NA / EMEA)', regions: ['NA', 'EMEA'],
      comp: '$155,000 – $195,000 + equity',
      posted: '2026-05-15',
      summary: 'Design B2B and AI product surfaces that are clear under real data and real stakes — embedded with the teams who build them.',
      about: 'You design for density, edge cases, and trust — the unglamorous reality of enterprise software and AI interfaces. You will own product design on client engagements end to end, from research signal to shipped, accessible UI.',
      responsibilities: [
        'Own product design on engagements: flows, interaction, and high-fidelity UI.',
        'Design AI surfaces that make model behaviour legible — confidence, sources, controls, failure.',
        'Work directly with engineers so what you design is what ships.',
        'Hold WCAG AA as the floor, and pressure-test designs against real, messy data.',
        'Contribute patterns back so design quality compounds across the bench.'
      ],
      requirements: [
        '7+ years in product design with a portfolio of shipped B2B or complex consumer work.',
        'Strong interaction and visual craft, and fluency in a modern tool (Figma).',
        'Experience designing data-dense or AI-mediated interfaces.',
        'A working understanding of front-end constraints and how to design within them.',
        'The ability to defend a decision with reasoning, and change it with evidence.'
      ],
      niceToHave: [
        'Prototyping in code or Framer for high-fidelity motion.',
        'Design-systems contribution experience.'
      ]
    },
  ];
  /* v3.9 roster trim: roles beyond the engineering core removed to match
     real hiring intent. To post a new role, add one object above — see
     the header comment for the shape. */

  /* ── Helpers ───────────────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function byId(id) {
    for (var i = 0; i < JOBS.length; i++) if (JOBS[i].id === id) return JOBS[i];
    return null;
  }
  function jobUrl(job) { return 'job?id=' + encodeURIComponent(job.id); }
  function applyMailto(job) {
    var subject = 'Application — ' + job.title + ' (' + job.team + ')';
    var body = 'Hi Xperion team,\n\nI’d like to apply for the ' + job.title + ' role.\n\n- A few sentences on what I do and why this fits:\n- Links (portfolio / GitHub / LinkedIn):\n- Where I’m based (region / time zone):\n\nThanks,\n';
    return 'mailto:' + ORG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  /* ── Careers list rendering (grouped by team, with filter chips) ── */
  function renderList(root) {
    var teams = TEAM_ORDER.filter(function (t) {
      return JOBS.some(function (j) { return j.team === t; });
    });

    var chips = '<div class="jobs-filter" role="tablist" aria-label="Filter roles by team">';
    chips += '<button class="jobs-chip is-active" data-filter="all" role="tab" aria-selected="true">All roles <span class="jobs-chip-n">' + JOBS.length + '</span></button>';
    teams.forEach(function (t) {
      var n = JOBS.filter(function (j) { return j.team === t; }).length;
      chips += '<button class="jobs-chip" data-filter="' + esc(t) + '" role="tab" aria-selected="false">' + esc(t) + ' <span class="jobs-chip-n">' + n + '</span></button>';
    });
    chips += '</div>';

    var groups = teams.map(function (t) {
      var list = JOBS.filter(function (j) { return j.team === t; });
      var rows = list.map(function (job) {
        return '<a class="job-row" href="' + jobUrl(job) + '">' +
          '<div class="job-title">' + esc(job.title) + '</div>' +
          '<div class="job-meta">' + esc(job.type) + ' · ' + esc(job.location) + '</div>' +
          '<div class="job-meta">' + esc(job.employment) + '</div>' +
          '<div class="job-cta">View →</div>' +
          '</a>';
      }).join('');
      return '<div class="jobs-team" data-team="' + esc(t) + '">' +
        '<div class="jobs-team-header"><div class="jobs-team-name">' + esc(t) + '</div>' +
        '<span class="jobs-team-count">' + list.length + (list.length === 1 ? ' role' : ' roles') + '</span></div>' +
        '<div class="jobs-list">' + rows + '</div></div>';
    }).join('');

    root.innerHTML = chips + '<div class="jobs-groups">' + groups + '</div>';

    // Filter behaviour (progressive enhancement; rows are real links regardless).
    var chipEls = Array.prototype.slice.call(root.querySelectorAll('.jobs-chip'));
    var groupEls = Array.prototype.slice.call(root.querySelectorAll('.jobs-team'));
    chipEls.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chipEls.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        groupEls.forEach(function (g) {
          g.hidden = !(f === 'all' || g.getAttribute('data-team') === f);
        });
      });
    });
  }

  /* ── Job-detail rendering ──────────────────────────────────────── */
  function list(items, cls) {
    return '<ul class="' + cls + '">' + items.map(function (i) {
      return '<li>' + esc(i) + '</li>';
    }).join('') + '</ul>';
  }

  function renderDetail(root) {
    var params = new URLSearchParams(window.location.search);
    var job = byId(params.get('id') || '');

    if (!job) {
      document.title = 'Role not found — Xperion Careers';
      root.innerHTML =
        '<section class="page-hero"><div class="page-hero-bg" aria-hidden="true"></div>' +
        '<div class="page-hero-grid" aria-hidden="true"></div><div class="container">' +
        '<div class="page-eyebrow">Careers at Xperion</div>' +
        '<h1>That role isn’t open <span class="grad serif">right now.</span></h1>' +
        '<p class="page-hero-sub">The link may be out of date, or the search has closed. See everything we’re currently hiring for, or send a note and we’ll keep you in mind.</p>' +
        '<div class="page-hero-actions"><a class="btn-primary" href="careers#roles" data-magnetic>See open roles' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '<a class="btn-ghost" href="mailto:' + ORG.email + '">Email the team</a></div></div></section>';
      return;
    }

    document.title = job.title + ' — Xperion Careers';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', job.summary);

    var related = JOBS.filter(function (j) { return j.team === job.team && j.id !== job.id; }).slice(0, 3);
    var relatedHtml = related.length ? (
      '<div class="job-related"><div class="section-kicker">More in ' + esc(job.team) + '</div>' +
      '<div class="jobs-list">' + related.map(function (r) {
        return '<a class="job-row" href="' + jobUrl(r) + '"><div class="job-title">' + esc(r.title) + '</div>' +
          '<div class="job-meta">' + esc(r.location) + '</div><div class="job-meta">' + esc(r.level) + '</div>' +
          '<div class="job-cta">View →</div></a>';
      }).join('') + '</div></div>'
    ) : '';

    var apply = applyMailto(job);

    root.innerHTML =
      '<section class="page-hero job-hero">' +
        '<div class="page-hero-bg" aria-hidden="true"></div><div class="page-hero-grid" aria-hidden="true"></div>' +
        '<div class="container">' +
          '<nav class="job-breadcrumb" aria-label="Breadcrumb"><a href="careers">Careers</a><span aria-hidden="true">/</span>' +
          '<a href="careers#roles">' + esc(job.team) + '</a><span aria-hidden="true">/</span><span>' + esc(job.title) + '</span></nav>' +
          '<h1>' + esc(job.title) + '</h1>' +
          '<p class="page-hero-sub">' + esc(job.summary) + '</p>' +
          '<div class="job-chips">' +
            '<span class="job-chip"><span class="job-chip-k">Team</span>' + esc(job.team) + '</span>' +
            '<span class="job-chip"><span class="job-chip-k">Level</span>' + esc(job.level) + '</span>' +
            '<span class="job-chip"><span class="job-chip-k">Location</span>' + esc(job.location) + '</span>' +
            '<span class="job-chip"><span class="job-chip-k">Type</span>' + esc(job.type) + ' · ' + esc(job.employment) + '</span>' +
          '</div>' +
          '<div class="page-hero-actions"><a class="btn-primary" href="' + apply + '" data-magnetic>Apply for this role' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
          '<a class="btn-ghost" href="careers#roles">All open roles</a></div>' +
        '</div>' +
      '</section>' +
      '<section class="section job-body"><div class="container">' +
        '<div class="job-layout">' +
          '<article class="job-main">' +
            '<div class="job-block reveal"><h2>About the role</h2><p>' + esc(job.about) + '</p></div>' +
            '<div class="job-block reveal"><h2>What you’ll own</h2>' + list(job.responsibilities, 'job-ul') + '</div>' +
            '<div class="job-block reveal"><h2>What we look for</h2>' + list(job.requirements, 'job-ul') + '</div>' +
            (job.niceToHave && job.niceToHave.length ? '<div class="job-block reveal"><h2>Bonus, not required</h2>' + list(job.niceToHave, 'job-ul') + '</div>' : '') +
            '<div class="job-block reveal"><h2>About Xperion</h2><p>' + esc(ABOUT_XPERION) + '</p></div>' +
          '</article>' +
          '<aside class="job-aside">' +
            '<div class="job-card">' +
              '<div class="job-card-row"><span class="job-card-k">Compensation</span><span class="job-card-v">' + esc(job.comp) + '</span></div>' +
              '<div class="job-card-row"><span class="job-card-k">Location</span><span class="job-card-v">' + esc(job.location) + '</span></div>' +
              '<div class="job-card-row"><span class="job-card-k">Level</span><span class="job-card-v">' + esc(job.level) + '</span></div>' +
              '<div class="job-card-row"><span class="job-card-k">Type</span><span class="job-card-v">' + esc(job.type) + ' · ' + esc(job.employment) + '</span></div>' +
              '<a class="btn-primary job-card-apply" href="' + apply + '" data-magnetic>Apply now' +
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
              '<p class="job-card-note">Comp is US-anchored and adjusts by region. Equity for every senior hire. We reply within two business days.</p>' +
            '</div>' +
          '</aside>' +
        '</div>' +
        relatedHtml +
      '</div></section>';

    injectJobPosting(job);
  }

  /* ── SEO: JobPosting structured data ───────────────────────────── */
  function injectJobPosting(job) {
    var regionMap = { NA: 'US', EMEA: 'GB', APAC: 'SG' };
    var salaryParts = (job.comp.match(/[\d,]+/g) || []).map(function (n) { return parseInt(n.replace(/,/g, ''), 10); });
    var data = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.summary + ' ' + job.about,
      datePosted: job.posted,
      employmentType: 'FULL_TIME',
      jobLocationType: 'TELECOMMUTE',
      hiringOrganization: { '@type': 'Organization', name: ORG.name, sameAs: ORG.site, logo: ORG.logo },
      applicantLocationRequirements: job.regions.map(function (r) {
        return { '@type': 'Country', name: regionMap[r] || 'US' };
      }),
      directApply: true
    };
    if (salaryParts.length === 2) {
      data.baseSalary = {
        '@type': 'MonetaryAmount', currency: 'USD',
        value: { '@type': 'QuantitativeValue', minValue: salaryParts[0], maxValue: salaryParts[1], unitText: 'YEAR' }
      };
    }
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ── Boot ──────────────────────────────────────────────────────── */
  function boot() {
    var listRoot = document.getElementById('xpJobsRoot');
    if (listRoot) renderList(listRoot);
    var detailRoot = document.getElementById('xpJobDetail');
    if (detailRoot) renderDetail(detailRoot);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Expose for debugging / future tooling. */
  window.XPERION_JOBS = JOBS;
})();
