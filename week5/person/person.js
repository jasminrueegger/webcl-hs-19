import { Attribute, LABEL }                                 from "../presentationModel/presentationModel.js";
import { listItemProjector, formProjector, tableProjector, columnItemProjector }                 from "./instantUpdateProjector.js";

export { MasterView, DetailView, Person, NoPerson, ALL_ATTRIBUTE_NAMES }

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname'];

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Monika");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    // lastnameAttr.setConverter( input => input.toUpperCase() );
    // lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {
    //create the table only once
    const tableElement =  tableProjector(ALL_ATTRIBUTE_NAMES);
    //render should update only this one column of the table
    const render = person =>
        columnItemProjector(listController, tableElement, person, ALL_ATTRIBUTE_NAMES);

    rootElement.appendChild(tableElement);
    // binding
    listController.onModelAdd(render);
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    johnDoe.firstname.setConvertedValue("");
    johnDoe.lastname.setConvertedValue("");
    return johnDoe;
})();

const DetailView = (selectionController, rootElement) => {

    const render = person =>
        formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    selectionController.onModelSelected(render);
};
