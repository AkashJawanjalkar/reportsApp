sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.PRDetailPage", {

        onInit: function () {
    const oModel = new JSONModel({
        LeftData: [],
        RightData: []
    });
    this.getView().setModel(oModel);

    const oRouter = UIComponent.getRouterFor(this);
    oRouter
        .getRoute("PRDetailPage")
        .attachPatternMatched(this._onObjectMatched, this);
},

_onObjectMatched: function (oEvent) {
    const sPRID = oEvent.getParameter("arguments").prid;
    console.log("ID-->",sPRID);

    this.getView().getModel().setProperty("/LeftData", [
        { Field1: "Left Row 1", Field2: "Value 2" },
        { Field1: "Left Row 2", Field2: "Value 4" }
    ]);

    this.getView().getModel().setProperty("/RightData", [
        { FieldA: "Right A1", FieldB: "Right B1" },
        { FieldA: "Right A2", FieldB: "Right B2" }
    ]);
}

    });
});
