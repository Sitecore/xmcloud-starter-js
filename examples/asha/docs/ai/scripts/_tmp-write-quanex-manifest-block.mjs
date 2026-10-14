import { writeFileSync } from 'fs';

const items = [
  ['Products', 'c8a3f7b0-e2c4-4d27-aa20-d4018e333b38', '/sitecore/content/quanex/quanex/Home/Products'],
  ['Residential', 'f57baa07-a8bc-4859-b1db-96e0153c4d23', '/sitecore/content/quanex/quanex/Home/Products/Residential'],
  ['Entry Door Components (Residential)', '53cae3b0-2166-4109-bcb4-6be9dcfe1184', '/sitecore/content/quanex/quanex/Home/Products/Residential/Entry Door Components'],
  ['Insulating Glass Spacers (Residential)', '2b002784-21df-4113-8ccb-dcfb8b356362', '/sitecore/content/quanex/quanex/Home/Products/Residential/Insulating Glass Spacers'],
  ['Kitchen and Bath Components', '452a7a3b-e4ac-44e6-abca-a27b027bfed5', '/sitecore/content/quanex/quanex/Home/Products/Residential/Kitchen and Bath Components'],
  ['Millwork (Residential)', 'a83e09e4-78da-4902-af17-1fa1cf177032', '/sitecore/content/quanex/quanex/Home/Products/Residential/Millwork'],
  ['Security Screens', 'd74bd42a-fd7f-4de9-9d51-f229d51bb24d', '/sitecore/content/quanex/quanex/Home/Products/Residential/Security Screens'],
  ['Solar Panel Components', '530afca4-7706-40b6-936c-05c4e27e5e17', '/sitecore/content/quanex/quanex/Home/Products/Residential/Solar Panel Components'],
  ['Window Components (Residential)', 'f1d393bd-6d9b-4c36-a86c-b28e6261fbaf', '/sitecore/content/quanex/quanex/Home/Products/Residential/Window Components'],
  ['Commercial', '1573ccc9-e6d1-4610-9a38-ebfab293f91b', '/sitecore/content/quanex/quanex/Home/Products/Commercial'],
  ['Entry Door Components (Commercial)', '64dd2760-f85f-4f66-9497-216f5c8219b4', '/sitecore/content/quanex/quanex/Home/Products/Commercial/Entry Door Components'],
  ['Window Components (Commercial)', '91445e93-b8f9-43e6-b132-3534c8185052', '/sitecore/content/quanex/quanex/Home/Products/Commercial/Window Components'],
  ['Insulating Glass Spacers (Commercial)', 'fbb94d30-6988-4cef-a9f4-b6268923b7a6', '/sitecore/content/quanex/quanex/Home/Products/Commercial/Insulating Glass Spacers'],
  ['Weatherseals (Commercial)', '2b0f74de-529d-4800-88c7-3d50221b55f9', '/sitecore/content/quanex/quanex/Home/Products/Commercial/Weatherseals'],
  ['Materials and Finishes', '96bf6876-725a-4003-bb33-f48e7c9812d8', '/sitecore/content/quanex/quanex/Home/Products/Commercial/Materials and Finishes'],
  ['Insulating Glass Spacers', '9726e4d1-8fcd-4dd6-b5e9-bb4467655176', '/sitecore/content/quanex/quanex/Home/Products/Insulating Glass Spacers'],
  ['Weatherseals', '47dbf199-fb3b-4b43-9d50-f12d65441315', '/sitecore/content/quanex/quanex/Home/Products/Weatherseals'],
  ['Solar', '36c969e9-d8c1-4693-aa6c-b54f17b1e3dd', '/sitecore/content/quanex/quanex/Home/Products/Solar'],
  ['For Architects', '0377352d-5e48-4dad-9516-808c09e2e86a', '/sitecore/content/quanex/quanex/Home/Products/For Architects'],
  ['Warm-Edge Spacers', 'd33d7824-0d41-4a3a-aa78-ebd838eee030', '/sitecore/content/quanex/quanex/Home/Products/For Architects/Warm-Edge Spacers'],
  ['Commercial Window and Door Systems', '759823dc-3dcb-4adb-b1c5-e2ffb7fa9255', '/sitecore/content/quanex/quanex/Home/Products/For Architects/Commercial Window and Door Systems'],
  ['Project Profiles (For Architects)', 'ab6e04a3-2525-4cd1-b68e-bfbd98d6629a', '/sitecore/content/quanex/quanex/Home/Products/For Architects/Project Profiles'],
  ['Sustainability (For Architects)', 'ede31bbc-014f-4a4e-b10f-f731d1765ef8', '/sitecore/content/quanex/quanex/Home/Products/For Architects/Sustainability'],
  ['Continuing Education Resources (For Architects)', 'a7176e1d-7c1d-447e-90c9-c49d9e0e131f', '/sitecore/content/quanex/quanex/Home/Products/For Architects/Continuing Education Resources'],
  ['Hardware Solutions', 'b8620c45-6876-4d82-b952-23f659bdf475', '/sitecore/content/quanex/quanex/Home/Products/Hardware Solutions'],
  ['Access Solutions', '86bdbb3e-0536-4ddd-9adc-92cb089f7254', '/sitecore/content/quanex/quanex/Home/Products/Access Solutions'],
  ['Extruded Solutions', 'fa947897-7340-4066-a011-42b5a8eaab98', '/sitecore/content/quanex/quanex/Home/Products/Extruded Solutions'],
  ['Mixing Solutions', 'd6fd78c9-dc8a-4581-ac3a-ced051c1a743', '/sitecore/content/quanex/quanex/Home/Products/Mixing Solutions'],
  ['Wood Solutions', '5628928f-aa2c-4671-9d8b-b11ee6fc848e', '/sitecore/content/quanex/quanex/Home/Products/Wood Solutions'],
  ['Capabilities', 'fbad5995-d416-453c-a8a7-df4ddfdae70f', '/sitecore/content/quanex/quanex/Home/Capabilities'],
  ['Cabinet Components', '63703930-8c86-456e-b281-ed2a344c96e6', '/sitecore/content/quanex/quanex/Home/Capabilities/Cabinet Components'],
  ['Custom Mixing', '48347864-d4ac-455e-a90a-a19ad340300e', '/sitecore/content/quanex/quanex/Home/Capabilities/Custom Mixing'],
  ['Engineered Wood', 'a0d6ed2c-988b-424a-b0a5-bd8847c6bf03', '/sitecore/content/quanex/quanex/Home/Capabilities/Engineered Wood'],
  ['Extrusion Capabilities', 'd83f6d57-2ed3-4597-b16d-d73769e7dd60', '/sitecore/content/quanex/quanex/Home/Capabilities/Extrusion Capabilities'],
  ['Hardwood Residues', '63557f72-40d3-4425-bc06-a704d09bddf9', '/sitecore/content/quanex/quanex/Home/Capabilities/Hardwood Residues'],
  ['Material and Science Design', 'f640e0a7-a45a-4ce4-a28c-1716083726b8', '/sitecore/content/quanex/quanex/Home/Capabilities/Material and Science Design'],
  ['Millwork (Capabilities)', '58e2a84e-7d58-41d1-8e77-0549b37dfaf6', '/sitecore/content/quanex/quanex/Home/Capabilities/Millwork'],
  ['Performance Solutions', '4787842d-57f3-4cf7-9cc8-d484d6b26df6', '/sitecore/content/quanex/quanex/Home/Capabilities/Performance Solutions'],
  ['Polymer Solutions', 'be75f022-bf9a-4330-9d8e-f0b8a6a99204', '/sitecore/content/quanex/quanex/Home/Capabilities/Polymer Solutions'],
  ['Roll Forming', '3ba3c62d-a599-44fc-ac8d-51f34b8587fb', '/sitecore/content/quanex/quanex/Home/Capabilities/Roll Forming'],
  ['Rolltrusion', 'f42772be-b7c2-4f7d-9457-c5647c99b679', '/sitecore/content/quanex/quanex/Home/Capabilities/Rolltrusion'],
  ['Sealant Solutions', 'ab26c458-c6d4-4569-ac5c-4da2693e2695', '/sitecore/content/quanex/quanex/Home/Capabilities/Sealant Solutions'],
  ['Silicone Foam Solutions', 'd084729d-0c0c-4fcc-bdcf-4a49c5c7c6eb', '/sitecore/content/quanex/quanex/Home/Capabilities/Silicone Foam Solutions'],
  ['Service and Support', 'de76695f-a5f5-40ea-b2d6-ec5e6624e08c', '/sitecore/content/quanex/quanex/Home/Service and Support'],
  ['Account Management', 'bd42abcc-775f-4b48-ba8b-91c6b938c92c', '/sitecore/content/quanex/quanex/Home/Service and Support/Account Management'],
  ['Continuing Education Resources', 'bfd35c05-040f-4599-851a-3615b0ed58a8', '/sitecore/content/quanex/quanex/Home/Service and Support/Continuing Education Resources'],
  ['Equipment', 'e8bdce5f-1b3d-4107-9e53-b1de29fef771', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment'],
  ['Line Layouts', 'b9d629a4-b71c-488a-93ab-08c524926f57', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment/Line Layouts'],
  ['Secondary Sealing Equipment Solutions', 'e260f630-a148-43f3-a735-7f36e779c4cd', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment/Secondary Sealing Equipment Solutions'],
  ['High-Speed Full Automation', '994291e1-ea10-4b0c-80a8-d2c42f5031df', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment/High-Speed Full Automation'],
  ['Semi-Automated IG Equipment', 'd524364a-d779-4960-86d6-ecdaaad628f3', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment/Semi-Automated IG Equipment'],
  ['Manual Spacer Application', '6224aaf9-9499-442e-9305-b9c5fccd89f5', '/sitecore/content/quanex/quanex/Home/Service and Support/Equipment/Manual Spacer Application'],
  ['Plant Transformation', 'ee527620-7371-45de-8a63-4857d143efc6', '/sitecore/content/quanex/quanex/Home/Service and Support/Plant Transformation'],
  ['Screens Plus', '54889b49-d385-4ecb-a593-d6f4661b6237', '/sitecore/content/quanex/quanex/Home/Service and Support/Screens Plus'],
  ['About', '9955b25e-1542-4189-a646-76b59c12c7fb', '/sitecore/content/quanex/quanex/Home/About'],
  ['Project Profiles', '7bcbcf67-afb6-4c79-8cfe-ededfbb3f612', '/sitecore/content/quanex/quanex/Home/Project Profiles'],
  ['Resources', '144e8b02-e31f-4059-b389-efc605ed093b', '/sitecore/content/quanex/quanex/Home/Resources'],
  ['Sustainability', '353d671a-9a95-4f8e-bc7d-32fd1092a0ad', '/sitecore/content/quanex/quanex/Home/Sustainability'],
  ['News', '03af7489-05ad-49cc-a2fd-fbb4dcac3b05', '/sitecore/content/quanex/quanex/Home/News'],
  ['Careers', 'a508286f-88c3-4a67-9b0e-5856ded4fcb3', '/sitecore/content/quanex/quanex/Home/Careers'],
  ['Locations', 'e00843fb-81f0-4a32-bdb2-89e3a25e1c10', '/sitecore/content/quanex/quanex/Home/Locations'],
  ['Contact Us', '56ea6322-f923-44f1-b0af-2a10f9b46c04', '/sitecore/content/quanex/quanex/Home/Contact Us'],
  ['Investors', '8f0b8006-0d2c-45a3-a0cf-9d2a8ceba142', '/sitecore/content/quanex/quanex/Home/Investors'],
  ['Events', 'ec97af46-5f1a-4acb-affe-aa0b5352c0b5', '/sitecore/content/quanex/quanex/Home/Events'],
];

const block = `  - name: "quanex-ia-tree"
    kind: "ia-create"
    category: "IA"
    status: "complete"
    createdAt: "2026-08-11T18:00:00Z"
    updatedAt: "2026-08-11T19:30:00Z"
    siteName: "quanex"
    contentRootPath: "/sitecore/content/quanex/quanex/Home"
    contentRootItemId: "{E6276198-3FC7-4D8B-BD14-8669B1701536}"
    pageTemplateId: "{274FC64E-530F-457E-BD04-8B195DF94646}"
    pageTemplateName: "Services Page"
    iaSource: "docs/ai/ia/quanex-ia.md"
    sourceSite: "https://www.quanex.com/"
    createdCount: ${items.length}
    notes: >
      Created full Quanex IA tree (64 Services Page items) under Home from quanex-ia.md.
      Content sourced from quanex.com (og:description / page copy). Detail + image confirmed
      via MCP read-back. pageTitle/pageHeaderTitle/pageShortTitle/pageSubtitle/pageSummary/
      metadata*/og* sent on create/update but are silent in MCP responses (inherited fields) —
      verify in Content Editor. Image fields use external quanex.com URL XML (not DAM-uploaded).
      Services Page was NOT in Home insert options; create_content_item still succeeded.
      Item naming: spaces preserved; "&" -> "and"; "Screens+" -> "Screens Plus";
      "Service & Support" -> "Service and Support". Pre-existing Speakers/Video/Data left untouched.
    items:
${items
  .map(
    ([name, id, path]) =>
      `      - { name: "${name}", itemId: "{${id.toUpperCase()}}", path: "${path}" }`
  )
  .join('\n')}
    fieldsUpdated:
      - Detail
      - image
      - pageTitle
      - pageHeaderTitle
      - pageShortTitle
      - pageSubtitle
      - pageSummary
      - metadataTitle
      - metadataDescription
      - ogTitle
      - ogDescription
    verification:
      checkedAt: "2026-08-11T19:30:00Z"
      passed:
        - "64 pages created under /sitecore/content/quanex/quanex/Home"
        - "Detail + image confirmed via MCP get_content_item_by_path/by_id"
        - "Products subtree children present"
      failed: []
      pendingManual:
        - "Verify pageTitle/pageSummary/metadata*/og* in Content Editor (MCP silent for inherited fields)"
        - "Replace external image XML with DAM assets when Content Hub credentials available"
        - "Publish quanex Home tree for Edge"
        - "Optionally add Services Page to Home insert options"
`;

writeFileSync('docs/ai/ia/_tmp-quanex-ia-manifest-block.yaml', block);
console.log('wrote block', items.length);
