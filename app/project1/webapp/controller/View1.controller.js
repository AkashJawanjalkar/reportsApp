/* 
 **********************************************************************
 *& Author          : Riya Tickoo                                     *
 *& Date            : 20-09-2025                                      *
 *& Title           : Batch Packaging and Release Data Portal         *
 *& Description     : Reports                                         *
 **********************************************************************
 */

// const { message } = require("@sap/cds/lib/log/cds-error");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/table/Table",
    "sap/ui/table/Column",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, MessageToast, Table, Column, Fragment) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
            this.getView().setModel(new sap.ui.model.json.JSONModel({ sites: [], selectedPackingSites: [], inactiveUsers: [], inactiveUsersCMO: [], inactiveUsersViatris: [], selectedPackingReport: [] , aSKUData: [], aCMSWip: [], aCMSClose: [] }), "JSONModel");
            this.getView().setModel(new JSONModel({
                roleFlags: { isSuper: false, isCMO: false, isViewer: false, isAuditor: false },
                readOnly: true
            }), "viewState");


            //=======================================================================================
           


            // const obj = new JSONModel({ aSKUData: [], aCMSWip: [], aCMSClose: [] });
            // this.getView().setModel(obj, "sku");
            // this._aOriginalSKUData = [];
            // this._aOriginalCMSWipData = [];
            // this._aOriginalCMSClosed = [];

            





             const pgkSite = new JSONModel({
                aActualPkgSite: [
                    { actualPackagingSite: "ABT Spain (ES)" },
                    { actualPackagingSite: "ABC Pharma (UK)" },
                    { actualPackagingSite: "ABB India (IN)" },
                    { actualPackagingSite: "ABT Argentina (AR)" }
                ]
            });

            this.getView().setModel(pgkSite, "oPkgSite");

           
            //===================================================================================================

            // const sServiceUrl = this.getOwnerComponent().getModel("UserInfoServiceModel").sServiceUrl;
            // if (sServiceUrl) {
            //     $.ajax({
            //         url: sServiceUrl + "userinfo",
            //         method: "GET",
            //         success: (user) => {
            //             const vs = this.getView().getModel("viewState");
            //             vs.setProperty("/sGenerateUser", user.id);
            //             const roles = (user && user.roles) || {};
            //             const flags = {
            //                 isSuper: !!roles.Super_User,
            //                 isCMO: !!roles.CMO,
            //                 isViewer: !!roles.Viewer,
            //                 isAuditor: !!roles.Auditor
            //             };
            //             const readOnly = false;
            //             vs.setProperty("/roleFlags", flags);
            //             vs.setProperty("/readOnly", readOnly);
            //             this._applyReportTabRules();
            //             this._loadSitesFromBackend();
            //         }
            //     });
            // }

            var oData = {
                summary: [],
                track: [],
                audit: [],
                activity: []
            };

            //////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

            this._reportTitles = {
                summary: "Packaging and Release Site Summary Report",
                track: "TrackWise Report",
                audit: "Audit Trail Report",
                activity: "Packaging and Release Site Activity",
                SKUComponent: "SKU Components",
                CMSWIP: "CMS-Task ArtWork WIP",
                CMSClosed: "CMS-Task ArtWork Closed"
            };
            this._columnMapping = {
                batchNo: "Batch No.",
                comments: "Comments",
                compCode: "Component Code",
                createdAt: "Created At",
                createdBy: "Created By",
                createdDate: "Created Date",
                packingDate: "Packaging Date",
                pkgSite: "Packaging Site",
                pkgSiteIDName: "Packaging Site ID - Name",
                releaseDate: "Release Date",
                packagingSiteID: "Packaging Site ID",
                user: "User",
                lastActivityDate: "Last Activity Date",
                todayDate: "Today Date",
                daysFromToday: "Days From Today",
                changedAt: "Changed At",
                changedBy: "Changed By",
                fieldName: "Field Name",
                oldValue: "Old Value",
                newValue: "New Value",
                packagingSiteName: "Packaging Site Name",
                action: "Action",
                global_spc_code: "Global SPC Code",
                gtin: "GTIN",
                product_description: "Product Description",
                registered_name: "Registered Name",
                product_strength: "Product Strength",
                pack_type_size: "Pack Type & Size",
                pharmaceutical_form: "Pharmaceutical Form",
                ma_number: "MA Number",
                actual_packaging_site: "Actual Packaging Site",
                actual_release_site: "Actual Release Site",
                market_implementation_def: "Market Implementation Def",
                prID: "PR ID",
                component_type: "Component Type",
                component_type_other: "Component Type (Other)",
                affiliate_code: "Affiliate Code",
                packing_site_code: "Packing Site Code",
                component_change_description: "Component Change Description",
                related_task_pr: "Related Task PR",
                ha_approval_date: "HA Approval Date",
                implementation_deadline: "Implementation Deadline",
                implementation_target_date: "Implementation Target Date",
                current_artwork_pr_state: "Current Artwork PR State",
                date_of_artwork_pr_closure: "Date of Artwork PR Closure",
                comment: "Comment",
                component_status: "Component Status",
                component_introduction: "Component Introduction",
                component_introduction_other: "Component Introduction (Other)",
                qp_release_deadline: "QP Release Deadline",
                packing_deadline: "Packing Deadline",
                packing_site_sku: "Packing Site SKU",
                prId: "PR ID",
                prStatus: "PR State",
                markets: "Market",
                globalSpcCodes: "Global SPC Code",
                productGroups: "Product Group",
                strengths: "Strength",
                packSizes: "Pack Size",
                artworkComponentImpacted: "Artwork Component Impacted",
                actualPackagingSite: "Actual Packaging Site",
                newPackingSiteCode: "New Packing Site Code",
                newAffiliateCode: "New Affiliate Code",
                implementationDeadline: "Implementation Deadline",
                implementationTargetDate: "Implementation Target Date",
                changeDescription: "Change Description",
                dateClosed: "Date Closed"


            };
            this._ignoredColumns = ["ID", "isdel"];
            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
            this._currentKey = null;
            this._inactiveLoaded = false;
            this._oSelectedCard = null;
            this.byId("filterBar").setVisible(true);
            this.byId("cardsRow").setVisible(true);
            this.byId("tableContainer").setVisible(false);
            this.byId("changedByInput").setVisible(false);
            this.byId("auditToggleSelect").setVisible(false);
            this.byId("createdByInput").setVisible(false);

        },

        // Helps to opent the Email  
        onCreatedEmailByVH: function () {
            if (!this._oEmailByVH) {
                this._oEmailByVH = sap.ui.xmlfragment("project1.fragment.EmailIDActivity", this);
                this.getView().addDependent(this._oEmailByVH);
            }

            const box = this.byId("createdByBox");
            const current = (box.getValue() || "")
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(Boolean);

            const dlg = this._oEmailByVH;

            const applyPreselect = () => {
                (dlg.getItems() || []).forEach(item => {
                    const ctx = item.getBindingContext("JSONModel");
                    if (!ctx) return;
                    const email = String(ctx.getProperty("USERID") || "").trim().toLowerCase();
                    item.setSelected(current.includes(email));
                });
                dlg.updateSelectionIndicator && dlg.updateSelectionIndicator();
            };

            dlg.open();
            applyPreselect();
            const b = dlg.getBinding("items");
            b && b.attachEventOnce("change", applyPreselect);
        },

        // Search the email address
        onEmailActByVHSearch: function (oEvent) {
            const sQuery = (oEvent.getParameter("value") || "").trim();
            const oBinding = oEvent.getSource().getBinding("items");
            if (!oBinding) {
                return;
            }

            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            const Filter = sap.ui.model.Filter;
            const FO = sap.ui.model.FilterOperator;

            oBinding.filter([
                new Filter("USERID", FO.Contains, sQuery)
            ]);
        },


        // Helps to confirm the ID
        onEmailByVHConfirm: function (oEvent) {
            const aCtx = oEvent.getParameter("selectedContexts") || [];
            const emails = aCtx
                .map(ctx => String(ctx.getProperty("USERID") || "").trim())
                .filter(Boolean);

            const box = this.byId("createdByBox");
            box.setValue(emails.join(", "));
            this.onCreadtedByChange && this.onCreadtedByChange({ getSource: () => box });
        },

        onEmailByVHCancel: function () { /* no-op */ },

        onChangedByVH: function () {
            if (!this._oChangedByVH) {
                this._oChangedByVH = sap.ui.xmlfragment("project1.fragment.EmailID", this);
                this.getView().addDependent(this._oChangedByVH);
            }
            const box = this.byId("changedByBox");
            const current = (box.getValue() || "")
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(Boolean);

            const dlg = this._oChangedByVH;
            const applyPreselect = () => {
                (dlg.getItems() || []).forEach(item => {
                    const ctx = item.getBindingContext("JSONModel");
                    if (!ctx) return;
                    const email = String(ctx.getProperty("USERID") || "").trim().toLowerCase();
                    item.setSelected(current.includes(email));
                });
                dlg.updateSelectionIndicator && dlg.updateSelectionIndicator();
            };
            dlg.open();
            applyPreselect();
            const b = dlg.getBinding("items");
            b && b.attachEventOnce("change", applyPreselect);
        },
        onChangedByVHSearch: function (oEvent) {

            const sQuery = (oEvent.getParameter("value") || "").trim();


            const oBinding = oEvent.getSource().getBinding("items");
            if (!oBinding) {
                return;
            }

            if (!sQuery) {

                oBinding.filter([]);
                return;
            }

            const Filter = sap.ui.model.Filter;
            const FO = sap.ui.model.FilterOperator;

            oBinding.filter([
                new Filter("USERID", FO.Contains, sQuery)
            ]);
        },

        onChangedByVHConfirm: function (oEvent) {
            const aCtx = oEvent.getParameter("selectedContexts") || [];
            const emails = aCtx
                .map(ctx => String(ctx.getProperty("USERID") || "").trim())
                .filter(Boolean);

            const box = this.byId("changedByBox");
            box.setValue(emails.join(", "));
            // this.onChangedByChange && this.onChangedByChange({ getSource: () => box });
        },

        onEmailBlockTyping: function (oEvent) {
            const oInput = oEvent.getSource();
            const oBinding = oInput.getBinding("value");
            if (oBinding && oBinding.getValue) {
                const sModelValue = oBinding.getValue();
                oInput.setValue(sModelValue || "");
            } else {
                oInput.setValue("");
            }
            sap.m.MessageToast.show("Please use F4 (value help) to select the Email ID.");
        },

        onPackingSiteBlockTyping: function (oEvent) {
            const oMI = oEvent.getSource();
            oMI.setValue("");
            sap.m.MessageToast.show("Please use F4 (value help) to select Packaging Site(s).");
        },


        onChangedByVHCancel: function () { /* no-op */ },

        // Helps to open the packaging site
        onPackagingInput: function () {
            if (!this._oValueHelpDialogPack) {
                this._oValueHelpDialogPack = sap.ui.xmlfragment("project1.fragment.PackingSiteActivity", this);
                this.getView().addDependent(this._oValueHelpDialogPack);
            }
            this._oValueHelpDialogPack.open();
            this._reselectInDialog1();

        },

        // Helps to search the packaging site
        onPackingSiteSearchAct: function (oEvent) {
            var sValue = oEvent.getParameter("newValue") || oEvent.getParameter("query") || oEvent.getParameter("value") || "";
            var oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("packingSiteId", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("packingSiteName", sap.ui.model.FilterOperator.Contains, sValue)
                ],
                and: false
            });
            var list = sap.ui.getCore().byId("packingSiteListAct");
            if (list) {
                list.getBinding("items").filter(oFilter);
            }
        },

        //Marks every item in the list as selected
        onPackingSiteSelectAllAct: function () {
            var list = sap.ui.getCore().byId("packingSiteListAct");
            if (!list) return;
            list.getItems().forEach(function (oItem) { oItem.setSelected(true); });
        },

        //Clears the selection for all items
        onPackingSiteClearAllAct: function () {
            var list = sap.ui.getCore().byId("packingSiteListAct");
            if (!list) return;
            list.getItems().forEach(function (oItem) { oItem.setSelected(false); });
        },

        //button of the active packing site and Closes the dialog
        onPackingSiteDialogOkAct: function () {
            var list = sap.ui.getCore().byId("packingSiteListAct");
            if (!list) return;

            var aSelectedItems = list.getSelectedItems() || [];
            var aIds = aSelectedItems.map(function (itm) {
                var o = itm.getBindingContext("JSONModel").getObject();
                return o.packingSiteId;
            });
            var oMI = this.byId("packagingsite");
            oMI.removeAllTokens();
            aSelectedItems.forEach(function (itm) {
                var o = itm.getBindingContext("JSONModel").getObject();
                oMI.addToken(new sap.m.Token({ key: o.packingSiteId, text: o.packingSiteId }));
            });
            this.getView().getModel("JSONModel").setProperty("/selectedPackingReport", aIds);
            this._oValueHelpDialogPack.close();
        },

        onPackingSiteDialogCancelAct: function () {
            this._oValueHelpDialogPack && this._oValueHelpDialogPack.close();
        },
        //This helps opens the dialog containing a List of packing sites
        onProductInputClick: function () {
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = sap.ui.xmlfragment("project1.fragment.PackingSiteCode", this);
                this.getView().addDependent(this._oValueHelpDialog);
            }
            this._oValueHelpDialog.open();
            this._reselectInDialog();
        },

        _reselectInDialog: function () {
            var dlg = this._oValueHelpDialog;
            if (!dlg) { return; }

            var list = dlg.byId("packingSiteList") || sap.ui.getCore().byId("packingSiteList");
            if (!list) { return; }

            var fnApply = function () {
                var oJSON = this.getView().getModel("JSONModel");
                var aSelectedIds = oJSON.getProperty("/selectedPackingSites") || [];
                var aItems = list.getItems();


                aItems.forEach(function (oItem) {
                    oItem.setSelected(false);
                });


                aItems.forEach(function (oItem) {
                    var oCtx = oItem.getBindingContext("JSONModel");
                    var oObj = oCtx && oCtx.getObject();
                    if (oObj && aSelectedIds.indexOf(oObj.packingSiteId) !== -1) {
                        oItem.setSelected(true);
                    }
                });
            }.bind(this);

            fnApply();

            var oBinding = list.getBinding("items");
            if (oBinding && oBinding.attachEventOnce) {
                oBinding.attachEventOnce("change", fnApply);
            } else {
                setTimeout(fnApply, 0);
            }
        },

        //Helps to search event handler for the packing site
        onPackingSiteSearch: function (oEvent) {
            var sValue = oEvent.getParameter("newValue") || oEvent.getParameter("query") || oEvent.getParameter("value") || "";
            var oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("packingSiteId", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("packingSiteName", sap.ui.model.FilterOperator.Contains, sValue)
                ],
                and: false
            });
            var list = sap.ui.getCore().byId("packingSiteList");
            if (list) {
                list.getBinding("items").filter(oFilter);
            }
        },

        //button inside the general packing site
        onPackingSiteSelectAll: function () {
            var list = sap.ui.getCore().byId("packingSiteList");
            if (!list) return;
            list.getItems().forEach(function (oItem) { oItem.setSelected(true); });
        },

        //Helps to Clear All button inside the general packing site
        onPackingSiteClearAll: function () {
            var list = sap.ui.getCore().byId("packingSiteList");
            if (!list) return;
            list.getItems().forEach(function (oItem) { oItem.setSelected(false); });
        },

        // Helps to updates the packaging site with tokens
        onPackingSiteDialogOk: function () {
            var list = sap.ui.getCore().byId("packingSiteList");
            if (!list) return;

            var aSelectedItems = list.getSelectedItems() || [];
            var aIds = aSelectedItems.map(function (itm) {
                var o = itm.getBindingContext("JSONModel").getObject();
                return o.packingSiteId;
            });
            var oMI = this.byId("packagingsiteInput");
            oMI.removeAllTokens();
            aSelectedItems.forEach(function (itm) {
                var o = itm.getBindingContext("JSONModel").getObject();
                oMI.addToken(new sap.m.Token({ key: o.packingSiteId, text: o.packingSiteId }));
            });
            this.getView().getModel("JSONModel").setProperty("/selectedPackingSites", aIds);
            this._oValueHelpDialog.close();
        },

        //Closes the dialog without modifying the selected ID
        onPackingSiteDialogCancel: function () {
            this._oValueHelpDialog && this._oValueHelpDialog.close();
        },

        //Remove the corresponding ID and fired when tokens are updated
        onPackingSiteTokensUpdate: function (oEvent) {
            if (oEvent.getParameter("type") !== "removed") return;

            var oJSON = this.getView().getModel("JSONModel");
            var aIds = oJSON.getProperty("/selectedPackingSites") || [];

            (oEvent.getParameter("removedTokens") || []).forEach(function (t) {
                aIds = aIds.filter(function (k) { return k !== t.getKey(); });
            });

            oJSON.setProperty("/selectedPackingSites", aIds);

            if (this._oValueHelpDialog && this._oValueHelpDialog.isOpen && this._oValueHelpDialog.isOpen()) {
                this._reselectInDialog();
            }
        },

        // Helps to "From Date" change 
        onFromDateChange: function (oEvent) {
            var oFromDate = oEvent.getSource().getDateValue();
            this._adjustToDateRange(oFromDate);
        },

        onDateChangeManually: function (oEvent) {
            const value = oEvent.getParameter("value");
            if (value) {
                MessageToast.show("Please Select Date From Date Picker..!");
                const oFP = this.byId("fromDate");
                const oTP = this.byId("toDate");

                setTimeout(() => {
                    oFP.setValue(" ");
                    oFP.setValue("");
                    oFP.setDateValue(null);

                    oTP.setValue(" ");
                    oTP.setValue("");
                    oTP.setDateValue(null);
                }, 0);
                return;
            }
        },


        _adjustToDateRange: function (oFromDate) {
            var oToDatePicker = this.byId("toDate");
            if (!oFromDate) return;
            oToDatePicker.setMinDate(oFromDate);
            var oMaxDate = new Date(oFromDate.getTime());
            oMaxDate.setMonth(oMaxDate.getMonth() + 3);
            oToDatePicker.setMaxDate(oMaxDate);
            var oCurrentToDate = oToDatePicker.getDateValue();
            if (oCurrentToDate) {
                if (oCurrentToDate < oFromDate || oCurrentToDate > oMaxDate) {
                    oToDatePicker.setDateValue(null);
                }
            }
        },

        // Helps to "To Date" change 
        onToDateChange: function (oEvent) {
            var oToDate = oEvent.getSource().getDateValue();
            var oFromDate = this.byId("fromDate").getDateValue();

            if (!oFromDate && oToDate) {
                sap.m.MessageToast.show("Please select From Date first");
                oEvent.getSource().setValue("");
            }
        },

        // This function helps to call the backend servicesaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        onPressGo: async function () {
            var sUrl = this.getOwnerComponent().getModel().sServiceUrl;
            var oFrom = this.byId("fromDate").getDateValue();
            var oTo = this.byId("toDate").getDateValue();

            //  if (!oFrom || !oTo) {
            //     sap.m.MessageToast.show("Please select both From and To dates");
            //     return;
            // }
            // if (oFrom > oTo) {
            //     sap.m.MessageToast.show("From Date cannot be greater than To Date");
            //     return;
            // }

            // oTo.setHours(23, 59, 59, 999);
            var fmtDate = function (d) {
                var y = d.getFullYear();
                var m = String(d.getMonth() + 1).padStart(2, "0");
                var day = String(d.getDate()).padStart(2, "0");
                return y + "-" + m + "-" + day;
            };
            var that = this;
            this._filteredData = {};
            var sKey = this._currentKey || "summary";
       //     console.log("Selected Key in onGo: ",sKey);
            if (sKey === "summary") {

                if (!oFrom || !oTo) {
                    sap.m.MessageToast.show("Please select both From and To dates");
                    return;
                }
                if (oFrom > oTo) {
                    sap.m.MessageToast.show("From Date cannot be greater than To Date");
                    return;
                }

                var oMultiInput = this.byId("packagingsiteInput") || this.byId("packagingsite");
                var aTokens = (oMultiInput && oMultiInput.getTokens()) || [];
                var aPkgSites = aTokens.map(t => t.getKey() || t.getText()).filter(Boolean);
                var sTyped = (oMultiInput && oMultiInput.getValue() || "").trim();
                if (sTyped) aPkgSites.push(sTyped);
                if (!aPkgSites.length) {
                    sap.m.MessageToast.show("Please Select Packaging Site");
                    return;
                }
                if (!oFrom || !oTo) {
                    sap.m.MessageToast.show("Please select both From and To dates");
                    return;
                }
                if (oFrom > oTo) {
                    sap.m.MessageToast.show("From Date cannot be greater than To Date");
                    return;
                }
                var fmtDate = d => {
                    var y = d.getFullYear();
                    var m = String(d.getMonth() + 1).padStart(2, "0");
                    var day = String(d.getDate()).padStart(2, "0");
                    return `${y}-${m}-${day}`;
                };

                var sFrom = fmtDate(oFrom);
                var sTo = fmtDate(oTo);
                var sDocBase = this.getOwnerComponent().getModel("documentServiceModel").sServiceUrl.replace(/\/?$/, "/");
                var sEndpoint = sDocBase + "Summary_reporting";
                var that = this;
                $.ajax({
                    url: sEndpoint,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        createdDate: [sFrom, sTo],
                        pkgSites: aPkgSites
                    }),
                    success: function (res) {
                        var aSummary = res && (res.value || res.results || res) || [];
                        if (!Array.isArray(aSummary)) aSummary = [];

                        if (!aSummary.length) {
                            sap.m.MessageToast.show("No data found for selected criteria.");
                            that.getView().getModel().setProperty("/summary", []);
                            that._filteredData.summary = [];
                            return;
                        }
                        var aColumnOrder = [
                            "batchNo",
                            "compCode",
                            "releaseDate",
                            "packingDate",
                            "createdAt",
                            // "pkgSite",
                            "pkgSiteIDName",
                            "comments",
                            "createdBy",
                            // "modifiedAt",
                            // "modifiedBy"
                        ];
                        const _pad = n => String(n).padStart(2, "0");
                        const _toDate = v => (v instanceof Date ? v : new Date(v));
                        function formatDate(v) {
                            if (!v) return "";
                            const d = _toDate(v);
                            if (isNaN(d)) return v;
                            return `${_pad(d.getDate())}/${_pad(d.getMonth() + 1)}/${d.getFullYear()}`;
                        }
                        function formatDateTime(v) {
                            if (!v) return "";
                            const d = _toDate(v);
                            if (isNaN(d)) return v;
                            return `${_pad(d.getDate())}/${_pad(d.getMonth() + 1)}/${d.getFullYear()} ${_pad(d.getHours())}:${_pad(d.getMinutes())}`;
                        }

                        var aReordered = aSummary.map(function (row) {
                            var out = {};
                            aColumnOrder.forEach(function (k) {
                                var val = row[k];

                                if (/at$/i.test(k)) {
                                    out[k] = formatDateTime(val);
                                } else if (/date/i.test(k)) {
                                    out[k] = formatDate(val);
                                } else {
                                    out[k] = (val ?? "");
                                }
                            });
                            return out;
                        });
                        that.getView().getModel().setProperty("/summary", aReordered);
                        that._filteredData.summary = aReordered;
                        that._createTable("summary", aReordered);
                        that.byId("summaryFilterBar").setVisible(true);
                        that.byId("tableContainer").setVisible(true);
                    },
                    error: function (xhr, status, error) {
                        console.error("Summary_reporting error:", status, error, xhr && xhr.responseText);
                        sap.m.MessageToast.show("Error fetching summary. See console for details.");
                        that.getView().getModel().setProperty("/summary", []);
                        that._filteredData.summary = [];
                    }
                });
            }
            else if (sKey === "track") {

                if (!oFrom || !oTo) {
                    sap.m.MessageToast.show("Please select both From and To dates");
                    return;
                }
                if (oFrom > oTo) {
                    sap.m.MessageToast.show("From Date cannot be greater than To Date");
                    return;
                }

                this.byId("trackFilterBar").setVisible(true);
                this.byId("tableContainer").setVisible(true);

                const aData = await this._loadTrackwiseReport(oFrom, oTo);
                this._createTable("track", aData);
            }
            else if (sKey === "audit") {
                const sServiceUrl = this.getOwnerComponent().getModel("documentServiceModel").sServiceUrl;
                const oSegment = this.byId("auditToggleSelect");
                const auditToggleKey = oSegment.getSelectedKey();
                const sUserRaw = this.byId("changedByBox").getValue().trim();
                const oFrom = this.byId("fromDate").getDateValue();
                const oTo = this.byId("toDate").getDateValue();
                if (!oFrom || !oTo) {
                    sap.m.MessageToast.show("Please select both From and To dates");
                    return;
                }
                if (oFrom > oTo) {
                    sap.m.MessageToast.show("From Date cannot be after To Date");
                    return;
                }
                const toUtcMidnightIso = (d) => {
                    const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
                    return utc.toISOString().replace(/\.\d{3}Z$/, "Z");
                };
                const addDays = (d, n) => {
                    const copy = new Date(d.getTime());
                    copy.setDate(copy.getDate() + n);
                    return copy;
                };
                const fromIso = toUtcMidnightIso(oFrom);
                const toNextDayIso = toUtcMidnightIso(addDays(oTo, 1));
                const aUsers = sUserRaw
                    ? sUserRaw.split(",").map(u => u.trim()).filter(Boolean)
                    : [];
                const sUsersFilter = aUsers
                    .map(u => `'${u.replace(/'/g, "''")}'`)
                    .join(",");

                let sEntity = "";
                let sFilter = "";
                if (auditToggleKey === "batch") {
                    sEntity = "AuditTrial";
                    const aPkgSiteTokens = this.byId("packagingsite").getTokens().map(t => t.getKey());
                    const aPkgSites = (aPkgSiteTokens || []).filter(Boolean);

                    const sPkgSitesFilter = aPkgSites
                        .map(s => `'${s.replace(/'/g, "''")}'`)
                        .join(",");

                    const aConditions = [];

                    if (aPkgSites.length) {
                        aConditions.push(`pkgSite in (${sPkgSitesFilter})`);
                    }
                    if (aUsers.length) {
                        aConditions.push(`createdBy in (${sUsersFilter})`);
                    }

                    aConditions.push(`createdAt ge ${fromIso}`);
                    aConditions.push(`createdAt lt ${toNextDayIso}`);

                    sFilter = aConditions.join(" and ");
                } else if (auditToggleKey === "packaging") {
                    sEntity = "AuditLogDetail";

                    const aConditions = [];

                    if (aUsers.length) {
                        aConditions.push(`changedBy in (${sUsersFilter})`);
                    }

                    aConditions.push(`changedAt ge ${fromIso}`);
                    aConditions.push(`changedAt lt ${toNextDayIso}`);

                    sFilter = aConditions.join(" and ");
                    this.byId("auditFilterBar").setVisible(false);
                    ["auditBatchNo", "auditCreatedBy", "auditCompCode"].forEach(id => {
                        const c = this.byId(id);
                        c && c.setValue("");
                    });
                    const rowsBox = this.byId("auditFilterRows");
                    rowsBox && rowsBox.destroyItems();
                    this._auditDynamicFilters = {};

                } else {
                    sap.m.MessageToast.show("Invalid audit type selected.");
                    return;
                }

                const sUrl = `${sServiceUrl}${sEntity}?$filter=${encodeURIComponent(sFilter)}`;
             //   console.log("Final Audit URL:", sUrl);

                try {
                    const audit = await this._loadAuditData(sUrl, auditToggleKey);
                    this.byId("tableContainer").setVisible(true);

                    const isBatch = auditToggleKey === "batch";
                    this.byId("auditFilterBar").setVisible(isBatch);
                    this.byId("auditPackagingFilterBar").setVisible(!isBatch);

                    this._createTable("audit", audit);
                } catch (err) {
                    console.error("Error loading audit data:", err);
                    sap.m.MessageToast.show("Failed to load audit data.");
                }
            }

            else if (sKey === "activity") {
                const sServiceUrl = this.getOwnerComponent().getModel("documentServiceModel").sServiceUrl;
                const sCreatedByRaw = this.byId("createdByBox").getValue().trim();
                const aPkgSiteRaw = this.byId("packagingsite").getTokens().map(t => t.getKey());
                const oFrom = this.byId("fromDate").getDateValue();
                const oTo = this.byId("toDate").getDateValue();
                if (!oFrom || !oTo) {
                    sap.m.MessageToast.show("Please select both From and To dates");
                    return;
                }
                if (oFrom > oTo) {
                    sap.m.MessageToast.show("From Date cannot be after To Date");
                    return;
                }
                const sFrom = oFrom.toISOString().split("T")[0];
                const sTo = oTo.toISOString().split("T")[0];
                const aCreatedBys = sCreatedByRaw
                    ? sCreatedByRaw.split(",").map(u => u.trim()).filter(Boolean)
                    : [];

                const aPkgSites = (aPkgSiteRaw || []).filter(Boolean);
                const oPayload = {
                    createdDate: [sFrom, sTo],
                    pkgSites: aPkgSites,
                    createdBys: aCreatedBys
                };
                const sUrl = `${sServiceUrl}activityReport`;
              //  console.log("Activity POST Payload:", oPayload);
               // console.log("POST URL:", sUrl);

                try {
                    const res = await $.ajax({
                        url: sUrl,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(oPayload)
                    });

                    const aActivity = res.value || [];
                    this.byId("activityFilterBar").setVisible(true);
                    this.byId("tableContainer").setVisible(true);

                    function formatDateForUI(value) {
                        if (!value) return "";
                        const oDate = new Date(value);
                        if (isNaN(oDate.getTime())) return value;
                        const dd = String(oDate.getDate()).padStart(2, "0");
                        const mm = String(oDate.getMonth() + 1).padStart(2, "0");
                        const yyyy = oDate.getFullYear();
                        return `${dd}/${mm}/${yyyy}`;
                    }

                    const aFormattedActivity = aActivity.map(item => {
                        const newObj = { ...item };
                        ["lastActivityDate", "todayDate"].forEach(field => {
                            if (newObj[field]) {
                                newObj[field] = formatDateForUI(newObj[field]);
                            }
                        });
                        return newObj;
                    });
                    this._filteredData.activity = aFormattedActivity;
                    this._createTable("activity", aFormattedActivity);
                 //   console.log("Activity Data:", aActivity);
                } catch (err) {
                    console.error("Error loading activity data:", err);
                    sap.m.MessageToast.show("Failed to load activity data.");
                }

            }
////////////////////////////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            else if (sKey === "SKUComponent") {
                this._LoadSKUComponentData();

                const aSKUData = this._filteredData.aSKUData;
             //   console.log("aSKU Data : ", aSKUData);
                this._createTable("SKUComponent", aSKUData);
            }

            else if (sKey === "CMSWIP") {

                this._LoadCMSWIPData();
                const aCMSWIPData = this._filteredData.aCMSWip;
            //    console.log("aSKU Data : ", aCMSWIPData);
                this._createTable("CMSWIP", aCMSWIPData);
                this.byId("tableContainer").setVisible(true);
                this.byId("dynamicFiltersCMSWIP").setVisible(true);

            }
            else if (sKey === "CMSClosed") {
                this._LoadCMSClosedData();
                const aCMSClosedData =   this._filteredData.aCMSClose;
           //     console.log("CMS Closed : ", aCMSClosedData);
                this._createTable("CMSClosed", aCMSClosedData);
                this.byId("dynamicFiltersCMSClosed").setVisible(true);
                this.byId("tableContainer").setVisible(true);

            }

        },

        _LoadCMSClosedData: function () {
            console.log("_LoadCMSClosedData called ");
            var oDateRange = this.byId("CMSWIPDataRangeId");
            var dFrom = oDateRange?.getDateValue ? oDateRange.getDateValue() : null;
            var dTo = oDateRange?.getSecondDateValue ? oDateRange.getSecondDateValue() : null;
            console.log("From Data : " + dFrom + " ToDate : " + dTo);

            const sActualPkgSite = this.byId("SKUPkgSiteId").getValue();
         //   console.log("Selected key : ", sActualPkgSite);

            this.byId("dynamicFiltersCMSClosed").setVisible(true);
            //   this.byId("idCMSClosedPanel").setVisible(true);

            const oPayLoad = {
                FromDate: dFrom,
                ToDate: dTo,
                ActualPkgSite: sActualPkgSite

            }

            console.log("PayLoad : ", oPayLoad);

            const data = [
                {
                    "prId": "7957",
                    "prStatus": "Closed - Done",
                    "markets": "Algeria",
                    "globalSpcCodes": "500500212",
                    "productGroups": "",
                    "strengths": "0.0005 mg",
                    "packSizes": "test",
                    "artworkComponentImpacted": "Bollini",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": null,
                    "newAffiliateCode": "200",
                    "implementationDeadline": null,
                    "implementationTargetDate": "2025-10-31",
                    "changeDescription": "ArtApproved",
                    "dateClosed": "2025-11-23T20:11:00"
                },
                {
                    "prId": "7958",
                    "prStatus": "Closed - Done",
                    "markets": "Algeria",
                    "globalSpcCodes": "2000,4045,656788",
                    "productGroups": "Halofantrine Hydrochloride,Saccharomyces boulardii,Xylometazoline Hydrochloride",
                    "strengths": "0.00025 mg,1 mg / 0.5 mL,6 mg",
                    "packSizes": "100,test",
                    "artworkComponentImpacted": "Bag/Sachet",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "1015",
                    "newAffiliateCode": "100200",
                    "implementationDeadline": null,
                    "implementationTargetDate": "2025-10-16",
                    "changeDescription": "test",
                    "dateClosed": "2025-11-23T20:11:00"
                },
                {
                    "prId": "7959",
                    "prStatus": "Closed - Done",
                    "markets": "Albania",
                    "globalSpcCodes": "500500111",
                    "productGroups": "",
                    "strengths": "0.0005 mg",
                    "packSizes": "test",
                    "artworkComponentImpacted": "Bag/Sachet",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "200",
                    "newAffiliateCode": "1002020",
                    "implementationDeadline": "2025-11-03",
                    "implementationTargetDate": "2025-10-31",
                    "changeDescription": "ArtExpire Release date",
                    "dateClosed": "2025-11-23T20:16:00"
                },
                {
                    "prId": "9584",
                    "prStatus": "Closed - Done",
                    "markets": "Angola",
                    "globalSpcCodes": "",
                    "productGroups": "Dutasteride",
                    "strengths": "(0.5 mg / 3 mg) / 3 ml",
                    "packSizes": "545",
                    "artworkComponentImpacted": "Bag/Sachet",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "7008009",
                    "newAffiliateCode": "565756",
                    "implementationDeadline": null,
                    "implementationTargetDate": null,
                    "changeDescription": "Change Description01",
                    "dateClosed": "2025-10-29T18:26:00"
                },
                {
                    "prId": "9948",
                    "prStatus": "Closed - Done",
                    "markets": "Algeria",
                    "globalSpcCodes": "",
                    "productGroups": "",
                    "strengths": "(0.5 mg / 2.5 mg) / 2.5 ml",
                    "packSizes": "556",
                    "artworkComponentImpacted": "Bag/Sachet",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "454456",
                    "newAffiliateCode": "7878",
                    "implementationDeadline": null,
                    "implementationTargetDate": null,
                    "changeDescription": "Test",
                    "dateClosed": "2025-11-23T20:28:00"
                },
                {
                    "prId": "9975",
                    "prStatus": "Closed - Done",
                    "markets": "Angola",
                    "globalSpcCodes": "6556",
                    "productGroups": "",
                    "strengths": "(0.5 mg / 3 mg) / 3 ml",
                    "packSizes": "5565",
                    "artworkComponentImpacted": "Bag/Sachet",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "756575",
                    "newAffiliateCode": "66756576",
                    "implementationDeadline": null,
                    "implementationTargetDate": "2025-11-07",
                    "changeDescription": "Test",
                    "dateClosed": "2025-11-13T06:35:00"
                },
                {
                    "prId": "10020",
                    "prStatus": "Closed - Done",
                    "markets": "Algeria",
                    "globalSpcCodes": "43",
                    "productGroups": "",
                    "strengths": "(0.5 mg / 3 mg) / 3 ml",
                    "packSizes": "32",
                    "artworkComponentImpacted": "Carton",
                    "actualPackagingSite": "3M Drug Delivery Systems Division (Northridge - US)",
                    "newPackingSiteCode": "4332@$%!",
                    "newAffiliateCode": "54321",
                    "implementationDeadline": "2025-11-07",
                    "implementationTargetDate": "2025-11-30",
                    "changeDescription": "Testing",
                    "dateClosed": "2025-11-26T12:13:00"
                }
            ]

            this._filteredData.aCMSClose = data;
            this.getView().getModel("JSONModel").setProperty("/aCMSClose", data); ////////sku------------------------------------------------------------------------------------------>

            console.log("closed-------------------------->", data);


        },

        _LoadCMSWIPData: function () {
            var oDateRange = this.byId("CMSWIPDataRangeId");
            var dFrom = oDateRange?.getDateValue ? oDateRange.getDateValue() : null;
            var dTo = oDateRange?.getSecondDateValue ? oDateRange.getSecondDateValue() : null;
         //   console.log("From Data : " + dFrom + " ToDate : " + dTo);

            const sActualPkgSite = this.byId("SKUPkgSiteId").getValue();
         //   console.log("Selected Value :", sActualPkgSite);


            this.byId("dynamicFiltersCMSWIP").setVisible(true);
            //   this.byId("idCMSWIPPanel").setVisible(true);

            const oPayLoad = {
                FromDate: dFrom,
                ToDate: dTo,
                ActualPkgSite: sActualPkgSite
            }

            console.log("PayLoad : ", oPayLoad);

            const data = [
                {
                    "prId": "7864",
                    "prStatus": "Pending Site Information",
                    "markets": "Albania",
                    "globalSpcCodes": "G30",
                    "productGroups": "(Anhydroxylitol / Xylitol / Xylitylglucoside) / Mentha Piperita Extract",
                    "strengths": "2 % / 1 %",
                    "packSizes": "1",
                    "artworkComponentImpacted": "Bollini",
                    "actualPackagingSite": "ABT Argentina (AR)",
                    "newPackingSiteCode": "7864_NPSC",
                    "newAffiliateCode": "7864_NAC",
                    "implementationDeadline": "2025-11-07",
                    "implementationTargetDate": "2025-09-17",
                    "changeDescription": "TEST"
                },
                {
                    "prId": "7921",
                    "prStatus": "Artwork Review Pending",
                    "markets": "Brazil, Mexico",
                    "globalSpcCodes": "G15 / G32",
                    "productGroups": "Acetylcysteine / Sodium Benzoate",
                    "strengths": "600 mg",
                    "packSizes": "10 / 20",
                    "artworkComponentImpacted": "Leaflet",
                    "actualPackagingSite": "ABB India (IN)",
                    "newPackingSiteCode": "7921_NPSC",
                    "newAffiliateCode": "7921_NAC",
                    "implementationDeadline": "2025-12-15",
                    "implementationTargetDate": "2025-11-20",
                    "changeDescription": "QR update + Layout change"
                },
                {
                    "prId": "8045",
                    "prStatus": "Approved",
                    "markets": "UK, France",
                    "globalSpcCodes": "G05",
                    "productGroups": "Ibuprofen",
                    "strengths": "200 mg",
                    "packSizes": "24 / 48",
                    "artworkComponentImpacted": "Carton",
                    "actualPackagingSite": "ABC Pharma (UK)",
                    "newPackingSiteCode": "8045_NPSC",
                    "newAffiliateCode": "8045_NAC",
                    "implementationDeadline": "2025-08-10",
                    "implementationTargetDate": "2025-07-25",
                    "changeDescription": "New market extension"
                },
                {
                    "prId": "8199",
                    "prStatus": "Data Collection",
                    "markets": "Germany",
                    "globalSpcCodes": "G45",
                    "productGroups": "Folic Acid",
                    "strengths": "5 mg",
                    "packSizes": "30",
                    "artworkComponentImpacted": "Label",
                    "actualPackagingSite": "ABT Spain (ES)",
                    "newPackingSiteCode": "8199_NPSC",
                    "newAffiliateCode": "8199_NAC",
                    "implementationDeadline": "2026-01-20",
                    "implementationTargetDate": "2025-12-30",
                    "changeDescription": "Regulatory update"
                }
            ]
           this._filteredData.aCMSWip = data;
            this.getView().getModel("JSONModel").setProperty("/aCMSWip", data)    //// sku--------------------------------------------------------------------------------->


        },

        _LoadSKUComponentData: function () {

            const sPkgSite = this.byId("SKUPkgSiteId").getValue();
         //   console.log("Selected Pkg site :", sPkgSite);

            const oRBGroup = this.byId("SKURadioButtonId");
            const iIndex = oRBGroup.getSelectedIndex();

            let sSelectedButton = "";
            if (iIndex !== -1) {
                sSelectedButton = oRBGroup.getButtons()[iIndex].getText();
            }

          //  console.log("Selected Text:", sSelectedButton);


            const oPayLoad = {
                PkgSite: sPkgSite,
                Selected_Site: sSelectedButton
            }

            console.log("Payload : ", oPayLoad);

        
            var data = [

                {

                    "prID": "1381",

                    "actual_packaging_site": "Mylan Technologies Inc (St Albans VT - US)",

                    "actual_release_site": "AAI Pharma (Charleston, SC - US)",

                    "gtin": null,

                    "global_spc_code": "400522201",

                    "ma_number": "534535",

                    "implementation_target_date": "2025-11-27",

                    "market_implementation_def": "Packaging Date",

                    "pack_type_size": "1",

                    "packing_site_sku": null,

                    "pharmaceutical_form": "Aerosol",

                    "product_description": "Abacavir (Alt Salt) / Lamivudine",

                    "product_strength": "600 mg / 300 mg",

                    "registered_name": "Abacavir + Lamivudina Mylan",

                    "affiliate_code": "90019001",

                    "comment": null,

                    "component_change_description": "Test Description",

                    "component_introduction": "New",

                    "component_introduction_other": null,

                    "component_status": "Approved",

                    "component_type_other": null,

                    "component_type": "Bag/Sachet",

                    "current_artwork_pr_state": null,

                    "date_of_artwork_pr_closure": null,

                    "ha_approval_date": null,

                    "implementation_deadline": null,

                    "packing_deadline": null,

                    "packing_site_code": "2002001",

                    "qp_release_deadline": null,

                    "related_task_pr": null

                },

                {

                    "prID": "1381",

                    "actual_packaging_site": "Mylan Technologies Inc (St Albans VT - US)",

                    "actual_release_site": "AAI Pharma (Charleston, SC - US)",

                    "gtin": null,

                    "global_spc_code": "400522201",

                    "ma_number": "534535",

                    "market_implementation_def": "Packaging Date",

                    "pack_type_size": "1",

                    "packing_site_sku": null,

                    "pharmaceutical_form": "Aerosol",

                    "product_description": "Abacavir (Alt Salt) / Lamivudine",

                    "product_strength": "600 mg / 300 mg",

                    "registered_name": "Abacavir + Lamivudina Mylan",

                    "affiliate_code": "25354534",

                    "comment": "Test comments",

                    "component_change_description": "Test",

                    "component_introduction": "Use Immediately",

                    "component_introduction_other": "Test",

                    "component_status": "Approved",

                    "component_type_other": null,

                    "component_type": "Bag/Sachet",

                    "current_artwork_pr_state": "Coordinator Rejection Assessment",

                    "date_of_artwork_pr_closure": null,

                    "ha_approval_date": "2025-11-28",

                    "implementation_target_date": "2025-11-27",


                    "implementation_deadline": "2025-11-05",

                    "packing_deadline": "2025-11-28",

                    "packing_site_code": "4004001",

                    "qp_release_deadline": "2025-11-28",

                    "related_task_pr": "7575"

                },

                {

                    "prID": "1435",

                    "actual_packaging_site": "Mylan Technologies Inc (St Albans VT - US)",

                    "actual_release_site": "Mylan Laboratories Ltd. (HSF) (Tamilnadu - IN)",

                    "gtin": "8904093809866",

                    "global_spc_code": "400522202",

                    "ma_number": "5365366456",

                    "market_implementation_def": "Packaging Date",

                    "pack_type_size": "1 Autotest",

                    "packing_site_sku": "test3",

                    "pharmaceutical_form": "Capsules Hard",

                    "product_description": "Abacavir (Alt Salt)",

                    "product_strength": "300 mg",

                    "registered_name": "Abacavir Viatris 300 mg comprime",

                    "affiliate_code": "200980",

                    "comment": "test1",

                    "component_change_description": "test",

                    "component_introduction": "New",

                    "component_introduction_other": "data",

                    "component_status": "Approved",

                    "component_type_other": "Bollini",

                    "component_type": "Bag/Sachet",

                    "current_artwork_pr_state": "Opened",

                    "date_of_artwork_pr_closure": "2025-11-30",

                    "ha_approval_date": "2025-11-19",

                    "implementation_target_date": "2025-11-27",

                    "implementation_deadline": "2025-12-10",

                    "packing_deadline": "2025-11-24",

                    "packing_site_code": "100200",

                    "qp_release_deadline": "2025-11-10",

                    "related_task_pr": "1381"

                },

                {

                    "prID": "1435",

                    "actual_packaging_site": "Mylan Technologies Inc (St Albans VT - US)",

                    "actual_release_site": "Mylan Laboratories Ltd. (HSF) (Tamilnadu - IN)",

                    "gtin": "8904093809866",

                    "global_spc_code": "400522202",

                    "ma_number": "5365366456",

                    "market_implementation_def": "Packaging Date",

                    "pack_type_size": "1 Autotest",

                    "packing_site_sku": "test3",

                    "pharmaceutical_form": "Capsules Hard",

                    "product_description": "Abacavir (Alt Salt)",

                    "product_strength": "300 mg",

                    "registered_name": "Abacavir Viatris 300 mg comprime",

                    "affiliate_code": "200981",

                    "comment": "test1",

                    "component_change_description": "test today",

                    "component_introduction": "Use Immediately",

                    "component_introduction_other": "data 1",

                    "component_status": "Approved",

                    "component_type_other": "Bollini",

                    "component_type": "Booklet",

                    "current_artwork_pr_state": "Coordinator Rejection Assessment",

                    "date_of_artwork_pr_closure": "2025-11-30",

                    "ha_approval_date": "2025-12-01",

                    "implementation_target_date": "2025-11-27",

                    "implementation_deadline": "2025-12-10",

                    "packing_deadline": "2025-12-11",

                    "packing_site_code": "100201",

                    "qp_release_deadline": "2025-12-01",

                    "related_task_pr": "1384"

                }
            ]

              this._filteredData.aSKUData = data;
            this.getView().getModel("JSONModel").setProperty("/aSKUData", data);////sku--------------------------------------------------------------------------------------->
             this.byId("SKUTabFilterBox").setVisible(true);
            this.byId("tableContainer").setVisible(true);


        },



        _loadSummary: async function (sUrl) {
            try {
             //   console.log("sURL ::" + sUrl);
                const oResponse = await $.ajax({
                    url: sUrl,
                    method: "GET",
                    contentType: "application/json"
                });

                var aSummary = oResponse.value || [];

                var aColumnOrder = [
                    "batchNo",
                    "compCode",
                    "releaseDate",
                    "packingDate",
                    "createdAt",
                    "pkgSite",
                    "comments",
                    "createdBy"
                ];
                function formatDate(value) {
                    if (!value) return "";
                    var oDate = new Date(value);
                    if (isNaN(oDate.getTime())) return value;
                    var dd = String(oDate.getDate()).padStart(2, "0");
                    var mm = String(oDate.getMonth() + 1).padStart(2, "0");
                    var yyyy = oDate.getFullYear();
                    return dd + "/" + mm + "/" + yyyy;
                }
                var aReordered = aSummary.map(function (item) {
                    var newObj = {};
                    aColumnOrder.forEach(function (key) {
                        var val = item[key] || "";
                        if (/date|at/i.test(key)) {
                            newObj[key] = formatDate(val);
                        } else {
                            newObj[key] = val;
                        }
                    });
                    return newObj;
                });

             //   console.log("Reordered & Formatted Summary:", aReordered);

                var oModel = this.getView().getModel();
                oModel.setProperty("/summary", aReordered);
                this._filteredData.summary = aReordered;
              //  console.log("Filters Summary Data :: ", this._filteredData.summary);
                return aReordered;
            } catch (err) {
                console.error("Error loading BatchData:", err);
                this.getView().getModel().setProperty("/summary", []);
                this._filteredData.summary = [];
                return [];
            }
        },
        _loadTrackwiseReport: async function (oFrom, oTo) {
            const sServiceUrl = this.getOwnerComponent().getModel("documentServiceModel").sServiceUrl;
            const sEndpoint = sServiceUrl + "GetTrackwiseReport";
            try {
                const sFrom = oFrom.toISOString().split("T")[0];
                const sTo = oTo.toISOString().split("T")[0];
                const res = await $.ajax({
                    url: sEndpoint,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ fromDate: sFrom, toDate: sTo })
                });
                const aTrack = res.results || [];
                const aColumnOrder = [
                    "Packging Site Component Code",
                    "Batch No. of First Packaging",
                    "Date of First Packaging",
                    "Batch No. of First Release",
                    "Date of First Release",
                    "Batch No. of Last Packaging",
                    "Date of Last Packaging",
                    "Batch No. of Last Release",
                    "Date of Last Release",
                    "Packaging Site Code",
                    "Packaging Site Name"
                ];
                const formatDate = (val) => {
                    if (!val) return "";
                    const d = new Date(val);
                    if (isNaN(d)) return val;
                    const dd = String(d.getDate()).padStart(2, "0");
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const yyyy = d.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                };
                const aFormatted = aTrack.map(item => {
                    const row = {};
                    aColumnOrder.forEach(k => {
                        const v = item[k];
                        row[k] = /date/i.test(k) ? formatDate(v) : (v ?? "");
                    });
                    return row;
                });
                Object.assign(this._columnMapping, {
                    "Packging Site Component Code": "Component Code",
                    "Batch No. of First Packaging": "Batch No first used in Pkg",
                    "Date of First Packaging": "Date First Used in Packaging",
                    "Batch No. of First Release": "Batch Number first released",
                    "Date of First Release": "Date First Release to Market",
                    "Batch No. of Last Packaging": "Batch No. last used in Pkg",
                    "Date of Last Packaging": "Date Last Used in Packaging",
                    "Batch No. of Last Release": "Batch Number last released",
                    "Date of Last Release": "Date Last Release to Market",
                    "Packaging Site Code": "Packaging Site ID",
                    "Packaging Site Name": "Packaging Site Name"
                });

                this.getView().getModel().setProperty("/track", aFormatted);
                this._filteredData.track = aFormatted;
                return aFormatted;

            } catch (err) {
                console.error("Error fetching Trackwise Report:", err);
                sap.m.MessageToast.show("Failed to load Trackwise Report");
                this.getView().getModel().setProperty("/track", []);
                this._filteredData.track = [];
                return [];
            }
        },
        _loadAuditData: async function (url, auditType) {
            try {
                const resAudit = await $.ajax({
                    url: url,
                    method: "GET",
                    contentType: "application/json",
                    context: this
                });
                const aAudit = resAudit.value || [];
                let aColumnOrder = [];
                if (auditType === "batch") {
                    aColumnOrder = [
                        "batchNo",
                        "compCode",
                        "releaseDate",
                        "packingDate",
                        "createdAt",
                        "pkgSiteIDName",
                        "comments",
                        "createdBy"
                    ];
                } else if (auditType === "packaging") {
                    aColumnOrder = [
                        "changedBy",
                        "changedAt",
                        "action",
                        "fieldName",
                        "oldValue",
                        "newValue",
                    ];
                }
                const _pad = n => String(n).padStart(2, "0");
                const _toDate = v => (v instanceof Date ? v : new Date(v));
                function formatDate(v) {
                    if (!v) return "";
                    const d = _toDate(v);
                    if (isNaN(d)) return v;
                    return `${_pad(d.getDate())}/${_pad(d.getMonth() + 1)}/${d.getFullYear()}`;
                }

                function formatDateTime(v) {
                    if (!v) return "";
                    const d = _toDate(v);
                    if (isNaN(d)) return v;
                    return `${_pad(d.getDate())}/${_pad(d.getMonth() + 1)}/${d.getFullYear()} ${_pad(d.getHours())}:${_pad(d.getMinutes())}`;
                }


                const aReorderedAudit = aAudit.map(item => {
                    const out = {};
                    aColumnOrder.forEach(key => {
                        let val;

                        if (key === "pkgSiteIDName") {
                            val = item.pkgSiteIDName || "";
                        }
                        else if (/at$/i.test(key)) {
                            val = formatDateTime(item[key]);
                        }
                        else if (/date/i.test(key) || key === "createdAt") {
                            val = formatDate(item[key]);
                        }
                        else {
                            val = item[key] ?? "";
                        }
                        out[key] = val;
                    });
                    return out;
                });

                this.getView().getModel().setProperty("/audit", aReorderedAudit);
                this._filteredData.audit = aReorderedAudit;

             //   console.log("Audit Data (Formatted):", aReorderedAudit);
                return aReorderedAudit;

            } catch (err) {
                console.error("Error loading Audit Data:", err);
                this._filteredData.audit = [];
                return [];
            }
        },
        _loadActivityData: async function (aPkgSites, aCreatedBys, sFrom, sTo) {
            try {
                function formatDateForUI(value) {
                    if (!value) return "";
                    var oDate = new Date(value);
                    if (isNaN(oDate.getTime())) return value;
                    var dd = String(oDate.getDate()).padStart(2, "0");
                    var mm = String(oDate.getMonth() + 1).padStart(2, "0");
                    var yyyy = oDate.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                }
                const payload = {
                    pkgSites: aPkgSites || [],
                    createdBys: aCreatedBys || []
                };

             //   console.log("Activity Report Payload:", payload);
                const resActivity = await $.ajax({
                    url: "/odata/v4/document/activityReport",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    context: this
                });
                var aActivity = resActivity.value || resActivity;
                var aFormattedActivity = aActivity.map(function (item) {
                    var newObj = { ...item };
                    ["lastActivityDate", "todayDate"].forEach(function (field) {
                        if (newObj[field]) {
                            newObj[field] = formatDateForUI(newObj[field]);
                        }
                    });
                    return newObj;
                });

                this._filteredData.activity = aFormattedActivity;

             //   console.log("Activity Data (Formatted):", aFormattedActivity);
                return aFormattedActivity;

            } catch (err) {
                console.error("Error loading Activity Data:", err);
                this._filteredData.activity = [];
                return [];
            }
        },

        // Helps to filter the audit packaging site
        onAuditPackagingFilter: function () {
            const aBase = (this._filteredData && this._filteredData.audit) || [];
            const sChangedBy = (this.byId("packChangedBy")?.getValue() || "").toLowerCase().trim();
            const sAction = (this.byId("packAction")?.getValue() || "").toLowerCase().trim();
            const sField = (this.byId("packFieldName")?.getValue() || "").toLowerCase().trim();
            const sOldVal = (this.byId("packOldValue")?.getValue() || "").toLowerCase().trim();
            const sNewVal = (this.byId("packNewValue")?.getValue() || "").toLowerCase().trim();
            const oDR = this.byId("packChangedAtRange");
            const dStart = oDR?.getDateValue();
            const dEnd = oDR?.getSecondDateValue();

            const parseDDMMYYYY = (s) => {
                if (!s) return null;
                if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
                if (typeof s === "string") {
                    const p = s.split("/");
                    if (p.length === 3) return new Date(+p[2], +p[1] - 1, +p[0]);
                }
                const d = new Date(s);
                return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
            };

            const aFiltered = aBase.filter(o => {
                let ok = true;
                if (sChangedBy && !(o.changedBy || "").toLowerCase().includes(sChangedBy)) ok = false;
                if (sAction && !(o.action || "").toLowerCase().includes(sAction)) ok = false;
                if (sField && !(o.fieldName || "").toLowerCase().includes(sField)) ok = false;
                if (sOldVal && !(o.oldValue || "").toLowerCase().includes(sOldVal)) ok = false;
                if (sNewVal && !(o.newValue || "").toLowerCase().includes(sNewVal)) ok = false;

                if (ok && dStart && dEnd) {
                    const dVal = parseDDMMYYYY(o.changedAt); // table shows dd/MM/yyyy
                    if (!dVal || dVal < dStart || dVal > dEnd) ok = false;
                }
                return ok;
            });

            this._createTable("audit", aFiltered);
        },

        // Helps to reset the audit packaging site
        onAuditPackagingFilterReset: function () {
            ["packChangedBy", "packAction", "packFieldName", "packOldValue", "packNewValue"]
                .forEach(id => { const c = this.byId(id); c && c.setValue(""); });

            const dr = this.byId("packChangedAtRange");
            if (dr) { dr.setDateValue(null); dr.setSecondDateValue(null); }

            const aSource = (this._filteredData && this._filteredData.audit) || [];
            this._createTable("audit", aSource);
        },

        // Helps to reset the filters 
        onFilterReset: function () {
            const oPkgMultiInput = this.byId("packagingsiteInput");
            if (oPkgMultiInput) {
                oPkgMultiInput.removeAllTokens();
                oPkgMultiInput.setValue("");
            }

            const oFrom = this.byId("fromDate");
            const oTo = this.byId("toDate");
            oFrom && oFrom.setValue("");
            oTo && oTo.setValue("");

            const oTableContainer = this.byId("tableContainer");
            oTableContainer && oTableContainer.setVisible(false);

            const oSummaryFB = this.byId("summaryFilterBar");
            const oTrackFB = this.byId("trackFilterBar");
            const oAuditFB = this.byId("auditFilterBar");
            const oActivityFB = this.byId("activityFilterBar");
            oSummaryFB && oSummaryFB.setVisible(false);
            oTrackFB && oTrackFB.setVisible(false);
            oAuditFB && oAuditFB.setVisible(false);
            oActivityFB && oActivityFB.setVisible(false);

            const oFilterBatchNo = this.byId("filterBatchNo");
            oFilterBatchNo && oFilterBatchNo.setValue("");

            const oPkgReportMI = this.byId("packagingsite");
            if (oPkgReportMI) {
                oPkgReportMI.removeAllTokens();
                oPkgReportMI.setValue("");
            }

            const oChangedByBox = this.byId("changedByBox");
            oChangedByBox && oChangedByBox.setValue("");

            const oFilterSite = this.byId("filterSite");
            oFilterSite && oFilterSite.setValue("");

            const oFilterCreatedBy = this.byId("filterCreatedBy");
            oFilterCreatedBy && oFilterCreatedBy.setValue("");

            const oCreatedByBox = this.byId("createdByBox");
            oCreatedByBox && oCreatedByBox.setValue("");

            const oInactiveUser = this.byId("InactiveUser");
            oInactiveUser && oInactiveUser.setValue("");

            const oUsersPacks = this.byId("userspacks");
            oUsersPacks && oUsersPacks.setValue("");

            const oInactiveTable = this.byId("inactiveUsersTable");
            if (oInactiveTable) {
                const oBinding = oInactiveTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter([]);
                }
            }

            if (this.byId("trackComponent")) { this.byId("trackComponent").setValue(""); }
            if (this.byId("trackBatchFirst")) { this.byId("trackBatchFirst").setValue(""); }
            if (this.byId("trackDateFirst")) { this.byId("trackDateFirst").setValue(""); }
            if (this.byId("trackBatchRelease")) { this.byId("trackBatchRelease").setValue(""); }
            if (this.byId("auditUser")) { this.byId("auditUser").setValue(""); }
            if (this.byId("auditAction")) { this.byId("auditAction").setValue(""); }
            if (this.byId("auditDate")) { this.byId("auditDate").setValue(""); }
            if (this.byId("auditSite")) { this.byId("auditSite").setValue(""); }
            if (this.byId("activitySite")) { this.byId("activitySite").setValue(""); }
            if (this.byId("activityDetail")) { this.byId("activityDetail").setValue(""); }
            if (this.byId("activityCreatedBy")) { this.byId("activityCreatedBy").setValue(""); }
            if (this.byId("activityCreatedDate")) { this.byId("activityCreatedDate").setValue(""); }

            this._filteredData = null;

            // this._currentKey = null;

            if (this._oValueHelpDialog) {
                const oList = sap.ui.getCore().byId("packingSiteList");
                if (oList) {
                    oList.removeSelections(true);
                }
            }


            this._selectedPackingSites = [];

            this.byId("CMSWIPDataRangeId").setValue("");
            this.byId("SKUPkgSiteId").setValue("");
            this.byId("dynamicFiltersCMSClosed").setVisible(false);

            this.byId("CMSWIPDataRangeId").setValue("");
            this.byId("SKUPkgSiteId").setValue("");
            this.byId("dynamicFiltersCMSWIP").setVisible(false);

            this.byId("SKUPkgSiteId").setValue("");
            this.byId("SKURadioButtonId").setSelectedIndex(-1);
            this.byId("SKUTabFilterBox").setVisible(false);

            // const sCurrentSelectedKey= this._currentKey;
            // if(sCurrentSelectedKey==="SKUComponent"){

            // }
        },


        // Helps to select on icons and also apply visibility 
        onIconTabSelect: async function (oEvent) {
            var sKey = oEvent.getParameter("key");
            console.log("selected key  : ", sKey);
            this._currentKey = sKey;
            var oMI = this.byId("packagingsiteInput");
            if (oMI) {
                oMI.removeAllTokens();
                oMI.setValue("");
            }
            var oPackingSite = this.byId("packagingsite");
            if (oPackingSite) {
                oPackingSite.removeAllTokens();
                oPackingSite.setValue("");
            }
            var oJSON = this.getView().getModel("JSONModel");
            if (oJSON) {
                oJSON.setProperty("/selectedPackingSites", []);
                oJSON.setProperty("/selectedPackingReport", []);
            }
            //====================================================================
            this.byId("SKUFilterBoxId").setVisible(false);
            this.byId("fromToDateBoxId").setVisible(false);
            this.byId("auditToggleBox").setVisible(true);
            this.byId("filterBar").setVisible(true);
            this.byId("InactiveUserTableBox").setVisible(true);
            this.byId("cardsRow").setVisible(true);
            this.byId("SKUTabFilterBox").setVisible(false);
            this.byId("dynamicFiltersCMSWIP").setVisible(false);
            this.byId("dynamicFiltersCMSClosed").setVisible(false);
            this.byId("SKUTabFilterBox").setVisible(false);
            this.byId("dynamicFiltersCMSWIP").setVisible(false);
            this.byId("dynamicFiltersCMSClosed").setVisible(false);
            //=====================================================================================

            this.byId("summaryFilterBar").setVisible(false);
            this.byId("trackFilterBar").setVisible(false);
            this.byId("auditFilterBar").setVisible(false);
            this.byId("activityFilterBar").setVisible(false);
            this.byId("auditPackagingFilterBar").setVisible(false);


            var oModel = this.getView().getModel();
            var aData = [];

            if (sKey === "summary") {
                 this.byId("fromToDateBoxId").setVisible(true);
                this.byId("summaryFilterBar").setVisible(false);
                aData = (this._filteredData && this._filteredData.summary)
                    ? this._filteredData.summary
                    : (oModel.getProperty("/summary") || []);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("packagingsiteInput").setVisible(true);

                this.byId("toDateinput").setVisible(true);
                this.byId("fromDateInput").setVisible(true);
                this.byId("goButton").setVisible(true);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("InactiveUserBox").setVisible(false);
                this.byId("InactiveUserSegmentButton").setVisible(false);
                this.byId("tableContainer").setVisible(false);

                this.byId("packagingSiteBox").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("auditToggleSelect").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("UserInactiveSiteBox").setVisible(false);

            } else if (sKey === "track") {
                this.byId("fromToDateBoxId").setVisible(true);

                aData = (this._filteredData && this._filteredData.track)
                    ? this._filteredData.track
                    : (oModel.getProperty("/track") || []);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");

                this.byId("trackFilterBar").setVisible(false);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("tableContainer").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("auditToggleSelect").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("InactiveUserBox").setVisible(false);
                this.byId("InactiveUserSegmentButton").setVisible(false);

                this.byId("toDateinput").setVisible(true);
                this.byId("fromDateInput").setVisible(true);
                this.byId("goButton").setVisible(true);
                this.byId("UserInactiveSiteBox").setVisible(false);


            } else if (sKey === "audit") {
                this.byId("fromToDateBoxId").setVisible(true);

                this.byId("auditFilterBar").setVisible(false);
                this.byId("packagingsiteInput").setVisible(false);
                aData = (this._filteredData && this._filteredData.audit)
                    ? this._filteredData.audit
                    : (oModel.getProperty("/audit") || []);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");

                this.byId("changedByBox").setValue("");
                this.byId("tableContainer").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.getView().byId("auditToggleSelect").setSelectedKey("batch");
                this.byId("InactiveUserBox").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("InactiveUserSegmentButton").setVisible(false);

                this.byId("toDateinput").setVisible(true);
                this.byId("fromDateInput").setVisible(true);
                // this.byId("packagingSiteBox").setVisible(false);
                this.byId("changedByInput").setVisible(true);
                this.byId("auditToggleSelect").setVisible(true);
                this.byId("goButton").setVisible(true);
                this.byId("UserInactiveSiteBox").setVisible(false);
                this.byId("packagingSiteBox").setVisible(true);


            } else if (sKey === "activity") {
                this.byId("fromToDateBoxId").setVisible(true);

                this.byId("activityFilterBar").setVisible(false);
                aData = (this._filteredData && this._filteredData.activity)
                    ? this._filteredData.activity
                    : (oModel.getProperty("/activity") || []);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("createdByBox").setValue("");
                this.byId("tableContainer").setVisible(false);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("auditToggleSelect").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("InactiveUserBox").setVisible(false);
                this.byId("InactiveUserSegmentButton").setVisible(false);


                this.byId("toDateinput").setVisible(true);
                this.byId("fromDateInput").setVisible(true);
                this.byId("packagingSiteBox").setVisible(true);
                this.byId("goButton").setVisible(true);
                this.byId("createdByInput").setVisible(true);
                this.byId("UserInactiveSiteBox").setVisible(false);

            }
            else if (sKey === "InactiveUsers") {
                this.byId("fromToDateBoxId").setVisible(true);

              //  console.log("Heyy Inactive Users");

                this.byId("activityFilterBar").setVisible(false);

                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("createdByBox").setValue("");

                this.byId("toDateinput").setVisible(false);
                this.byId("fromDateInput").setVisible(false);
                this.byId("tableContainer").setVisible(false);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("auditToggleSelect").setVisible(false);
                this.byId("changedByInput").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("goButton").setVisible(false);

                this.byId("InactiveUserTableBox").setVisible(true);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("UserInactiveSiteBox").setVisible(true);
                this.byId("InactiveUserBox").setVisible(true);
                this.byId("InactiveUserSegmentButton").setVisible(true);
                if (!this._inactiveLoaded) {
                    this._loadInactiveUsers();
                }

            }
            //======================================================================================================

            else if (sKey === "SKUComponent") {
                this.byId("filterBar").setVisible(true);
                this.byId("SKUFilterBoxId").setVisible(true);
                this.byId("goButton").setVisible(true);

             //   this.byId("fromToDateBoxId").setVisible(false);
                this.byId("DateRangeBoxId").setVisible(false);
                this.byId("SKURadioButtonBoxId").setVisible(true);

                this.byId("auditToggleBox").setVisible(false);
                this.byId("InactiveUserToggleBox").setVisible(false);
             //   this.byId("filterBar").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("summaryFilterBar").setVisible(false);
                this.byId("trackFilterBar").setVisible(false);
                this.byId("auditFilterBar").setVisible(false);
                this.byId("activityFilterBar").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);
                this.byId("tableContainer").setVisible(false);

            }

            else if (sKey === "CMSWIP") {
                 this.byId("filterBar").setVisible(true);
                    this.byId("SKUFilterBoxId").setVisible(true);
                this.byId("fromToDateBoxId").setVisible(false);
                this.byId("SKURadioButtonBoxId").setVisible(false);
                this.byId("DateRangeBoxId").setVisible(true);
                 this.byId("goButton").setVisible(true);

                this.byId("auditToggleBox").setVisible(false);
                this.byId("InactiveUserToggleBox").setVisible(false);
              //  this.byId("filterBar").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("summaryFilterBar").setVisible(false);
                this.byId("trackFilterBar").setVisible(false);
                this.byId("auditFilterBar").setVisible(false);
                this.byId("activityFilterBar").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);
                this.byId("tableContainer").setVisible(false);
            }

            else if (sKey === "CMSClosed") {
                this.byId("filterBar").setVisible(true);
                   this.byId("SKUFilterBoxId").setVisible(true);
                this.byId("fromToDateBoxId").setVisible(false);
                this.byId("SKURadioButtonBoxId").setVisible(false);
                this.byId("DateRangeBoxId").setVisible(true);
                 this.byId("goButton").setVisible(true);
                this.byId("auditToggleBox").setVisible(false);
                this.byId("InactiveUserToggleBox").setVisible(false);
            //    this.byId("filterBar").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("InactiveUserTableBox").setVisible(false);
                this.byId("summaryFilterBar").setVisible(false);
                this.byId("trackFilterBar").setVisible(false);
                this.byId("auditFilterBar").setVisible(false);
                this.byId("activityFilterBar").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);
                this.byId("tableContainer").setVisible(false);
            }

            //========================================================================================================
            this._createTable(sKey, aData);
        },



        // Helps to Inactive users segment to be changed
        onInactiveUserSegmentChange: function (oEvent) {
            const key = oEvent.getParameter("key") ||
                this.byId("InactiveUserSegmentButton").getSelectedKey();

            const oJSON = this.getView().getModel("JSONModel");
            const data = key === "cmo"
                ? (oJSON.getProperty("/inactiveUsersCMO") || [])
                : (oJSON.getProperty("/inactiveUsersViatris") || []);

            oJSON.setProperty("/inactiveUsers", data);
            const inp = this.byId("InactiveUser");
            if (inp) inp.setValue("");
            const tbl = this.byId("inactiveUsersTable");
            const b = tbl && tbl.getBinding("items");
            b && b.filter([]);
        },

        // Helps to Inactive users filters
        onInactiveUserFilterByUserId: function () {
            const oTable = this.byId("inactiveUsersTable");
            const oBinding = oTable && oTable.getBinding("items");
            if (!oBinding) return;
            const sUser = (this.byId("InactiveUser").getValue() || "")
                .trim()
                .toLowerCase();

            const sSite = (this.byId("userspacks").getValue() || "")
                .trim()
                .toLowerCase();
            if (!sUser && !sSite) {
                oBinding.filter([]);
                return;
            }

            const F = sap.ui.model.Filter;
            const FO = sap.ui.model.FilterOperator;
            const aFilters = [];
            if (sUser) {
                aFilters.push(new F("userId", FO.Contains, sUser));
            }
            if (sSite) {
                aFilters.push(new F("packagingSites", FO.Contains, sSite));
            }
            oBinding.filter(aFilters);
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        _createTable: function (sKey, aData) {
            var that = this;

        //    console.log("sTitle: ",sKey);
        //    console.log("Created Table Data : ", aData);

            var sTitle = this._reportTitles[sKey] || (sKey.toUpperCase() + " Data");

            var oTable = new sap.ui.table.Table({
                title: new sap.m.Toolbar({
                    content: [
                        new sap.m.Title({ text: sTitle, level: "H3" }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({
                            text: "Download",
                            icon: "sap-icon://download",
                            type: "Ghost",
                            press: function (oEvent) {
                                that._currentKey = sKey;
                                that.onDownloadPress(oEvent);
                            }
                        })
                    ]
                }),
                visibleRowCountMode: "Fixed",
                visibleRowCount: 8,
                minAutoRowCount: 5,
                columnHeaderVisible: true,
                selectionMode: "None",
                enableColumnReordering: true,
                width: "100%",
                rowHeight: 15
            });

            
            if (!aData || aData.length === 0) {
                oTable.addColumn(new sap.ui.table.Column({
                    label: new sap.m.Label({ text: "" }),
                    template: new sap.m.Text({ text: "—" })
                }));
                this.byId("tableContainer").removeAllItems();
                this.byId("tableContainer").addItem(oTable);
                return;
            }

           
            var aKeys = Object.keys(aData[0]);

            aKeys.forEach(function (sColKey) {

                if (that._ignoredColumns && that._ignoredColumns.includes(sColKey)) {
                    return;
                }

                var sColLabel = that._columnMapping[sColKey] || sColKey;

                var charLength = sColLabel.length;
                var pixelWidth = (charLength * 9) + 25;
                var colWidth = pixelWidth + "px";

                var oColumn = new sap.ui.table.Column({
                    label: new sap.m.Label({
                        text: sColLabel,
                        wrapping: true
                    }),
                    width: colWidth,
                    autoResizable: true,
                    sortProperty: sColKey,
                    showSortMenuEntry: true,
                    showFilterMenuEntry: false,
                    template: new sap.m.Text({
                        text: "{" + sColKey + "}",
                        wrapping: true
                    })
                });

                oTable.addColumn(oColumn);
            });

            // bind model
            var oModel = new sap.ui.model.json.JSONModel({ rows: aData });
            oTable.setModel(oModel);
            oTable.bindRows("/rows");

            this.byId("tableContainer").removeAllItems();
            oTable.addStyleClass("customDataTable");
            this.byId("tableContainer").addItem(oTable);
        }
        ,

        // Helps to download the data 
        onDownloadPress: function (oEvent) {
            var that = this;
            if (!this._currentKey) {
                sap.m.MessageToast.show("Please select a card first");
                return;
            }

            if (!this._oActionSheet) {
                this._oActionSheet = new sap.m.ActionSheet({
                    placement: sap.m.PlacementType.Top,
                    buttons: [
                        new sap.m.Button({
                            text: "Download as PDF",
                            press: function () { that._downloadFile("pdf"); }
                        }),
                        new sap.m.Button({
                            text: "Download as Excel",
                            press: function () { that._downloadFile("excel"); }
                        }),
                        new sap.m.Button({
                            text: "Download as CSV",
                            press: function () { that._downloadFile("csv"); }
                        })
                    ]
                });
            }
            this._oActionSheet.openBy(oEvent.getSource());
        },


        _getCurrentTableData: function () {
            if (!this._currentKey) return [];

            var oTable = this.byId("tableContainer").getItems()[0];
            if (!oTable) return [];

            var oBinding = oTable.getBinding("rows");
            if (!oBinding) return [];

            return oBinding.getContexts().map(function (oContext) {
                return oContext.getObject();
            });
        },


        _downloadFile: function (sType) {
            var aData = this._getCurrentTableData();
            if (!aData || aData.length === 0) {
                sap.m.MessageToast.show("No data to download");
                return;
            }
            var sTitle = this._reportTitles[this._currentKey] || (this._currentKey.toUpperCase() + " Report");

            if (sType === "csv") {
                this._exportCSV(aData, sTitle);
            } else if (sType === "excel") {
                this._exportExcel(aData, sTitle);
            } else if (sType === "pdf") {
                this._exportPDF(aData, sTitle);
            }
        },

        _exportCSV: function (aData, sTitle) {
            var that = this;
            var aCols = Object.keys(aData[0]).filter(function (key) {
                return !(that._ignoredColumns && that._ignoredColumns.includes(key));
            });

            var aHeaders = aCols.map(function (key) {
                return that._columnMapping[key] || key;
            });
            var sCsv = aHeaders.join(",") + "\n";

            aData.forEach(function (oRow) {
                var aVals = aCols.map(function (key) { return oRow[key]; });
                sCsv += aVals.join(",") + "\n";
            });

            var blob = new Blob([sCsv], { type: "text/csv;charset=utf-8;" });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = sTitle + ".csv";
            link.click();
        },


        // Helps to extract the excel 
        _exportExcel: function (aData, sTitle) {
            var that = this;
            var aCols = Object.keys(aData[0]).filter(function (key) {
                return !(that._ignoredColumns && that._ignoredColumns.includes(key));
            });

            var sExcel = '<table border="1"><tr>';
            aCols.forEach(function (col) {
                var sLabel = that._columnMapping[col] || col;
                sExcel += "<th>" + sLabel + "</th>";
            });
            sExcel += "</tr>";

            aData.forEach(function (oRow) {
                sExcel += "<tr>";
                aCols.forEach(function (key) {
                    sExcel += "<td>" + (oRow[key] || "") + "</td>";
                });
                sExcel += "</tr>";
            });
            sExcel += "</table>";

            var blob = new Blob([sExcel], { type: "application/vnd.ms-excel" });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = sTitle + ".xls";
            link.click();
        },


        _exportPDF: function (aData, sTitle) {
            var that = this;
            if (!aData || !aData.length) { return; }

            function escHtml(str) {
                if (str === null || str === undefined) return "";
                return String(str)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            }

            var aCols = Object.keys(aData[0]).filter(function (key) {
                return !(that._ignoredColumns && that._ignoredColumns.includes(key));
            });

            var sLogoPath = sap.ui.require.toUrl("project1/img/Viatrislogo.jpeg");

            var sBgPath = sap.ui.require.toUrl("project1/img/background_img_pdf.jpg");

            var sTable = "<table><thead><tr>";
            aCols.forEach(function (col) {
                var sLabel = that._columnMapping && that._columnMapping[col] ? that._columnMapping[col] : col;
                sTable += "<th" + (col === 'pkgSiteIDName' ? " style='width:230px;'" : "") + ">" + escHtml(sLabel) + "</th>";
            });
            sTable += "</tr></thead><tbody>";

            aData.forEach(function (oRow) {
                sTable += "<tr>";
                aCols.forEach(function (key) {
                    sTable += "<td" + (key === 'pkgSiteIDName' ? " style='width:230px'" : "") + ">" + escHtml(oRow[key] || "") + "</td>";
                });
                sTable += "</tr>";
            });
            sTable += "</tbody></table>";

            var sStyle = `
        <style>
            @page { size: A4 portrait; margin: 0; }
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            body {
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
                position: relative;
            }
            body::before {
                content: "";
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: url('${sBgPath}');
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                z-index: -1;
            }
            .container { width:100%; }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
            .header h3 { margin:0; font-size:20px; }
            .logo { height:60px; }
            table { width:100%; border-collapse: collapse; background: transparent;  table-layout: fixed;}
           thead th {
                    background-color: #444 !important;
                    color: white !important;
                    padding: 6px 8px;
                    text-align: left;
                    font-weight:bold;
                }
            th, td {
                border:1px solid #000;
                padding:6px 8px;
                background: transparent !important;
                color: #000;
                word-wrap: break-word;
                white-space: normal;
            }
            tr { page-break-inside: avoid; }
.footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;                
                width: 100%;
                font-size: 12px;
                color: #000;
                padding: 5px 10px;
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;  
                background-color: #fff;  
            }

        </style>
        `;

            var sHeaderHtml = '<div class="header">' +
                '<h3>' + escHtml(sTitle) + '</h3>' +
                '<img class="logo" src="' + sLogoPath + '" alt="Logo" style="height:100px;" />' +
                '</div>';
            var now = new Date();
            var day = String(now.getDate()).padStart(2, '0');
            var month = String(now.getMonth() + 1).padStart(2, '0');
            var year = now.getFullYear();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');

            var formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            var createdBy = "";
            try {
                createdBy = this.getView()
                    .getModel("viewState")
                    .getProperty("/sGenerateUser") || "";
            } catch (e) { }

            var sFooterHtml = `
                <div class="footer">
                    <div>${escHtml(formattedDateTime)}</div>
                   <div style="margin-right: 100px;">
      Created By: ${escHtml(createdBy || "-")}
    </div>
                </div>
            `;

            var fullHtml = "<!doctype html><html><head><meta charset='utf-8'><title>" + escHtml(sTitle) + "</title>" + sStyle + "</head><body>" +
                "<div class='container'>" + sHeaderHtml + sTable + sFooterHtml + "</div>" +
                "</body></html>";


            var iframe = document.createElement('iframe');
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            document.body.appendChild(iframe);


            iframe.contentDocument.open();
            iframe.contentDocument.write(fullHtml);
            iframe.contentDocument.close();


            setTimeout(function () {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(function () {
                    document.body.removeChild(iframe);
                }, 2000);
            }, 700);
        },


        onAddFilterPress: function (oEvent) {
            var that = this;

            if (!this._oFilterSheet) {
                var aFields = [
                    "releaseDate", "packingDate", "createdAt",
                    "comments"
                ];

                var aButtons = aFields.map(function (sField) {
                    return new sap.m.Button({
                        text: that._columnMapping[sField] || sField,
                        press: function () { that._addFilterField(sField); }
                    });
                });

                this._oFilterSheet = new sap.m.ActionSheet({
                    title: "Add Filter",
                    showCancelButton: true,
                    buttons: aButtons
                });
                this.getView().addDependent(this._oFilterSheet);
            }
            this._oFilterSheet.openBy(oEvent.getSource());
        },

        _addFilterField: function (sField) {
            this._summaryDynamicFilters = this._summaryDynamicFilters || {};

            if (this._summaryDynamicFilters[sField]) {
                sap.m.MessageToast.show((this._columnMapping[sField] || sField) + " filter already added");
                return;
            }

            var sFullId = this.getView().createId("filter" + sField);

            var oLabel = new sap.m.Label({
                text: (this._columnMapping[sField] || sField) + ":"
            }).addStyleClass("sapUiTinyMarginEnd");

            var oControl;
            var aDateFields = ["releaseDate", "packingDate", "createdAt"];

            if (aDateFields.includes(sField)) {
                oControl = new sap.m.DateRangeSelection({
                    id: sFullId,
                    width: "215px",
                    valueFormat: "yyyy-MM-dd",
                    displayFormat: "dd/MM/yyyy",
                    change: this.onSummaryFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            } else {
                oControl = new sap.m.Input({
                    id: sFullId,
                    width: "150px",
                    liveChange: this.onSummaryFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            }

            this._summaryDynamicFilters[sField] = oControl;

            var oFilterRows = this.byId("filterRows");
            var aRows = oFilterRows.getItems();
            var oLastRow = aRows[aRows.length - 1];

            if (!oLastRow || oLastRow.getItems().length >= 8) {
                oLastRow = new sap.m.HBox({
                    alignItems: "Center",
                    class: "sapUiSmallMarginBottom"
                });
                oFilterRows.addItem(oLastRow);
            }
            oLastRow.addItem(oLabel);
            oLastRow.addItem(oControl);
        },

        // Helps to apply filter on Summary 
        onSummaryFilter: function () {
            var that = this;

            var aSource = (this._filteredData && this._filteredData.summary)
                ? this._filteredData.summary
                : (this.getView().getModel() && this.getView().getModel().getData().summary) || [];


            var mFieldToControlId = {
                batchNo: "filterBatchNo",
                compCode: "filterCompCode",
                pkgSiteIDName: "filterSite",
                createdBy: "filterCreatedBy",
                comments: "filterComments",
                modifiedBy: "filterModifiedBy"
            };


            var oAllFilters = Object.assign({}, this._summaryDynamicFilters || {});
            Object.keys(mFieldToControlId).forEach(function (sField) {
                var sId = mFieldToControlId[sField];
                var oCtrl = that.byId(sId);
                if (oCtrl) {
                    oAllFilters[sField] = oCtrl;
                }
            });

            var aFiltered = aSource.filter(function (oItem) {
                var bMatch = true;

                Object.keys(oAllFilters).forEach(function (sField) {
                    var oControl = oAllFilters[sField];


                    if (oControl instanceof sap.m.DateRangeSelection) {
                        var dStart = oControl.getDateValue();
                        var dEnd = oControl.getSecondDateValue();
                        if (dStart && dEnd) {
                            var dField = that._parseDate(oItem[sField]);
                            if (!dField || dField < dStart || dField > dEnd) {
                                bMatch = false;
                            }
                        }
                    }


                    if (oControl instanceof sap.m.Input) {
                        var sVal = (oControl.getValue() || "").toLowerCase().trim();
                        if (sVal) {
                            var sFieldVal = (oItem[sField] || "").toLowerCase();
                            if (!sFieldVal.includes(sVal)) {
                                bMatch = false;
                            }
                        }
                    }
                });

                return bMatch;
            });

            this._createTable("summary", aFiltered);
        },

        // Helps to reset filter on Summary 
        onSummaryFilterReset: function () {
            var that = this;
            [
                "filterBatchNo",
                "filterCompCode",
                "filterSite",
                "filterCreatedBy",
                "filterComments",
                "filterModifiedBy"
            ].forEach(function (sId) {
                var oInput = that.byId(sId);
                if (!oInput) {
                    return;
                }

                if (oInput.setValue) {
                    oInput.setValue("");
                }
                if (oInput.setDateValue) {
                    oInput.setDateValue(null);
                }
                if (oInput.setSecondDateValue) {
                    oInput.setSecondDateValue(null);
                }
            });


            var oFilterRows = this.byId("filterRows");
            if (oFilterRows) {
                oFilterRows.destroyItems();
            }
            this._summaryDynamicFilters = {};


            var aSource = (this._filteredData && this._filteredData.summary)
                ? this._filteredData.summary
                : (this.getView().getModel() && this.getView().getModel().getData().summary) || [];

            this._createTable("summary", aSource);


            // this.onSummaryFilter();
        },



        _parseDate: function (sValue) {
            if (!sValue) return null;

            if (sValue instanceof Date) {
                return new Date(sValue.getFullYear(), sValue.getMonth(), sValue.getDate());
            }

            if (typeof sValue === "string") {

                var match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(sValue);
                if (match) {
                    var day = parseInt(match[1], 10);
                    var month = parseInt(match[2], 10) - 1;
                    var year = parseInt(match[3], 10);
                    return new Date(year, month, day);
                }
            }

            var d = new Date(sValue);
            return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
        },


        // Helps to added filter on trackwise 
        onTrackAddFilter: function (oEvent) {
            var that = this;

            if (!this._oTrackFilterSheet) {
                this._oTrackFilterSheet = new sap.m.ActionSheet({
                    title: "Add Filter",
                    showCancelButton: true,
                    buttons: [
                        new sap.m.Button({ text: "Date of First Packaging", press: function () { that._addTrackFilterField("Date of First Packaging"); } }),
                        new sap.m.Button({ text: "Date of First Release", press: function () { that._addTrackFilterField("Date of First Release"); } }),
                        new sap.m.Button({ text: "Date of Last Packaging", press: function () { that._addTrackFilterField("Date of Last Packaging"); } }),
                        new sap.m.Button({ text: "Date of Last Release", press: function () { that._addTrackFilterField("Date of Last Release"); } }),
                        new sap.m.Button({ text: "Batch No. of Last Packaging", press: function () { that._addTrackFilterField("Batch No. of Last Packaging"); } }),
                        new sap.m.Button({ text: "Batch No. of Last Release", press: function () { that._addTrackFilterField("Batch No. of Last Release"); } }),
                        new sap.m.Button({ text: "Packaging Site Code", press: function () { that._addTrackFilterField("Packaging Site Code"); } }),
                        new sap.m.Button({ text: "Packaging Site Name", press: function () { that._addTrackFilterField("Packaging Site Name"); } })
                    ]
                });
                this.getView().addDependent(this._oTrackFilterSheet);
            }

            this._oTrackFilterSheet.openBy(oEvent.getSource());
        },


        _addTrackFilterField: function (sField) {
            this._trackDynamicFilters = this._trackDynamicFilters || {};

            if (this._trackDynamicFilters[sField]) {
                sap.m.MessageToast.show(sField + " filter already added");
                return;
            }

            var sFullId = this.getView().createId("track" + sField.replace(/\s+/g, "")); // remove spaces

            var oLabel = new sap.m.Label({ text: sField + ":" })
                .addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginEnd");

            var oControl;
            var aDateFields = [
                "Date of First Packaging",
                "Date of First Release",
                "Date of Last Packaging",
                "Date of Last Release"
            ];

            if (aDateFields.includes(sField)) {
                oControl = new sap.m.DateRangeSelection({
                    id: sFullId,
                    width: "220px",
                    displayFormat: "dd/MM/yyyy",
                    valueFormat: "yyyy-MM-dd",
                    change: this.onTrackFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            } else {
                oControl = new sap.m.Input({
                    id: sFullId,
                    width: "150px",
                    liveChange: this.onTrackFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            }

            this._trackDynamicFilters[sField] = oControl;

            var oFilterRows = this.byId("trackFilterRows");
            var aRows = oFilterRows.getItems();
            var oLastRow = aRows[aRows.length - 1];

            if (!oLastRow || oLastRow.getItems().length >= 8) {
                oLastRow = new sap.m.HBox({
                    alignItems: "Center",
                    class: "sapUiSmallMarginBottom"
                });
                oFilterRows.addItem(oLastRow);
            }

            oLastRow.addItem(oLabel);
            oLastRow.addItem(oControl);
        },

        // Helps to filter on trackwise 
        onTrackFilter: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var aBaseData = (this._filteredData && this._filteredData.track)
                ? this._filteredData.track
                : oModel.getData().track;

            var aFiltered = aBaseData.filter(function (oItem) {
                var bMatch = true;


                var sComp = (that.byId("trackPackgingSiteComponentCode")?.getValue() || "").toLowerCase();
                var sBatchFirstPkg = (that.byId("trackBatchNoOfFirstPackaging")?.getValue() || "").toLowerCase();
                var sBatchFirstRelease = (that.byId("trackBatchNoOfFirstRelease")?.getValue() || "").toLowerCase();

                if (sComp && !(oItem["Packging Site Component Code"] || "").toLowerCase().includes(sComp)) bMatch = false;
                if (sBatchFirstPkg && !(oItem["Batch No. of First Packaging"] || "").toLowerCase().includes(sBatchFirstPkg)) bMatch = false;
                if (sBatchFirstRelease && !(oItem["Batch No. of First Release"] || "").toLowerCase().includes(sBatchFirstRelease)) bMatch = false;


                if (that._trackDynamicFilters) {
                    Object.keys(that._trackDynamicFilters).forEach(function (sField) {
                        var oControl = that._trackDynamicFilters[sField];
                        if (oControl) {
                            if (oControl instanceof sap.m.DateRangeSelection) {
                                var dStart = oControl.getDateValue();
                                var dEnd = oControl.getSecondDateValue();
                                if (dStart && dEnd) {
                                    var dField = that._parseDate(oItem[sField]);
                                    if (!dField || dField < dStart || dField > dEnd) {
                                        bMatch = false;
                                    }
                                }
                            } else {
                                var sVal = (oControl.getValue() || "").toLowerCase();
                                if (sVal) {
                                    var sFieldVal = (oItem[sField] || "").toLowerCase();
                                    if (!sFieldVal.includes(sVal)) {
                                        bMatch = false;
                                    }
                                }
                            }
                        }
                    });
                }

                return bMatch;
            });

            this._createTable("track", aFiltered);
        },


        onTrackFilterReset: function () {
            var that = this;


            [
                "PackgingSiteComponentCode",
                "BatchNoOfFirstPackaging",
                "BatchNoOfFirstRelease"
            ].forEach(function (sKey) {
                var oInput = that.byId("track" + sKey);
                if (oInput) {
                    if (oInput.setValue) oInput.setValue("");
                    if (oInput.setDateValue) oInput.setDateValue(null);
                    if (oInput.setSecondDateValue) oInput.setSecondDateValue(null);
                }
            });


            var oFilterRows = this.byId("trackFilterRows");
            oFilterRows.destroyItems();
            this._trackDynamicFilters = {};


            var aSource = (this._filteredData && this._filteredData.track)
                ? this._filteredData.track
                : this.getView().getModel().getData().track;

            this._createTable("track", aSource);
        },



        // This Function helps to added filters 
        onAuditAddFilter: function (oEvent) {
            var that = this;
            if (!this._oAuditFilterSheet) {
                this._oAuditFilterSheet = new sap.m.ActionSheet({
                    title: "Add Filter",
                    showCancelButton: true,
                    buttons: [
                        new sap.m.Button({ text: "Comments", press: () => that._addAuditFilterField("comments") }),
                        new sap.m.Button({ text: "Packaging Site ID - Name", press: () => that._addAuditFilterField("pkgSiteIDName") }),
                        new sap.m.Button({ text: "Packing Date", press: () => that._addAuditFilterField("packingDate", true) }),
                        new sap.m.Button({ text: "Created At", press: () => that._addAuditFilterField("createdAt", true) }),
                        new sap.m.Button({ text: "Release Date", press: () => that._addAuditFilterField("releaseDate", true) })
                    ]
                });
                this.getView().addDependent(this._oAuditFilterSheet);
            }
            this._oAuditFilterSheet.openBy(oEvent.getSource());
        },

        _addAuditFilterField: function (sField, bIsDate) {
            this._auditDynamicFilters = this._auditDynamicFilters || {};

            if (this._auditDynamicFilters[sField]) {
                sap.m.MessageToast.show(sField + " filter already added");
                return;
            }

            var sFullId = this.getView().createId("audit" + sField);

            var oLabel = new sap.m.Label({
                text: this._columnMapping[sField] + ":"
            }).addStyleClass("sapUiTinyMarginEnd");

            var oControl;
            if (bIsDate) {
                oControl = new sap.m.DateRangeSelection({
                    id: sFullId,
                    width: "220px",
                    displayFormat: "dd/MM/yyyy",
                    valueFormat: "dd/MM/yyyy",
                    change: this.onAuditFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            } else {
                oControl = new sap.m.Input({
                    id: sFullId,
                    width: "150px",
                    liveChange: this.onAuditFilter.bind(this)
                }).addStyleClass("sapUiTinyMarginEnd")
                    .data("field", sField);
            }

            this._auditDynamicFilters[sField] = oControl;

            var oFilterRows = this.byId("auditFilterRows");
            var aRows = oFilterRows.getItems();
            var oLastRow = aRows[aRows.length - 1];

            if (!oLastRow || oLastRow.getItems().length >= 8) {
                oLastRow = new sap.m.HBox({
                    alignItems: "Center",
                    class: "sapUiSmallMarginBottom"
                });
                oFilterRows.addItem(oLastRow);
            }

            oLastRow.addItem(oLabel);
            oLastRow.addItem(oControl);
        },

        // this function helps to filter the audit 
        onAuditFilter: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var aBaseData = oModel.getData().audit || [];


            var sBatchNo = (this.byId("auditBatchNo")?.getValue() || "").toLowerCase();
            var sCreatedBy = (this.byId("auditCreatedBy")?.getValue() || "").toLowerCase();

            var sCompCode = (this.byId("auditCompCode")?.getValue() || "").toLowerCase();


            var oCreatedRange = this.byId("auditCreatedDateRange");
            var dCreatedStart = oCreatedRange?.getDateValue();
            var dCreatedEnd = oCreatedRange?.getSecondDateValue();

            var oReleaseRange = this.byId("auditReleaseDateRange");
            var dReleaseStart = oReleaseRange?.getDateValue();
            var dReleaseEnd = oReleaseRange?.getSecondDateValue();

            var aFiltered = aBaseData.filter(function (oItem) {
                var bMatch = true;

                if (sBatchNo && !(oItem.batchNo || "").toLowerCase().includes(sBatchNo)) bMatch = false;
                if (sCreatedBy && !(oItem.createdBy || "").toLowerCase().includes(sCreatedBy)) bMatch = false;

                if (sCompCode && !(oItem.compCode || "").toLowerCase().includes(sCompCode)) bMatch = false;


                if (dCreatedStart && dCreatedEnd) {
                    var dVal = that._parseDate(oItem.createdDate || oItem.createdAt);
                    if (!dVal || dVal < dCreatedStart || dVal > dCreatedEnd) bMatch = false;
                }


                if (dReleaseStart && dReleaseEnd) {
                    var dVal2 = that._parseDate(oItem.releaseDate);
                    if (!dVal2 || dVal2 < dReleaseStart || dVal2 > dReleaseEnd) bMatch = false;
                }


                Object.keys(that._auditDynamicFilters || {}).forEach(function (sField) {
                    var oCtrl = that._auditDynamicFilters[sField];
                    if (oCtrl instanceof sap.m.DateRangeSelection) {
                        var dStart = oCtrl.getDateValue();
                        var dEnd = oCtrl.getSecondDateValue();
                        if (dStart && dEnd) {
                            var dField = that._parseDate(oItem[sField]);
                            if (!dField || dField < dStart || dField > dEnd) bMatch = false;
                        }
                    } else if (oCtrl instanceof sap.m.Input) {
                        var sVal = (oCtrl.getValue() || "").toLowerCase();
                        if (sVal && !(oItem[sField] || "").toLowerCase().includes(sVal)) bMatch = false;
                    }
                });

                return bMatch;
            });

            this._createTable("audit", aFiltered);
        },


        onAuditFilterReset: function () {
            ["BatchNo", "CreatedBy", "ModifiedBy", "CompCode"].forEach(k => {
                var oInput = this.byId("audit" + k);
                if (oInput) oInput.setValue("");
            });

            ["CreatedDate", "ReleaseDate"].forEach(k => {
                var oDR = this.byId("audit" + k);
                if (oDR) {
                    oDR.setDateValue(null);
                    oDR.setSecondDateValue(null);
                }
            });

            var oFilterRows = this.byId("auditFilterRows");
            oFilterRows.destroyItems();
            this._auditDynamicFilters = {};

            this._createTable("audit", this.getView().getModel().getData().audit);
        },

        // Helps to filters the data 
        onActivityFilter: function () {
            var oModel = this.getView().getModel();
            var aBaseData = (this._filteredData && this._filteredData.activity)
                ? this._filteredData.activity
                : (oModel.getData().activity || []);

            var sPkgSite = this.byId("activityPkgSite").getValue().toLowerCase();
            var sCreatedBy = this.byId("activityCreatedBy").getValue().toLowerCase();
            var iDaysFromToday = this.byId("activityDaysFromToday").getValue();

            var that = this;


            var oLastRange = this.byId("activityLastActivityDateRange");
            var dLastStart = oLastRange.getDateValue();
            var dLastEnd = oLastRange.getSecondDateValue();


            var oTodayRange = this.byId("activityTodayDateRange");
            var dTodayStart = oTodayRange.getDateValue();
            var dTodayEnd = oTodayRange.getSecondDateValue();

            var aFiltered = aBaseData.filter(function (oItem) {
                var bMatch = true;


                if (sPkgSite && !(oItem.packagingSiteID || "").toLowerCase().includes(sPkgSite)) bMatch = false;


                if (sCreatedBy && !(oItem.packagingSiteName || "").toLowerCase().includes(sCreatedBy)) bMatch = false;


                if (dLastStart && dLastEnd) {
                    var dVal = that._parseDate(oItem.lastActivityDate);
                    if (!dVal || dVal < dLastStart || dVal > dLastEnd) bMatch = false;
                }


                if (dTodayStart && dTodayEnd) {
                    var dVal = that._parseDate(oItem.todayDate);
                    if (!dVal || dVal < dTodayStart || dVal > dTodayEnd) bMatch = false;
                }


                if (iDaysFromToday) {
                    var iVal = parseInt(iDaysFromToday, 10);
                    if (!isNaN(iVal) && oItem.daysFromToday !== iVal) bMatch = false;
                }

                return bMatch;
            });

            this._createTable("activity", aFiltered);
        },

        _extract(hostname = window.location.hostname) {
            const firstLabel = hostname.split(".")[0];
            const parts = firstLabel.split("-");
            for (let k = 1; k < parts.length; k++) {
                const prefix = parts.slice(0, k).join("-");
                const next = parts.slice(k, k * 2).join("-");
                if (prefix && prefix === next) {
                    return prefix;
                }
            }
            const m = firstLabel.match(/^(.*?-(dev|prd|qa|test))\b/i);
            if (m) return m[1];
            return parts.slice(0, 4).join("-");
        },

        // Helps to reset the filters 
        onActivityFilterReset: function () {
            this.byId("activityPkgSite").setValue("");
            this.byId("activityCreatedBy").setValue("");
            this.byId("activityLastActivityDateRange").setDateValue(null);
            this.byId("activityLastActivityDateRange").setSecondDateValue(null);
            this.byId("activityTodayDateRange").setDateValue(null);
            this.byId("activityTodayDateRange").setSecondDateValue(null);
            this.byId("activityDaysFromToday").setValue("");

            this._createTable("activity", this._filteredData.activity || []);
        },

        // Helps to audit the toggle change
        onAuditToggleChange: function (oEvent) {
            var sSelectedKey = this.byId("auditToggleSelect").getSelectedKey();
            console.log("Now you are in:", sSelectedKey);
            if (sSelectedKey == "packaging") {
                this.byId("auditFilterBar").setVisible(false);
                this.byId("changedByInput").setVisible(true);
                this.byId("auditToggleSelect").setVisible(true);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("changedByBox").setValue("");
                this.byId("tableContainer").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);

            }
            else {
                this.byId("auditFilterBar").setVisible(false);
                this.byId("changedByInput").setVisible(true);
                this.byId("auditToggleSelect").setVisible(true);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("changedByBox").setValue("");
                this.byId("tableContainer").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);
                this.byId("packagingSiteBox").setVisible(true);
            }


        },
        fmt: {
            showSummary: function (flags) {
                if (!flags) return true;
                if (flags.isCMO) return true;
                if (flags.isAuditor) return false;
                return true;
            },
            showTrack: function (flags) {
                if (!flags) return true;
                if (flags.isCMO || flags.isAuditor) return false;
                return true;
            },
            showAudit: function (flags) {
                if (!flags) return false;
                if (flags.isCMO) return false;
                if (flags.isViewer) return false;
                return true;
            },
            showActivity: function (flags) {
                if (!flags) return true;
                if (flags.isCMO || flags.isAuditor) return false;
                return true;
            },
            enabled: function (readOnly) {
                return !readOnly;
            },
            auditSegbVisible: function (flags) {

                return !!(flags && (flags.isAuditor || flags.isSuper));
            }
        },

        // Helps to download the Users
        onDownloadUsers: function () {
            const oTable = this.byId("inactiveUsersTable");
            if (!oTable) {
                sap.m.MessageToast.show("Inactive users table not found.");
                return;
            }
            const oBinding = oTable.getBinding("items");
            if (!oBinding) {
                sap.m.MessageToast.show("No data bound to inactive users table.");
                return;
            }
            const iLength = oBinding.getLength();
            const aContexts = oBinding.getContexts(0, iLength) || [];
            const aData = aContexts
                .map(ctx => ctx && ctx.getObject && ctx.getObject())
                .filter(Boolean);

            if (!aData.length) {
                sap.m.MessageToast.show("No data to export.");
                return;
            }
            const segKey = this.byId("InactiveUserSegmentButton")
                ? this.byId("InactiveUserSegmentButton").getSelectedKey()
                : "cmo";

            const sFileName = segKey === "viatris"
                ? "Inactive_Viatris_Users"
                : "Inactive_CMO_Users";
            const esc = function (v) {
                if (v === null || v === undefined) return "";
                return String(v)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            };
            let sExcel = "<table border='1'><thead><tr>" +
                "<th>User ID</th>" +
                "<th>Packaging Sites</th>" +
                "</tr></thead><tbody>";

            aData.forEach(row => {
                const userId = esc(row.userId || row.USERID || "");
                const sites = esc(row.packagingSites || row.packagingSite || row.sites || "");
                sExcel += "<tr><td>" + userId + "</td><td>" + sites + "</td></tr>";
            });

            sExcel += "</tbody></table>";

            const blob = new Blob([sExcel], { type: "application/vnd.ms-excel" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = sFileName + ".xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        _applyReportTabRules: function () {
            const vs = this.getView().getModel("viewState");
            const flags = vs.getProperty("/roleFlags") || {};
            const bar = this.byId("cardsRow");
            const tabs = {};
            (bar.getItems() || []).forEach(it => tabs[it.getKey()] = it);
            Object.values(tabs).forEach(t => t.setVisible(true));
            if (flags.isCMO) {
                tabs.summary && tabs.summary.setVisible(true);
                tabs.track && tabs.track.setVisible(false);
                tabs.audit && tabs.audit.setVisible(false);
                tabs.activity && tabs.activity.setVisible(false);
                tabs.InactiveUsers && tabs.InactiveUsers.setVisible(false);
                bar.setSelectedKey("summary");
                this._currentKey = "summary";
                this.byId("auditToggleSelect").setVisible(false);
                vs.setProperty("/readOnly", false);
                return;
            }
            if (flags.isAuditor) {
                tabs.summary && tabs.summary.setVisible(false);
                tabs.track && tabs.track.setVisible(false);
                tabs.audit && tabs.audit.setVisible(true);
                tabs.activity && tabs.activity.setVisible(false);
                tabs.InactiveUsers && tabs.InactiveUsers.setVisible(true);
                bar.setSelectedKey("audit");
                this._currentKey = "audit";
                this.byId("auditToggleSelect").setVisible(true);
                vs.setProperty("/readOnly", false);
                this.byId("auditFilterBar").setVisible(false);
                this.byId("changedByInput").setVisible(true);
                this.byId("auditToggleSelect").setVisible(true);
                this.byId("packagingsiteInput").setVisible(false);
                this.byId("fromDate").setValue("");
                this.byId("toDate").setValue("");
                this.byId("changedByBox").setValue("");
                this.byId("tableContainer").setVisible(false);
                this.byId("packagingSiteBox").setVisible(false);
                this.byId("createdByInput").setVisible(false);
                this.byId("auditPackagingFilterBar").setVisible(false);
                return;
            }
            if (flags.isViewer) {
                tabs.summary && tabs.summary.setVisible(true);
                tabs.track && tabs.track.setVisible(true);
                tabs.audit && tabs.audit.setVisible(false);
                tabs.activity && tabs.activity.setVisible(true);
                tabs.InactiveUsers && tabs.InactiveUsers.setVisible(false);
                bar.setSelectedKey("summary");
                this._currentKey = "summary";
                this.byId("auditToggleSelect").setVisible(false);
                vs.setProperty("/readOnly", false);
                return;
            }
            if (flags.isSuper) {
                tabs.summary && tabs.summary.setVisible(true);
                tabs.track && tabs.track.setVisible(true);
                tabs.audit && tabs.audit.setVisible(true);
                tabs.activity && tabs.activity.setVisible(true);
                tabs.InactiveUsers && tabs.InactiveUsers.setVisible(true);
                bar.setSelectedKey("summary");
                this._currentKey = "summary";
                this.byId("auditToggleSelect").setVisible(false);
                vs.setProperty("/readOnly", false);
                return;
            }
        },



        _loadInactiveUsers: function () {
            const sDocBase = this.getOwnerComponent()
                .getModel("documentServiceModel")
                .sServiceUrl.replace(/\/?$/, "/");
            const oJSON = this.getView().getModel("JSONModel");
            const subaccount = this._extract(window.location.hostname);
            $.ajax({
                url: sDocBase + "iasinactiveuserlistcmo",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    subaccount: subaccount,
                    application: "packagingsitemaintenance"
                }),
                success: (res) => {
                    const raw = res.unmatchedUsers || res.value || res.results || res || [];
                    const data = raw.map(u => ({
                        userId: u.userId || u.USERID || "",
                        packagingSites: u.packagingSites || u.packagingSite || u.sites || ""
                    }));
                    oJSON.setProperty("/inactiveUsersCMO", data);
                    const key = this.byId("InactiveUserSegmentButton").getSelectedKey() || "cmo";
                    if (key === "cmo") {
                        oJSON.setProperty("/inactiveUsers", data);
                    }
                },
                error: (err) => {
                    sap.m.MessageToast.show("Failed to load CMO inactive users");
                    console.error("CMO inactive error", err);
                }
            });
            $.ajax({
                url: sDocBase + "iasinactiveuserlistsuperuser",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    subaccount: "viatris-mfg-bprd-dev",
                    application: "viatrisuserassignment"
                }),
                success: (res) => {
                    const raw = res.unmatchedUsers || res.value || res.results || res || [];
                    const data = raw.map(u => ({
                        userId: u.userId || u.USERID || "",
                        packagingSites: u.packagingSites || u.packagingSite || u.sites || ""
                    }));
                    oJSON.setProperty("/inactiveUsersViatris", data);

                    const key = this.byId("InactiveUserSegmentButton").getSelectedKey() || "cmo";
                    if (key === "viatris") {
                        oJSON.setProperty("/inactiveUsers", data);
                    }
                },
                error: (err) => {
                    sap.m.MessageToast.show("Failed to load Viatris inactive users");
                    console.error("Viatris inactive error", err);
                }
            });

            this._inactiveLoaded = true;
        },

        _loadSitesFromBackend: function () {
            const oView = this.getView();
            const oComp = this.getOwnerComponent();
            const oVS = oView.getModel("viewState");

            const flags = oVS.getProperty("/roleFlags") || {};
            const sUserId = (oVS.getProperty("/sGenerateUser") || "").trim();

            if (!sUserId) {
                sap.m.MessageToast.show("User ID not available.");
                return;
            }
            const escUserId = sUserId.replace(/'/g, "''");
            const sUserFilter = "userId%20eq%20'" + encodeURIComponent(escUserId) + "'";
            const oCmoModel = oComp.getModel("odata") || oComp.getModel();
            if (!oCmoModel) {
                sap.m.MessageBox.error("CMO service model not found.");
                return;
            }
            if (flags.isSuper) {

                const oDocModel = oComp.getModel("documentServiceModel");
                if (!oDocModel) {
                    sap.m.MessageBox.error("Document service model not found.");
                } else {
                    const sUrl =
                        oDocModel.sServiceUrl.replace(/\/?$/, "/") +
                        "T_PackagingSite_SUsers?$expand=pkgSites&$filter=" + sUserFilter;

                    jQuery.ajax({
                        url: sUrl,
                        method: "GET",
                        contentType: "application/json",
                        success: (data) => {
                            const aSites = [];

                            (data.value || data.results || []).forEach(u => {
                                (u.pkgSites || []).forEach(ps => {
                                    if (ps.pkgSite && ps.pkgSiteName) {
                                        aSites.push({
                                            packingSiteId: ps.pkgSite,
                                            packingSiteName: ps.pkgSiteName
                                        });
                                    }
                                });
                            });

                            aSites.sort((a, b) =>
                                a.packingSiteName.localeCompare(b.packingSiteName)
                            );

                            const oJSON = oView.getModel("JSONModel");
                            oJSON.setProperty("/sites", aSites);
                        },
                        error: (err) => {
                            sap.m.MessageBox.error("Failed to load packing sites for super user.");
                            console.error(err);
                        }
                    });
                }
            } else {

                const sUrl =
                    oCmoModel.sServiceUrl.replace(/\/?$/, "/") +
                    "T_PackagingSite?$expand=Users&$filter=Users/" + sUserFilter;

                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    contentType: "application/json",
                    success: (data) => {
                        let aSites = (data.value || data.results || []).map(ps => ({
                            packingSiteId: ps.pkgSite,
                            packingSiteName: ps.pkgSiteName
                        }));

                        aSites.sort((a, b) =>
                            a.packingSiteName.localeCompare(b.packingSiteName)
                        );

                        const oJSON = oView.getModel("JSONModel");
                        oJSON.setProperty("/sites", aSites);
                    },
                    error: (err) => {
                        sap.m.MessageBox.error("Failed to load packing sites for user.");
                        console.error(err);
                    }
                });
            }



            const sBase = oCmoModel.sServiceUrl.replace(/\/?$/, "/");


            const sUrl1 = sBase + "M_PackagingSite?$orderby=pkgSiteName";
            jQuery.ajax({
                url: sUrl1,
                type: "GET",
                contentType: "application/json",
                success: (oData) => {
                    const aRows = oData.value || oData.d?.results || [];
                    let aSites = aRows.map(r => ({
                        packingSiteId: r.pkgSite,
                        packingSiteName: r.pkgSiteName
                    }));

                    aSites = aSites.sort((a, b) =>
                        a.packingSiteName.localeCompare(b.packingSiteName)
                    );

                    const oJSON = oView.getModel("JSONModel");
                    oJSON.setProperty("/aPackingSiteAct", aSites);
                },
                error: (oErr) => {
                    sap.m.MessageBox.error("Failed to load M_PackagingSite: " + (oErr.responseText || oErr.statusText));
                }
            });


            const sUrl2 = sBase + "userlist";
            jQuery.ajax({
                url: sUrl2,
                type: "GET",
                contentType: "application/json",
                success: (oData) => {
                    const aRows = oData.results || oData.d?.results || [];
                    const aUserID = aRows.map(r => ({
                        USERID: r.USERID
                    }));

                    const oJSON = oView.getModel("JSONModel");
                    oJSON.setProperty("/aUserList", aUserID);
                },
                error: (oErr) => {
                    sap.m.MessageBox.error("Failed to load userlist: " + (oErr.responseText || oErr.statusText));
                }
            });
        },


        _reselectInDialog1: function () {
            var dlg = this._oValueHelpDialogPack;
            if (!dlg) return;

            var list = sap.ui.getCore().byId("packingSiteListAct");
            if (!list) return;

            var fnApply = function () {
                var oJSON = this.getView().getModel("JSONModel");
                var aSelectedIds = oJSON.getProperty("/selectedPackingReport") || [];
                var aItems = list.getItems();

                aItems.forEach(function (oItem) { oItem.setSelected(false); });
                aItems.forEach(function (oItem) {
                    var oCtx = oItem.getBindingContext("JSONModel");
                    var oObj = oCtx && oCtx.getObject();
                    if (oObj && aSelectedIds.indexOf(oObj.packingSiteId) !== -1) {
                        oItem.setSelected(true);
                    }
                });
            }.bind(this);
            fnApply();
            var oBinding = list.getBinding("items");
            if (oBinding && oBinding.attachEventOnce) {
                oBinding.attachEventOnce("change", fnApply);
            } else {
                setTimeout(fnApply, 0);
            }
        },


       

        onPreventManualTyping: function (oEvent) {

            oEvent.getSource().setValue(" ");
            oEvent.getSource().setValue("");
        },



///////////////////////////////////NEW ADDED FUNCTION FOR LAST 3 TABS/////////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

        onSKUTabFilter: function () {

            var sGlobalSPCCode = (this.byId("filterGlobalSPCCode").getValue() || "").trim().toLowerCase();
            var sPackingSiteSKU = (this.byId("filterPackingSiteSKU").getValue() || "").trim().toLowerCase();
            var sPackingSiteCode = (this.byId("filterPackingSiteCode").getValue() || "").trim().toLowerCase();

            var oDateRange = this.byId("ImplementationDeadlineID");
            var oStartDate = oDateRange.getDateValue();
            var oEndDate = oDateRange.getSecondDateValue();

            var aSource = this._filteredData.aSKUData;
            var oModel = this.getView().getModel("JSONModel");  //////sku-------------------------------------------------------------------------------------------------------------------->

            if (!sGlobalSPCCode && !sPackingSiteSKU && !sPackingSiteCode && !oStartDate && !oEndDate) {
                oModel.setProperty("/aSKUData", aSource);
                 this._createTable("SKUComponent", aSource);
                return;
            }

            console.log("from Data : ", oStartDate);
            console.log("To Data : ", oEndDate);

            var aFiltered = aSource.filter(function (oItem) {
                var bDateMatch = true;
                if (oStartDate && oEndDate && oItem.implementation_deadline) {

                    console.log("ImpData : ", oItem.implementation_deadline);

                    var oItemDate = new Date(oItem.implementation_deadline);
                    console.log("new Date :", oItemDate);
                    bDateMatch = oItemDate >= oStartDate && oItemDate <= oEndDate;
                    console.log("Match Date : ", bDateMatch);
                }

                return (
                    (!sGlobalSPCCode || (oItem.global_spc_code || "").toLowerCase().includes(sGlobalSPCCode)) &&
                    (!sPackingSiteSKU || (oItem.packing_site_sku || "").toLowerCase().includes(sPackingSiteSKU)) &&
                    (!sPackingSiteCode || (oItem.packing_site_code || "").toLowerCase().includes(sPackingSiteCode)) &&
                    bDateMatch
                );
            });

            this._createTable("SKUComponent", aFiltered);
            oModel.setProperty("/aSKUData", aFiltered);

        },

        onResetSKUFilters: function () {

            this.byId("filterGlobalSPCCode").setValue("");
            this.byId("filterPackingSiteSKU").setValue("");
            this.byId("filterPackingSiteCode").setValue("");
            this.byId("ImplementationDeadlineID").setValue("");


            const oModel = this.getView().getModel("JSONModel");/////sku----------------------------------------------------------------------------------------------------------------------------->
            oModel.setProperty("/aSKUData", this._filteredData.aSKUData);

            this._createTable("SKUComponent",this._filteredData.aSKUData);
            console.log("Filters Reset — Full SKU data restored");
        },




        

        onValueHelpRequest: function (oEvent) {
            const oControl = oEvent.getSource();
            const sCleanId = oControl.getId().split("--").pop();
            console.log("Clicked Control:", sCleanId);

            this._sBtnId = sCleanId;

            const oView = this.getView();

            if (!this._oDialog) {

                this._oDialog = new sap.m.Dialog({
                    title: "Select Packaging Site",
                    contentWidth: "400px",
                    draggable: true,
                    resizable: true,
                });

                const oSearch = new sap.m.SearchField({
                    liveChange: this.onVHSearch.bind(this)
                });

                const oList = new sap.m.List("idVHList", {
                    mode: "SingleSelectMaster",
                    items: {
                        path: "oPkgSite>/aActualPkgSite",
                        sorter: new sap.ui.model.Sorter("actualPackagingSite", false),
                        template: new sap.m.StandardListItem({
                            title: "{oPkgSite>actualPackagingSite}"
                        })
                    },
                    select: this.onVHSelect.bind(this)
                });

                oList.setModel(this.getView().getModel("oPkgSite"));

                this._oDialog.addContent(oSearch);
                this._oDialog.addContent(oList);

                this._oDialog.addButton(new sap.m.Button({
                    text: "Close",
                    press: () => this._oDialog.close()
                }));

                oView.addDependent(this._oDialog);
            }

            this._oDialog.open();
        },

        onVHSearch: function (oEvent) {
            const sValue = oEvent.getParameter("newValue");
            const oList = sap.ui.getCore().byId("idVHList");

            const oFilter = new sap.ui.model.Filter(
                "actualPackagingSite",    // ✔ correct property name
                sap.ui.model.FilterOperator.Contains,
                sValue
            );

            oList.getBinding("items").filter([oFilter]);
        },

        onVHSelect: function (oEvent) {
            //  console.log("BTN ID in select : ",this._sBtnId);
            const sSetSelectedDataToInput = this._sBtnId;
            const sSelected = oEvent.getParameter("listItem").getTitle();
            this.byId(sSetSelectedDataToInput).setValue(sSelected);
            this._oDialog.close();
        },



        onFilterCMSWIP: function () {

            var sGlobalSPCCode = (this.byId("cmsWIPFilterGlobalSPC").getValue() || "").trim().toLowerCase();
            var sPackingSiteSKU = (this.byId("cmsWIPFilterPackingSiteSKU").getValue() || "").trim().toLowerCase();
            var sPackingSiteCode = (this.byId("cmsWIPFilterPackingSiteCode").getValue() || "").trim().toLowerCase();

            var aSource = this._filteredData.aCMSWip;
            var oModel = this.getView().getModel("JSONModel");/////sku-------------------------------------------------------------------------------------------------------->


            if (!sGlobalSPCCode && !sPackingSiteSKU && !sPackingSiteCode) {
                oModel.setProperty("/aCMSWip", aSource);
                  this._createTable("CMSWIP", aSource);
                return;
            }

            var aFiltered = aSource.filter(function (oItem) {
                return (
                    (!sGlobalSPCCode || (oItem.globalSpcCodes || "").toLowerCase().includes(sGlobalSPCCode)) &&
                    (!sPackingSiteSKU || (oItem.packing_site_sku || "").toLowerCase().includes(sPackingSiteSKU)) &&
                    (!sPackingSiteCode || (oItem.newPackingSiteCode || "").toLowerCase().includes(sPackingSiteCode))
                );
            });

            this._createTable("CMSWIP", aFiltered);
            oModel.setProperty("/aCMSWip", aFiltered);
        },

        onSummaryFilterResetCMSWIP: function () {

            this.byId("cmsWIPFilterGlobalSPC").setValue("");
            this.byId("cmsWIPFilterPackingSiteSKU").setValue("");
            this.byId("cmsWIPFilterPackingSiteCode").setValue("");

            const oModel = this.getView().getModel("JSONModel");//sku---------------------------------------------------------------------------------------------------------------------->
            oModel.setProperty("/aCMSWip", this._filteredData.aCMSWip);

            this._createTable("CMSWIP", this._filteredData.aCMSWip);

            console.log("Filters Reset — Full SKU data restored");
        },


       

        onFilterCMSClosed: function () {
            console.log("SKU tab ");

            var sGlobalSPCCode = (this.byId("cmsClosedFilterGlobalSPC").getValue() || "").trim().toLowerCase();
            var sPackingSiteSKU = (this.byId("cmsClosedFilterPackingSiteSKU").getValue() || "").trim().toLowerCase();
            var sPackingSiteCode = (this.byId("cmsClosedFilterPackingSiteCode").getValue() || "").trim().toLowerCase();


            var aSource =   this._filteredData.aCMSClose;
          

            var oModel = this.getView().getModel("JSONModel");///////////sku---------------------------------------------------------------------------------------->

            if (!sGlobalSPCCode && !sPackingSiteSKU && !sPackingSiteCode) {
                oModel.setProperty("/aCMSClose", aSource);
                this._createTable("CMSClosed", aSource);
                return;
            }

            var aFiltered = aSource.filter(function (oItem) {
                return (
                    (!sGlobalSPCCode || (oItem.globalSpcCodes || "").toLowerCase().includes(sGlobalSPCCode)) &&
                    (!sPackingSiteSKU || (oItem.cmsClosedFilterPackingSiteSKU || "").toLowerCase().includes(sPackingSiteSKU)) &&
                    (!sPackingSiteCode || (oItem.newPackingSiteCode || "").toLowerCase().includes(sPackingSiteCode))
                );
            });

            this._createTable("CMSClosed", aFiltered);
            oModel.setProperty("/aCMSClose", aFiltered);
        },

        onFilterResetCMSClosed: function () {

            this.byId("cmsClosedFilterGlobalSPC").setValue("");
            this.byId("cmsClosedFilterPackingSiteSKU").setValue("");
            this.byId("cmsClosedFilterPackingSiteCode").setValue("");

            const oModel = this.getView().getModel("JSONModel");/////sku----------------------------------------------------------------------->
            oModel.setProperty("/aCMSClose",   this._filteredData.aCMSClose);

            this._createTable("CMSClosed",   this._filteredData.aCMSClose);
            console.log("Filters Reset — Full SKU data restored");
        },


/////////////////////////////////////////////////////////////////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
     






    });
});