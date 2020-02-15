const fs = require('fs');

module.exports = class Character {
    constructor(file) {
        this.file = file;
        this.read();
        console.log('Constructed Character Class');
    }

    get() {
        return this.character;
    }

    read() {
        var rawdata = fs.readFileSync(this.file);
        this.character = JSON.parse(rawdata);
    }

    write(data) {
        fs.writeFileSync(this.file, data)
    }

    attributes() {
        var body = this.character.attributeGroups.body.attributes;
        var mind = this.character.attributeGroups.mind.attributes;
        var special = this.character.attributeGroups.special.attributes;
        return {
            strength: parseInt(body.strength.value),
            reaction: parseInt(body.reaction.value),
            constitution: parseInt(body.constitution.value),
            dexterity: parseInt(body.dexterity.value),
            intuition: parseInt(mind.intuition.value),
            charisma: parseInt(mind.charisma.value),
            willpower: parseInt(mind.willpower.value),
            logic: parseInt(mind.logic.value),
            essence: parseInt(special.essence.value),
            edge: parseInt(special.edge.value)
        }
    }

    limits() {
        var a = this.attributes();
        var limitBody = Math.ceil( ((a.strength*2)+a.constitution+a.reaction)/3 )
        var limitMind = Math.ceil( ((a.logic*2)+a.intuition+a.willpower)/3 )
        var limitSocial = Math.ceil( ((a.charisma*2)+a.willpower+a.essence)/3 )
        return {
            body: limitBody,
            mind: limitMind,
            social: limitSocial
        }

    }
}