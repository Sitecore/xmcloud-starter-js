Import-Function Get-ItemByIdSafe
Import-Function Update-PageTemplate
Import-Function Update-TemplateInsertOptions
Import-Function Update-LinkField

function Invoke-ModuleScriptBody {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0 )]
        [Item]$Site,
    
        [Parameter(Mandatory = $true, Position = 1 )]
        [Item[]]$TenantTemplates	
    )
    
    begin {
        Write-Verbose "Cmdlet Add Home Renderings - Post Site Creation Script"
        Write-Verbose "Cmdlet Invoke-ModuleScriptBody - Begin"
        Import-Function Get-ProjectTemplateBasedOnBaseTemplate
    }
    
    process {
        Write-Verbose "Cmdlet Invoke-ModuleScriptBody - Process"
        $sitePath = $Site.Paths.Path
        $siteCollection = $Site.Parent
        $service = [Sitecore.DependencyInjection.ServiceLocator]::ServiceProvider.GetService([Sitecore.XA.Foundation.Variants.Abstractions.Services.IAvailableRenderingVariantService])
        $item = Get-Item -Path "$sitePath/Home" -Language $Site.Language
        Write-Verbose "My site: $sitePath"

        # handle missing styles folder
        if (-not (Test-Path "$sitePath/Presentation/Styles")) {
            Import-Function Invoke-AddItem
            $action = Get-Item . -ID '{B2486523-7487-4526-978F-AD2E986B5CC4}'
            Invoke-AddItem $Site $action
        }
        
        Write-Verbose "Reset the start item and the rendering host"
        # reset the start item and the rendering host
        $siteName = $Site.Name
        $siteGrouping = Get-Item -Path "$sitePath/Settings/Site Grouping/$($sitename)" -Language $Site.Language
        $siteGrouping.StartItem = $item.ID
        
        Write-Verbose "Create page templates in the Site Collection"
        $basePageTemplateId = "{AC9DE9BE-8E86-4147-8FBC-739D5560408B}"
        $baseHomePageTemplateId = "{4ACCF644-A506-421F-B60F-A05E5C6196B4}"
        $baseArticlePageTemplateId = "{B0602368-F67C-433C-8700-862D480546D0}"
        $baseDetailPageTemplateId = "{A9919790-3389-4FC2-ABC8-24F73C847C8E}"
        $baseLandingPageTemplateId = "{C3C9FC9E-E7D3-44E6-B777-AA23496924C7}"
        $baseProductPageTemplateId = "{9A52202D-3A77-4F6D-B9BD-6AECED9BD49A}"
        $basePageFolderTemplateId = "{84DBE64B-0FED-4125-A971-725C0155C321}"
        $audioPageTemplateId = "{1B76AF75-DD75-450C-92E3-FF0F339F490B}"

        $templatesRootPath = "master:/sitecore/templates/Project/$($siteCollection.Name)"

        $pageTemplate = Get-Item -Path "$templatesRootPath/Page"
        $pageTemplate."__Base template" = $basePageTemplateId

        $homePageTemplate = Update-PageTemplate -BaseTemplateId $baseHomePageTemplateId -TemplateName "Home Page" -TemplatesRootPath $templatesRootPath
        $audioPageTemplate = Update-PageTemplate -BaseTemplateId $audioPageTemplateId -TemplateName "Audio Product Page" -TemplatesRootPath $templatesRootPath
        $articlePageTemplate = Update-PageTemplate -BaseTemplateId $baseArticlePageTemplateId -TemplateName "Article Page" -TemplatesRootPath $templatesRootPath
        $detailPageTemplate = Update-PageTemplate -BaseTemplateId $baseDetailPageTemplateId -TemplateName "Detail Page" -TemplatesRootPath $templatesRootPath
        $landingPageTemplate = Update-PageTemplate -BaseTemplateId $baseLandingPageTemplateId -TemplateName "Landing Page" -TemplatesRootPath $templatesRootPath
        $productPageTemplate = Update-PageTemplate -BaseTemplateId $baseProductPageTemplateId -TemplateName "Product Page" -TemplatesRootPath $templatesRootPath
        $pageFolderTemplate = Update-PageTemplate -BaseTemplateId $basePageFolderTemplateId -TemplateName "Page Folder" -TemplatesRootPath $templatesRootPath

        Write-Verbose "Update insert options"
        $insertOptions = @( $articlePageTemplate.ID, $audioPageTemplate.ID, $detailPageTemplate.ID, $landingPageTemplate.ID, $productPageTemplate.ID, $pageFolderTemplate.ID )
        Update-TemplateInsertOptions -TemplateItem $homePageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $audioPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $articlePageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $detailPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $articlePageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $landingPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $productPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $pageFolderTemplate -InsertOptions $insertOptions

        # Add Page Design and link partial designs
        Write-Verbose "Add Page Design and link partial designs"
        $headerPartial = Get-Item -Path "$sitePath/Presentation/Partial Designs/Global/Header" -Language $Site.Language
        $footerPartial = Get-Item -Path "$sitePath/Presentation/Partial Designs/Global/Footer" -Language $Site.Language

        $defaultPageDesign = New-Item -Path "$($sitePath)/Presentation/Page Designs" -Name "Default" -ItemType "{1105B8F8-1E00-426B-BF1F-C840742D827B}"
        $defaultPageDesign.PartialDesigns = "$($headerPartial.ID)|$($footerPartial.ID)"

        $pageDesigns = Get-Item -path "$sitePath/Presentation/Page Designs" -Language $Site.Language
        $map = [Sitecore.Text.UrlString]::new()
        $map[$homePageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$pageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$audioPageTemplate.ID] = "$($productPageDesign.ID)"
        $map[$articlePageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$detailPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$landingPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$productPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $pageDesigns.TemplatesMapping = [System.Web.HttpUtility]::UrlEncode($map.toString())
        
        Write-Verbose "Update Partial Design Rendering Variants"
        $renderingGlobalHeader = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Global Elements/GlobalHeader'
        $renderingGlobalFooter = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Global Elements/GlobalFooter'
        
        $renderingGlobalHeaderDefinition = $renderingGlobalHeader | New-Rendering
        $renderingGlobalFooterDefinition = $renderingGlobalFooter | New-Rendering

        $globalHeaderVariants = $service.GetAvailableRenderingVariants($Site, $renderingGlobalHeader.Name, $renderingGlobalHeader.ID, $headerPartial.TemplateID)
        $globalFooterVariants = $service.GetAvailableRenderingVariants($Site, $renderingGlobalFooter.Name, $renderingGlobalFooter.ID, $footerPartial.TemplateID)
        $globalHeaderVariant = $globalHeaderVariants | Where-Object { $_.Name -eq "Centered" }
        $globalFooterVariant = $globalFooterVariants | Where-Object { $_.Name -eq "BlueCompactVariant" }
        
        $globalHeaderRenderingInstance = Get-Rendering -Item $headerPartial -Rendering $renderingGlobalHeader -FinalLayout
        if ($globalHeaderRenderingInstance) {
            Set-Rendering -Item $headerPartial -Instance $globalHeaderRenderingInstance -Parameter @{ "FieldNames" = $globalHeaderVariant.ID } -FinalLayout
        }
        $globalFooterRenderingInstance = Get-Rendering -Item $footerPartial -Rendering $renderingGlobalFooter -FinalLayout
        if ($globalFooterRenderingInstance) {
            Set-Rendering -Item $footerPartial -Instance $globalFooterRenderingInstance -Parameter @{ "FieldNames" = $globalFooterVariant.ID } -FinalLayout
        }
        
        Write-Verbose "Update header links"
        $headerDatasource = Get-Item -Path "$($headerPartial.ItemPath)/Data/Global Header" -Language $Site.Language
        $aeroLink = Get-Item -Path "$($headerDatasource.ItemPath)/Primary Navigation Links/Aero" -Language $Site.Language
        $nexaLink = Get-Item -Path "$($headerDatasource.ItemPath)/Primary Navigation Links/Nexo" -Language $Site.Language #Typo is deliberate
        $terraLink = Get-Item -Path "$($headerDatasource.ItemPath)/Primary Navigation Links/Terra" -Language $Site.Language
        
        $aeroPage = Get-Item -Path "$sitePath/Home/Products/Aero" -Language $Site.Language
        $nexaPage = Get-Item -Path "$sitePath/Home/Products/Nexa" -Language $Site.Language
        $terraPage = Get-Item -Path "$sitePath/Home/Products/Terra" -Language $Site.Language
        
        Update-LinkField -Item $aeroLink -FieldName "link" -TargetItem $aeroPage
        Update-LinkField -Item $nexaLink -FieldName "link" -TargetItem $nexaPage
        Update-LinkField -Item $terraLink -FieldName "link" -TargetItem $terraPage
        
        $headerDatasource.Editing.BeginEdit()
        $headerDatasource["primaryNavigationLinks"] = "$($aeroLink.ID)|$($nexaLink.ID)|$($terraLink.ID)"
        $headerDatasource.Editing.EndEdit()
        
        $testDriveItem = $item.Children["Test Drive"]
        Update-LinkField -Item $headerDatasource -FieldName "headerContact" -TargetItem $testDriveItem
        $homePageHeroItem = Get-Item -Path "$($item.ItemPath)/Data/Home Page Hero" -Language $Site.Language 
        Update-LinkField -Item $homePageHeroItem -FieldName "bannerCTA" -TargetItem $testDriveItem
        
        $homePageProductListingItem = Get-Item -Path "$($item.ItemPath)/Data/Home Page Product Listing" -Language $Site.Language
        $homePageProductListingItem.Editing.BeginEdit()
        $homePageProductListingItem["products"] = "$($aeroPage.ID)|$($nexaPage.ID)|$($terraPage.ID)"
        $homePageProductListingItem.Editing.EndEdit()
        
        Get-Item -Path "$($item.ItemPath)/Data/Home Page Image Carousel/Slide 1" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $aeroPage
        Get-Item -Path "$($item.ItemPath)/Data/Home Page Image Carousel/Slide 2" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $nexaPage
        Get-Item -Path "$($item.ItemPath)/Data/Home Page Image Carousel/Slide 3" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $terraPage
        Get-Item -Path "$($item.ItemPath)/Data/Home Page Promo" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $testDriveItem
        $homePageAccordionItem = Get-Item -Path "$($item.ItemPath)/Data/Home Page Accordion" -Language $Site.Language
        Update-LinkField -Item $homePageAccordionItem -FieldName "link" -TargetItem $testDriveItem -Text "Contact Us"
        Get-Item -Path "$($item.ItemPath)/Test Drive/Data/Accordion - Test Drive - Demo Official" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $testDriveItem
        Get-Item -Path "$($item.ItemPath)/Products/Aero/Data/Page Header 2" -Language $Site.Language | Update-LinkField -FieldName "link1" -TargetItem $testDriveItem
        Get-Item -Path "$($item.ItemPath)/Products/Aero/Data/Page Header 2" -Language $Site.Language | Update-LinkField -FieldName "link2" -TargetItem $item
        Get-Item -Path "$($item.ItemPath)/Products/Nexa/Data/Accordion - Nexa - Demo Official" -Language $Site.Language | Update-LinkField -FieldName "link" -TargetItem $nexaPage
        Get-Item -Path "$($item.ItemPath)/Products/Nexa/Data/Page Header 2" -Language $Site.Language | Update-LinkField -FieldName "link1" -TargetItem $testDriveItem
        Get-Item -Path "$($item.ItemPath)/Products/Nexa/Data/Page Header 2" -Language $Site.Language | Update-LinkField -FieldName "link2" -TargetItem $item
        
        Write-Verbose "Update product pages with the correct taxonomy"
        $productTag = Get-Item -Path "$sitePath/Data/Taxonomy/Content Types/Product" -Language $Site.Language
        
        $aeroPage.Editing.BeginEdit()
        $aeroPage["taxContentType"] = $productTag.ID
        $aeroPage.Editing.EndEdit()
        
        $nexaPage.Editing.BeginEdit()
        $nexaPage["taxContentType"] = $productTag.ID
        $nexaPage.Editing.EndEdit()
        
        $terraPage.Editing.BeginEdit()
        $terraPage["taxContentType"] = $productTag.ID
        $terraPage.Editing.EndEdit()

        Write-Verbose "Update the home page template"
        # Update the home page template
        Set-ItemTemplate -Item $item -Template $homePageTemplate.ID
        # Re-get the item with the new base template
        $item = Get-Item -Path "$sitePath/Home" -Language $Site.Language
        
        Set-ItemTemplate -Path "$sitePath/Home/Products" -Template $pageFolderTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Test Drive" -Template $landingPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Products/Aero" -Template $productPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Products/Nexa" -Template $productPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Products/Terra" -Template $productPageTemplate.ID

        Write-Verbose "Update the home page renderings"
        $renderingContainerFullBleed = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Page Structure/Container Full Bleed'
        $renderingHero = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Banners/Hero'
        $renderingTextBanner = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Banners/TextBanner'
        $renderingImageCarousel = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Media/ImageCarousel'
        $renderingPromo = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Promos/Promo'
        $renderingProductListing = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Product/ProductListing'
        $renderingAccordion = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Accordions/Accordion'
    
        # prepare rendering definitions
        $renderingContainerFullBleedDefinition = $renderingContainerFullBleed | New-Rendering
        $renderingHeroDefinition = $renderingHero | New-Rendering
        $renderingTextBannerDefinition = $renderingTextBanner | New-Rendering
        $renderingImageCarouselDefinition = $renderingImageCarousel | New-Rendering
        $renderingPromoDefinition = $renderingPromo | New-Rendering
        $renderingProductListingDefinition = $renderingProductListing | New-Rendering
        $renderingAccordionDefinition = $renderingAccordion | New-Rendering
        
        # prepare rendering variants  
        $heroVariants = $service.GetAvailableRenderingVariants($Site, $renderingHero.Name, $renderingHero.ID, $item.TemplateID)
        $textBannerVariants = $service.GetAvailableRenderingVariants($Site, $renderingTextBanner.Name, $renderingTextBanner.ID, $item.TemplateID)
        $imageCarouselVariants = $service.GetAvailableRenderingVariants($Site, $renderingImageCarousel.Name, $renderingImageCarousel.ID, $item.TemplateID)
        $promoVariants = $service.GetAvailableRenderingVariants($Site, $renderingPromo.Name, $renderingPromo.ID, $item.TemplateID)
        $accordionVariants = $service.GetAvailableRenderingVariants($Site, $renderingAccordion.Name, $renderingAccordion.ID, $item.TemplateID)

        $heroVariant = $heroVariants | Where-Object { $_.DisplayName -eq "Image Background" }
        $textBannerVariant = $textBannerVariants | Where-Object { $_.Name -eq "Default" }
        $imageCarouselVariant = $imageCarouselVariants | Where-Object { $_.Name -eq "Default" }
        $promoVariant = $promoVariants | Where-Object { $_.Name -eq "Default" }
        $accordionVariant = $accordionVariants | Where-Object { $_.Name -eq "Default" }
        
        # add Home layout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingContainerFullBleedDefinition -Parameter @{ "DynamicPlaceholderId" = "1"; "excludeTopMargin" = "1" } -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingHeroDefinition -Parameter @{ "FieldNames" = $heroVariant.ID; "DynamicPlaceholderId" = "2" } -DataSource "local:/Data/Home Page Hero" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingTextBannerDefinition -Parameter @{ "FieldNames" = $textBannerVariant.ID; "DynamicPlaceholderId" = "3" } -DataSource "local:/Data/Home Page Text Banner" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingImageCarouselDefinition -Parameter @{ "FieldNames" = $imageCarouselVariant.ID; "DynamicPlaceholderId" = "5" } -DataSource "local:/Data/Home Page Image Carousel" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingPromoDefinition -Parameter @{ "FieldNames" = $promoVariant.ID; "DynamicPlaceholderId" = "4" } -DataSource "local:/Data/Home Page Promo" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingProductListingDefinition -DataSource "local:/Data/Home Page Product Listing" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "/headless-main/container-fullbleed-1" -Instance $renderingAccordionDefinition -Parameter @{ "FieldNames" = $accordionVariant.ID; "DynamicPlaceholderId" = "6" } -DataSource "local:/Data/Home Page Accordion" -FinalLayout

        Write-Verbose "Update home page fields"
        $title = "Alaris - Get set for an electric future."
        $shortTitle = "Alaris"

        $item."pageTitle" = $title
        $item."pageShortTitle" = $shortTitle
        $item."pageHeaderTitle" = $shortTitle
        $item."pageSummary" = $title

        $item."metadataTitle" = $title
        $item."metadataDescription" = $title
        $item."metadataKeywords" = "Alaris, electric, future"
        $item."ogTitle" = $title
        $item."ogDescription" = $title

        # Add Promo variants
        $promoVariant = Get-Item -Path "$sitePath/Presentation/Headless Variants/Promo" -Language $Site.Language
        $imageLeftVariant = New-Item -Parent $promoVariant -Name "ImageLeft" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $imageLeftVariant.'__Display name' = "Image Left"
        $imageMiddleVariant = New-Item -Parent $promoVariant -Name "ImageMiddle" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $imageMiddleVariant.'__Display name' = "Image Middle"
        $imageRightVariant = New-Item -Parent $promoVariant -Name "ImageRight" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $imageRightVariant.'__Display name' = "Image Right"
        $titlePartialOverlayVariant = New-Item -Parent $promoVariant -Name "TitlePartialOverlay" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $titlePartialOverlayVariant.'__Display name' = "Title Partial Overlay"

        Write-Verbose "Create dictionary items"
        $dictionaryRoot = Get-Item -Path "$sitePath/Dictionary" -Language $Site.Language
        $dictionaryBranchTemplate = Get-Item -Path "/sitecore/templates/Branches/Project/click-click-launch/Site 2/Add Dictionary Items" -Language $Site.Language
        New-Item -Parent $dictionaryRoot -Name "Dictionary Items" -ItemType $dictionaryBranchTemplate.ID
    }
    
    end {
        Write-Verbose "Cmdlet Invoke-ModuleScriptBody - End"
    }
}

#$site = Get-Item .
#Invoke-ModuleScriptBody -Site $site -Verbose