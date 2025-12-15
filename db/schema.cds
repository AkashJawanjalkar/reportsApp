namespace my.report;


//importing common aspects
using {
    cuid,
    managed
} from '@sap/cds/common';

entity PackingSiteReport : managed {
    key ID               : UUID   ;  

    ActualPackagingSite   : String; // Single Selection
    GlobalSPCCode         : String; // String
    PackingSiteSKU        : String; // String
    PackingSiteCode       : String; // String
    ActualReleaseSite     : String; // Single Selection

    GTIN                  : String;
    ProductDescription    : String;
    RegisteredName        : String;
    ProductStrength       : String;
    PackTypeAndSize       : String;
    PharmaceuticalForm    : String;
    MANumber              : String;
    MarketImplementationDef : String;

    // Additional fields from SKU Components grid if needed
    ComponentType         : String;
    ComponentTypeOther    : String;
    AffiliateCode         : String;
    ComponentChangeDesc   : String;
    RelatedTaskPR         : Integer;
    HAApprovalDate        : Date;
    ImplementationDeadline: Date;
    ImplementationTargetDate : Date;
    CurrentArtworkPRState : String;
    DateOfArtworkPRClosure: Date;
    Comment               : String;
    ComponentStatus       : String;
    ComponentIntroduction : String;
    ComponentIntroductionOther : String;
    QPReleaseDeadline     : Date;
    PackingDeadline       : Date;
}




//adding isdel into managed aspect
extend managed with {
    isdel : Boolean default false;
};


entity BatchData : cuid, managed {
    key ID          : UUID;
        batchNo     : String(20);
        compCode    : String(20); // pkgSite ID
        pkgSite     : String(50); //package site name
        packingDate : Date;
        releaseDate : Date;
        comments    : String;
        createdDate : Date;
}


entity T_PackagingSite : cuid, managed {
    key ID          : UUID;
        pkgSite     : String(50); //package site id
        pkgSiteName : String(250); //package site Name
        status      : String(10);
        Users       : Composition of many T_PackagingSite_Users
                          on Users.ps = $self;
}

entity T_PackagingSite_Users : cuid, managed {
    key ID     : UUID;
        userId : String(100);
        ps     : Association to T_PackagingSite;
}


entity M_PackagingSite : managed {
    key ID          : Integer;
        pkgSiteName : String(250); //package site Name
        pkgSite     : String(50); //package site id
}

entity ErrorLog : cuid, managed {
    error : String(5000);
    app   : String(100);
    srv   : String(100);
}
