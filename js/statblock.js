function cs_enableEdit(element, enable) {
    var toggleButtonDisplay = "inline";
    var editButtonDisplay = 'none';
    var opacity = 0;
    var visibility = 'hidden';

    if ( enable ) {
        toggleButtonDisplay = "none";
        editButtonDisplay = 'inline';
        opacity = 1;
        visibility = 'visible';
    }

    element.querySelector('button#edit').style.display = toggleButtonDisplay;
    element.querySelector('button#save').style.display = editButtonDisplay;
    element.querySelector('button#cancel').style.display = editButtonDisplay
    var buttons = element.querySelectorAll('button.edithidden');
    for (var button of buttons) {
        button.style.opacity = opacity;
        button.style.visibility = visibility;
    }

}

function cs_manipulateAttribute(element, event) {
    var attribute = event.target.closest('tr').id;
    var valueelement = element.querySelector(`#${attribute} .value`);
    var curval = parseInt(valueelement.innerHTML)
    if ( event.target.innerHTML === '+' ) {
        valueelement.innerHTML = curval + 1
    } else {
        valueelement.innerHTML = curval -1
    }
}

function cs_saveCharacterData(element, char) {
    const character = char.get();
    var details = character.details;
    for (var detail in details) {
        var newvalue = element.querySelector(`#${detail} .value`).innerHTML
        character.details[detail].value = newvalue
    }

    for ( var [agKey, agVal ] of Object.entries(character.attributeGroups) ) {
        for (var [aKey, _aVal ] of Object.entries(agVal.attributes)) {
            var newValue = element.querySelector(`#${aKey} .value`).innerHTML
            character.attributeGroups[agKey].attributes[aKey].value = newValue;
        }
    }

    console.log(JSON.stringify(character, null, "  "))
    char.write(JSON.stringify(character));
}

function sheetRowHeading(heading) {
    let innerHTML = "";
    innerHTML += '<tr>'
    innerHTML += `  <th class="colspan" colspan="3">${heading}</th>`
    innerHTML += '</tr>';
    return innerHTML;
}

function sheetRow(key, display, value, buttons=true) {
    let innerHTML = "";
    let colspan=2
    if ( buttons ) {
        colspan=0
    }

    innerHTML += `<tr id='${key}'>`
    innerHTML += `  <th>${display}</th>`
    innerHTML += `  <td class='value' colspan="${colspan}">${value}</td>`;
    if ( buttons ) {
        innerHTML += '  <td><button class="edithidden small">-</button><button class="edithidden small">+</button></td>';
    }
    innerHTML += '</tr>';
    return innerHTML;
}
 
function print(char, elem) {
    const character = char.get();
    const element = document.querySelector(elem);
    var innerHTML = '<table>';
    innerHTML += sheetRowHeading("Details");
    var details = character.details;
    for (var [detailName, detail] of Object.entries(character.details)) {
        innerHTML += sheetRow(detailName, detail.display, detail.value, false)
    }

    for (var [key, attributeGroup] of Object.entries(character.attributeGroups)) {
        innerHTML += sheetRowHeading(attributeGroup.display)
        for (var [key, attribute] of Object.entries(attributeGroup.attributes)) {
            innerHTML += sheetRow(key, attribute.display, attribute.value);
        }
    }
    innerHTML += '<tr><th colspan="3"><div class="buttonrow">';
    innerHTML += '<button id="edit" class="large">Edit</button>';
    innerHTML += '<button id="save" class="large edithidden">Save</button>';
    innerHTML += '<button id="cancel" class="large edithidden">Cancel</button>';
    innerHTML += '</div></th></tr>';
    innerHTML += sheetRowHeading("Limits");
    innerHTML += sheetRow("x", "Körperlich", char.limits().body, false);
    innerHTML += sheetRow("x", "Geistig", char.limits().mind, false);
    innerHTML += sheetRow("x", "Sozial", char.limits().social, false);
    innerHTML += sheetRowHeading("Berechnungen");
    innerHTML += sheetRow("x", "Initiative", 2, false);
    innerHTML += sheetRow("x", "Heben/Tragen", 2, false);
    innerHTML += sheetRow("x", "Laufen/Rennen", 2, false);
    innerHTML += sheetRow("x", "Menschenkenntnis", 2, false);
    innerHTML += sheetRow("x", "Selbstbeherrschung", 2, false);
    innerHTML += sheetRow("x", "Erinnrungsvermögen", 2, false);
    innerHTML += '</table>';
    element.innerHTML = innerHTML;

    element.querySelector('button#edit').addEventListener('click', () => { cs_enableEdit(element, true) })
    element.querySelector('button#cancel').addEventListener('click', () => { cs_enableEdit(element, false); print(char, elem) })
    element.querySelector('button#save').addEventListener('click', () => {
        cs_saveCharacterData(element, char)
        cs_enableEdit(element, false);
        print(char, elem);
    })

    // Individual edit buttons
    var buttons = element.querySelectorAll('button.small')
    for (var button of buttons) {
        button.addEventListener('click', (event) => { cs_manipulateAttribute(element, event) })
    }
}

exports.print = print;