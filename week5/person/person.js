import { Attribute, LABEL }                                 from "../presentationModel/presentationModel.js";
import { formProjector, tableProjector, rowItemProjector }                 from "./instantUpdateProjector.js";

export { MasterView, DetailView, Person, NoPerson, ALL_ATTRIBUTE_NAMES }

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname', 'wohnort'];

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Monika");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    const wohnortAttr  = Attribute("Brugg");
    wohnortAttr.getObs(LABEL).setValue("Wohnort");

    // lastnameAttr.setConverter( input => input.toUpperCase() );
    // lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
        wohnort:            wohnortAttr,
    }
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    johnDoe.firstname.setConvertedValue("");
    johnDoe.lastname.setConvertedValue("");
    return johnDoe;
})();

// View-specific parts
const MasterView = (listController, selectionController, rootElement) => {
    //create the table only once
    const tableElement =  tableProjector(ALL_ATTRIBUTE_NAMES,NoPerson);
    //render should update only this one column of the table
    const render = person =>
        rowItemProjector(listController, selectionController, tableElement, person, ALL_ATTRIBUTE_NAMES);

    rootElement.appendChild(tableElement);
    // binding
    listController.onModelAdd(render);
};

const DetailView = (selectionController, rootElement) => {

    const render = person =>
        formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    selectionController.onModelSelected(render);
};
