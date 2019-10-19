import {EDITABLE, LABEL, VALID, VALUE} from "../presentationModel/presentationModel.js";

export { formProjector, tableProjector, columnItemProjector }

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

const textInputProjector = textAttr => {
    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;
    bindTextInput(textAttr, inputElement);
    return inputElement;
};

//creates a column with a button and the attributes for this model
const columnItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {
    const trElement = document.createElement("TR");
    attributeNames.forEach( attributeName => {
        const tdItem = document.createElement("TD");
        tdItem.setAttribute("class","input")
        const inputElement = textInputProjector(model[attributeName]);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        tdItem.appendChild(inputElement);
        trElement.appendChild(tdItem);
    });
    const tdItem = document.createElement("TD");
    tdItem.setAttribute("class","delete");
    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removeModel(model);
    tdItem.appendChild(deleteButton);
    trElement.appendChild(tdItem);

    selectionController.onModelSelected(
        selected => selected === model
            ? trElement.classList.add("selected")
            : trElement.classList.remove("selected")
    );

    masterController.onModelRemove( (removedModel, removeMe) => {
        if (removedModel !== model) return;
        rootElement.removeChild(trElement);
        selectionController.clearSelection();
        removeMe();
    } );
    rootElement.appendChild(trElement);
    selectionController.setSelectedModel(model);
};

//creates the table with header row and returns it
const tableProjector = (attributeNames) => {
    const tableElement = document.createElement("TABLE");
    const headerTrElement = document.createElement("TR");
    tableElement.appendChild(headerTrElement);
    attributeNames.forEach( attributeName => {
        const thElement = document.createElement("TH");
        thElement.innerHTML = attributeName;
        headerTrElement.appendChild(thElement);
    });
    tableElement.appendChild(headerTrElement);
    return tableElement;
};

const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="detail-form">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector(".detail-form");

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");
        inputElement.setAttribute("ID", attributeName);
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });

    rootElement.firstChild.replaceWith(divElement);
};