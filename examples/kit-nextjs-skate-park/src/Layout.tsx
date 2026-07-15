import React, { JSX } from "react";
import { Field, ImageField, Page } from "@sitecore-content-sdk/nextjs";
import Scripts from "src/Scripts";
import SitecoreStyles from "components/content-sdk/SitecoreStyles";
import { DesignLibraryApp } from "@sitecore-content-sdk/nextjs";
import { AppPlaceholder } from "@sitecore-content-sdk/nextjs";
import componentMap from ".sitecore/component-map";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
} from "src/lib/structured-data/schema";
import StructuredData from "src/components/structured-data/StructuredData";
import type { JsonLdValue } from "src/lib/structured-data/jsonld";
import { getBaseUrl } from "src/lib/utils";

interface LayoutProps {
  page: Page;
  baseUrl?: string;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogTitle?: Field;
  ogDescription?: Field;
  ogImage?: ImageField;
  thumbnailImage?: ImageField;
}

const Layout = ({ page, baseUrl: baseUrlProp }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? "editing-mode" : "prod-mode";
  // Use request-derived baseUrl when provided so JSON-LD URLs match actual port/host
  const baseUrl = baseUrlProp ?? getBaseUrl();
  const websiteSchema = generateWebSiteSchema(
    "Skate Park",
    baseUrl,
    "Skate Park demo site showcasing component examples"
  );
  const organizationSchema = generateOrganizationSchema(
    "Skate Park",
    baseUrl,
    undefined,
    "Skate Park demo site showcasing component examples"
  );

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <StructuredData id="website-schema" data={websiteSchema as JsonLdValue} />
      <StructuredData
        id="organization-schema"
        data={organizationSchema as JsonLdValue}
      />
      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          route && (
            <DesignLibraryApp
              page={page}
              rendering={route}
              componentMap={componentMap}
              loadServerImportMap={() => import(".sitecore/import-map.server")}
            />
          )
        ) : (
          <>
            <header>
              <div id="header">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-header"
                    rendering={route}
                  />
                )}
              </div>
            </header>
            <main>
              <div id="content">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-main"
                    rendering={route}
                  />
                )}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-footer"
                    rendering={route}
                  />
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
