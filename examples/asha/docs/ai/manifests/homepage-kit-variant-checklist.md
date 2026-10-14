# Homepage kit — Pages variant checklist

MCP cannot set Headless Variant (`FieldNames`) on a page rendering. After publish, authors should set these variants in Pages.

HeaderST Default / LoginRequired were not restyled. Use existing Version1 (Amkor), Version2 (Atlanta Apparel + AmericasMart), Version3 (LCMC).

## LCMC Home (`/sitecore/content/lcmc/lcmc/Home`)

| Component | Recommended variant | Why |
|---|---|---|
| HeroST (existing) | Default or Centered | Headline + image + CTAs. Dual search widgets are out of scope. |
| IconLinkBar | **Default** | 4-up icon quick links. Pages may have auto-selected CircleGrid — switch to Default. |
| LinkColumnsBand | **TwoColumn** | Teal hospital-network band with two link columns. |
| SplitFeature | Default | Image + text feature. |
| MultiPromo (existing) | existing | 3-up text columns. |
| ListingBlock | **Split** | News list on the left, event cards on the right. |
| SignupBanner / FooterST | existing | Do not add FooterST on the page — it lives on the Partial Design. |

## Amkor Home (`/sitecore/content/amkor/amkor/Home`)

| Component | Recommended variant | Why |
|---|---|---|
| HeroST (existing) | Default | Image + headline + CTA. |
| MultiPromo (existing) | existing | 3-up image cards. |
| ImageBanner (add in Pages if missing) | Default | Global footprint: image + heading + legend. Maps/pins skipped. |
| IconLinkBar | **DarkBand** | Technical resources dark band + icon links. Pages may have CircleGrid — switch to DarkBand. |
| SignupBanner (existing) | existing | Careers / connect band. Location search out of scope. |
| ListingBlock | **Default** | Blog / events / press cards. Extra ListingBlocks were added — assign Amkor Events `{7E04F310-AD73-4B02-B540-8E22E1F8BA07}` and Amkor Press `{5E8C92FF-AB75-4CFB-BEB8-D53F681421C5}`. |

## Atlanta Apparel Home (`/sitecore/content/andmore/atlanta-apparel/Home`)

| Component | Recommended variant | Why |
|---|---|---|
| HeroST (existing) | **Version1** | Atlanta Apparel collage-left / copy-right hero. FieldNames `{E5BC4E36-322C-4315-B747-D9435A27B507}`. |
| MultiPromo (existing) | existing | 3-up cards. |
| SplitFeature | Default then **ImageLeft** | Alternate image side for each feature. A second feature datasource is at `/sitecore/content/andmore/atlanta-apparel/Data/Split Features/Atlanta Exhibit`. |
| ButtonRow | **Default** | Additional-resources button row. |
| SignupBanner (existing) | existing | Newsletter / connect band. HubSpot forms skipped. |

## AmericasMart Home (`/sitecore/content/andmore/americasmart/Home`)

| Component | Recommended variant | Why |
|---|---|---|
| HeroST (existing) | **SplitScreen** | Split hero. |
| ButtonRow | **DarkGhost** | Dark CTA / ghost-button bar (already FieldNames DarkGhost if auto-selected). |
| MultiPromo (existing) | existing | 3-up market cards. |
| IconLinkBar | **CircleGrid** | Dark showrooms band + category image grid. |
| AccordionBlock (add in Pages if missing) | Default | FAQ. Rendering `{913E30C7-63C2-4A2B-9D44-B2ADAEED6BC2}`. |
| SignupBanner / FooterST | existing | Footer on Partial Design. |

## Authoring: where to add datasources

Create items under each site `Data` folder (insert options on folder instances may still need `__Masters` verification in Content Editor):

| Component | Folder | Parent template | Child template |
|---|---|---|---|
| IconLinkBar | `Data/Icon Link Bars` | IconLinkBar | IconLinkItem |
| LinkColumnsBand | `Data/Link Columns Bands` | LinkColumnsBand | LinkColumnsItem |
| SplitFeature | `Data/Split Features` | SplitFeature | (none) |
| ButtonRow | `Data/Button Rows` | ButtonRow | ButtonRowItem |
| ListingBlock | `Data/Listing Blocks` | ListingBlock | ListingItem |

Available Renderings: each site has a **Homepage Kit** group (do not overwrite `click-click-launch` or Page Content). If authors cannot see the five new renderings, verify the Homepage Kit `Renderings` field in Content Editor.

Images were left empty this pass — upload to DAM and set Image fields. See follow-up in the session summary.
