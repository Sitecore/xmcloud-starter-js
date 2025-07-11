Import-Function Get-ItemByIdSafe
Import-Function Update-PageTemplate
Import-Function Update-TemplateInsertOptions

function Invoke-ModuleScriptBody {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0 )]
        [Item]$Site,
    
        [Parameter(Mandatory = $true, Position = 1 )]
        [Item[]]$TenantTemplates
    )
    
    begin {
        Write-Log "Cmdlet Add Home Renderings - Post Site Creation Script"
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

        Write-Verbose "Clear styles and add custom ones"
        Remove-Item -Path "$sitePath/Presentation/Styles" -Recurse -Force
        $addStylesBranchTemplate = Get-Item -Path "/sitecore/templates/Branches/Project/click-click-launch/Site 3/Add Styles" -Language $Site.Language
        New-Item -Path "$sitePath/Presentation" -Name "Styles" -ItemType $addStylesBranchTemplate.ID
        
        # Add LinkList variants
        $linkListVariant = Get-Item -Path "$sitePath/Presentation/Headless Variants/LinkList" -Language $Site.Language
        $footerLinks = New-Item -Parent $linkListVariant -Name "FooterLinks" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $footerLinks.'__Display name' = "Footer Links"
        $headerPrimaryLinks = New-Item -Parent $linkListVariant -Name "HeaderPrimaryLinks" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $headerPrimaryLinks.'__Display name' = "Header Primary Links"
        $headerSecondaryLinks = New-Item -Parent $linkListVariant -Name "HeaderSecondaryLinks" -ItemType "{4D50CDAE-C2D9-4DE8-B080-8F992BFB1B55}"
        $headerSecondaryLinks.'__Display name' = "Header Secondary Links"
        
        Write-Verbose "Create page templates in the Site Collection"
        $basePageTemplateId = "{AC9DE9BE-8E86-4147-8FBC-739D5560408B}"
        $baseHomePageTemplateId = "{4ACCF644-A506-421F-B60F-A05E5C6196B4}"
        $audioPageTemplateId = "{1B76AF75-DD75-450C-92E3-FF0F339F490B}"
        $baseArticlePageTemplateId = "{B0602368-F67C-433C-8700-862D480546D0}"
        $baseDetailPageTemplateId = "{A9919790-3389-4FC2-ABC8-24F73C847C8E}"
        $baseLandingPageTemplateId = "{C3C9FC9E-E7D3-44E6-B777-AA23496924C7}"
        $baseProductPageTemplateId = "{9A52202D-3A77-4F6D-B9BD-6AECED9BD49A}"
        $basePageFolderTemplateId = "{84DBE64B-0FED-4125-A971-725C0155C321}"

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
        $productContentPartial = Get-Item -Path "$sitePath/Presentation/Partial Designs/Global/ProductContent" -Language $Site.Language
        
        $defaultPageDesign = New-Item -Path "$($sitePath)/Presentation/Page Designs" -Name "Default" -ItemType "{1105B8F8-1E00-426B-BF1F-C840742D827B}"
        $defaultPageDesign.PartialDesigns = "$($headerPartial.ID)|$($footerPartial.ID)"
        
        $productPageDesign = New-Item -Path "$($sitePath)/Presentation/Page Designs" -Name "ProductPage" -ItemType "{1105B8F8-1E00-426B-BF1F-C840742D827B}"
        $productPageDesign.PartialDesigns = "$($headerPartial.ID)|$($productContentPartial.ID)|$($footerPartial.ID)"

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
        
        Write-Verbose "Update rendering variants on partial designs"
        $renderingLinkList = Get-Item -Path '/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Navigation/LinkList'

        # Get variants for link list
        $linkListVariants = $service.GetAvailableRenderingVariants($Site, $renderingLinkList.Name, $renderingLinkList.ID, $item.TemplateID)
        $linkListVariant = $linkListVariants | Where-Object { $_.DisplayName -eq "FooterLinks" }

        $alignItemsCenter = Get-Item -Path "$sitePath/Presentation/Styles/Content alignment/Align content center" -Language $Site.Language
        $withSeparators = Get-Item -Path "$sitePath/Presentation/Styles/Link list/With Separators" -Language $Site.Language
        Get-Rendering -Item $footerPartial -Rendering $renderingLinkList -Placeholder "*footer-primary*" -FinalLayout | `
            Set-RenderingParameter -Parameter @{ "FieldNames" = $footerLinks.ID; "Styles" = "%7C$($alignItemsCenter.ID)%7C$($withSeparators.ID)%7C"; }  | `
            Set-Rendering -Item $footerPartial -FinalLayout
            
        Get-Rendering -Item $footerPartial -Rendering $renderingLinkList -Placeholder "*footer-secondary*" -FinalLayout | `
            Set-RenderingParameter -Parameter @{ "FieldNames" = $footerLinks.ID; "Styles" = "%7C$($alignItemsCenter.ID)%7C"; } | `
            Set-Rendering -Item $footerPartial -FinalLayout

        Write-Verbose "Update the home page template"
        # Update the home page template
        Set-ItemTemplate -Item $item -Template $homePageTemplate.ID
        
        # Re-get the item with the new base template
        $item = Get-Item -Path "$sitePath/Home" -Language $Site.Language
        
        # Update Site3 page templates
        Set-ItemTemplate -Path "$sitePath/Home/Speakers" -Template $pageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Speakers/Heritage 10" -Template $audioPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Speakers/Heritage 30" -Template $audioPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Speakers/Heritage 50" -Template $audioPageTemplate.ID
        Set-ItemTemplate -Path "$sitePath/Home/Video" -Template $pageTemplate.ID
        
        Write-Verbose "Update the home page renderings"
        $renderingHeroST = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Site 3/HeroST'
        $renderingTextSlider = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Site 3/TextSlider'
        $renderingMultiPromo = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Promos/MultiPromo'
        $renderingSignupBanner = Get-Item -Path '/sitecore/layout/Renderings/Project/click-click-launch/Site 3/SignupBanner'
    
        Write-Host "Get the rendering definitions"
        $renderingHeroSTDefinition = $renderingHeroST | New-Rendering
        $renderingTextSliderDefinition = $renderingTextSlider | New-Rendering
        $renderingMultiPromoDefinition = $renderingMultiPromo | New-Rendering
        $renderingSignupBannerDefinition = $renderingSignupBanner | New-Rendering
            
        Write-Host "Getting variants"
        
        # variants for HeroST
        $heroSTVariants = $service.GetAvailableRenderingVariants($Site, $renderingHeroST.Name, $renderingHeroST.ID, $item.TemplateID)
        $heroVariant = $heroSTVariants | Where-Object { $_.DisplayName -eq "Default" }
        $heroVariantRight = $heroSTVariants | Where-Object { $_.DisplayName -eq "Right" }
        
        # variants for Multi-Promo
        $multiPromoVariants = $service.GetAvailableRenderingVariants($Site, $renderingMultiPromo.Name, $renderingMultiPromo.ID, $item.TemplateID)
        $multiPromoVariantStacked = $multiPromoVariants | Where-Object { $_.DisplayName -eq "Stacked" }
        
        # variants for Signup Banner
        $signupBannerVariants = $service.GetAvailableRenderingVariants($Site, $renderingSignupBanner.Name, $renderingSignupBanner.ID, $item.TemplateID)
        $signupBannerVariant = $signupBannerVariants | Where-Object { $_.DisplayName -eq "Default" }
        
        Write-Verbose "Get styles for multi-promo"
        $multiPromoGrid3_2 = Get-Item -Path "$sitePath/Presentation/Styles/MultiPromo/Grid/3_2" -Language $Site.Language
        
        # Add Home layout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingHeroSTDefinition -Parameter @{ "DynamicPlaceholderId" = "1"; "FieldNames" = $heroVariant.ID; } -DataSource "local:/Data/HeroST/HeroST 1" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingHeroSTDefinition -Parameter @{ "DynamicPlaceholderId" = "3"; "FieldNames" = $heroVariantRight.ID; } -DataSource "local:/Data/HeroST/HeroST 2" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingHeroSTDefinition -Parameter @{ "DynamicPlaceholderId" = "4"; "FieldNames" = $heroVariant.ID; } -DataSource "local:/Data/HeroST/HeroST 3" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingTextSliderDefinition -Parameter @{ "DynamicPlaceholderId" = "2"; } -DataSource "local:/Data/TextSlider 1" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingMultiPromoDefinition `
          -Parameter @{ "DynamicPlaceholderId" = "6"; "FieldNames" = $multiPromoVariantStacked.ID; "Styles" = "%7C$($multiPromoGrid3_2.ID)%7C"; } `
          -DataSource "local:/Data/MultiPromo 2" -FinalLayout
        Add-Rendering -Item $item -PlaceHolder "headless-main" -Instance $renderingSignupBannerDefinition -Parameter @{ "DynamicPlaceholderId" = "5"; "FieldNames" = $signupBannerVariant.ID; } -DataSource "local:/Data/SignupBanner 1" -FinalLayout

        Write-Verbose "Update home page fields"
        $title = "SYNC"
        $shortTitle = "SYNC"

        $item."pageTitle" = $title
        $item."pageShortTitle" = $shortTitle
        $item."pageHeaderTitle" = $shortTitle
        $item."pageSummary" = $title

        $item."metadataTitle" = $title
        $item."metadataDescription" = $title
        $item."metadataKeywords" = "Symphonic, audio, speakers, headphones"
        $item."ogTitle" = $title
        $item."ogDescription" = $title
        
        Write-Verbose "Create dictionary items"
        $dictionaryRoot = Get-Item -Path "$sitePath/Dictionary" -Language $Site.Language
        $dictionaryBranchTemplate = Get-Item -Path "/sitecore/templates/Branches/Project/click-click-launch/Site 3/Add Dictionary Items" -Language $Site.Language
        New-Item -Parent $dictionaryRoot -Name "Dictionary Items" -ItemType $dictionaryBranchTemplate.ID
    }
    
    end {
        Write-Log "Cmdlet Invoke-ModuleScriptBody - End"
    }
}

#$site = Get-Item .
#Invoke-ModuleScriptBody -Site $site -Verbose