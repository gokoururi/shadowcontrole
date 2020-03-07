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

        var body = this.character.attributeGroups.body.attributes;
        var mind = this.character.attributeGroups.mind.attributes;
        var special = this.character.attributeGroups.special.attributes;
        this.attributes = {
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

        var a = this.attributes;
        this.limits = {
            body: Math.ceil( ((a.strength*2)+a.constitution+a.reaction)/3 ),
            mind: Math.ceil( ((a.logic*2)+a.intuition+a.willpower)/3 ),
            social: Math.ceil( ((a.charisma*2)+a.willpower+a.essence)/3 )
        }

        this.initiative = a.reaction + a.intuition + " + 1w6";
        this.health = {
            body: Math.ceil( 8 + (a.constitution/2)),
            mind: Math.ceil( 8 + (a.willpower/2)),
            overflow: a.constitution

        }

        this.status = {
            
        }
    }

    write(data) {
        var stringifiedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.file, stringifiedData)
    }
}