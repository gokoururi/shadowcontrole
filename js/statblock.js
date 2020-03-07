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

function sheetRow(key, display, value, buttons=true, dataset={}) {
    let innerHTML = "";
    var htmlData = '';
    for (let [key, value] of Object.entries(dataset)) {
        htmlData += ` data-${key}="${value}"`
    }
    let colspan=2
    if ( buttons ) {
        colspan=0
    }

    innerHTML += `<tr id='${key}'>`
    innerHTML += `  <th>${display}</th>`
    innerHTML += `  <td class='value' colspan="${colspan}">${value}</td>`;
    if ( buttons ) {
        innerHTML += `  <td><button class="small" ${htmlData}>-</button><button class="small" ${htmlData}>+</button></td>`;
    }
    innerHTML += '</tr>';
    return innerHTML;
}
 
function print(char, elem) {
    const character = char.get();
    const element = document.querySelector(elem);
    var innerHTML = '';
    innerHTML += '<table>';
    innerHTML += sheetRowHeading("Details");
    var details = character.details;
    for (var [detailName, detail] of Object.entries(character.details)) {
        innerHTML += sheetRow(detailName, detail.display, detail.value, false)
    }

    for (var [key, attributeGroup] of Object.entries(character.attributeGroups)) {
        innerHTML += sheetRowHeading(attributeGroup.display)
        for (var [key, attribute] of Object.entries(attributeGroup.attributes)) {
            innerHTML += sheetRow(key, attribute.display, attribute.value, false);
        }
    }
    /*
    innerHTML += '<tr><th colspan="3"><div class="buttonrow">';
    innerHTML += '<button id="edit" class="large">Edit</button>';
    innerHTML += '<button id="save" class="large edithidden">Save</button>';
    innerHTML += '<button id="cancel" class="large edithidden">Cancel</button>';
    innerHTML += '</div></th></tr>';
    */
    innerHTML += sheetRowHeading("Limits");
    innerHTML += sheetRow("x", "Körperlich", char.limits.body, false);
    innerHTML += sheetRow("x", "Geistig", char.limits.mind, false);
    innerHTML += sheetRow("x", "Sozial", char.limits.social, false);
    innerHTML += sheetRowHeading("Berechnungen");
    innerHTML += sheetRow("x", "Initiative", char.initiative, false);
    innerHTML += sheetRow("x", "Heben/Tragen", 2, false);
    innerHTML += sheetRow("x", "Laufen/Rennen", 2, false);
    innerHTML += sheetRow("x", "Menschenk.", 2, false);
    innerHTML += sheetRow("x", "Selbstbeh.", 2, false);
    innerHTML += sheetRow("x", "Erinnrungsv.", 2, false);
    innerHTML += sheetRowHeading("Status");
    innerHTML += sheetRow("edgeStatus", "Used Edge", character.status.edge + "/" + char.attributes.edge, true, { 'type': 'edge' });
    innerHTML += sheetRow("dmg-body-temp", "DMG (K)", character.status.damage.body.temp, true, { 'type': 'dmg', 'path1': 'body', 'path2': 'temp'});
    innerHTML += sheetRow("dmg-body-perm", "Perm. DMG (K)", character.status.damage.body.perm, true, { 'type': 'dmg', 'path1': 'body', 'path2': 'perm'});
    innerHTML += sheetRow("x", "Leben (K)", char.health.body, false);
    innerHTML += sheetRow("dmg-mind-temp", "DMG (G)", character.status.damage.mind.temp, true, { 'type': 'dmg', 'path1': 'mind', 'path2': 'temp'});
    innerHTML += sheetRow("dmg-mind-perm", "Perm. DMG (G)", character.status.damage.mind.perm, true, { 'type': 'dmg', 'path1': 'mind', 'path2': 'perm'});
    innerHTML += sheetRow("x", "Leben (K)", char.health.mind, false);
    innerHTML += sheetRow("x", "Überzähliger DMG", char.health.overflow, false);
    innerHTML += '</table>';
;
    element.innerHTML = innerHTML;

    // Individual edit buttons
    var buttons = element.querySelectorAll('button.small')
    for (var button of buttons) {
        button.addEventListener('click', (event) => { manipulateStatus(char, element, event); })
    }

    /*
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
    */
}

function manipulateStatus(char, element, event) {
    var data = char.get();
    var type = event.target.dataset.type
    var add = true;

    if ( event.target.innerHTML === '-' ) {
        add = false;
    }

    if (type == "edge") {
        var value = data.status.edge;
        var displayElem = element.querySelector('#edgeStatus .value');
        console.log(value);
        if ( add ) {
            value++;
        } else {
            value--;
        }
        console.log(value);
        displayElem.innerHTML = value + '/' + char.attributes.edge;
        data.status.edge = value;
    } else if ( type == 'dmg' ) {
        var path1 = event.target.dataset.path1;
        var path2 = event.target.dataset.path2;
        console.log('damage damage');
        var displayElem = element.querySelector(`#${type}-${path1}-${path2} .value`);
        var value = data.status["damage"][path1][path2];
        if ( add ) {
            value++;
        } else {
            value--;
        }
        displayElem.innerHTML = value;
        data.status["damage"][path1][path2] = value;
        console.log(value);
    }

    char.write(data);
}

exports.print = print;