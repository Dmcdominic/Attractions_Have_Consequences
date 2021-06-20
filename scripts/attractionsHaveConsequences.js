// ========== VARIABLE DECLARATIONS ==========
var num_people = 4;
var all_people = [];
var relationship_matrix = [];


// ========== CLASSES ===========
class Person {
    name = "(unnamed)";
    ID = -1;
    alive = true;
    constructor(name, ID) {
        this.name = name;
        this.ID = ID;
    }

    get_info(include_relationships = false) {
        let str = "";
        // str += "PERSON\n";
        str += this.name + " (ID: " + this.ID + ")\n";
        str += "  " + (this.alive ? "Alive" : "Dead");
        if (include_relationships) {
            for (let i=0; i < num_people; i++) {
                if (i !== this.ID) {
                    str += relationship_matrix[this.ID, i].get_info("  ");
                }
            }
        }
        str += "\n"
        return str;
    }
}

class Relationship {
    people_IDs = [ -1, -1 ];
    feelings = [ 0, 0 ];
    married = false;
    intimate = false;
    constructor(people_IDs) {
        this.people_IDs = people_IDs;
    }

    get_info(line_prefix = "") {
        let str = "";
        // str += line_prefix + "RELATIONSHIP\n";
        let p0 = all_people[this.people_IDs[0]];
        let p1 = all_people[this.people_IDs[1]];
        str += line_prefix + p0.name + " + " + p1.name + "\n";
        str += line_prefix + "  IDs: [ " + p0.ID + ", " + p1.ID + " ]\n";
        str += line_prefix + "  Feelings:  [ " + this.feelings[0] + ", " + this.feelings[1] + " ]\n";
        return str;
    }
}

class Gossip {
    description = "(missing description)";
    impacts = [];
    constructor(description, impacts) {
        this.description = description;
        this.impacts = impacts;
    }
    
    process() {
        console.log("Processing gossip: \"" + this.description + "\"");
        this.impacts.foreach(impact => {
            impact.process();
        });
    }
}

class Impact {
    feeling_adjustments = [];
    marriages = [];
    divorces = [];
    deaths = [];
    constructor(feeling_adjustments, marriages = [], deaths = []) {
        this.feeling_adjustments = feeling_adjustments;
        this.marriages = marriages;
        this.deaths = deaths;
    }
    
    process() {
        this.feeling_adjustments.foreach(feeling_adjustment => {
            feeling_adjustment.process();
        });
        
        this.marriages.foreach(marriage => {
            let relationship = relationship_matrix[marriage[0]][marriage[1]];
            relationship.married = true;
            // TODO - other implications of marriage?
        });

        this.divorces.foreach(divorce => {
            let relationship = relationship_matrix[divorce[0]][divorce[1]];
            relationship.married = false;
            // TODO - other implications of divorce?
        });

        this.deaths.foreach(death => {
            let person = all_people[death];
            person.alive = false;
            // TODO - other implications of death?
        });
    }
}

class Feeling_Adjustment {
    people_IDs = [ -1, -1 ];
    delta = [ 0, 0 ];
    set_directly = false;
    constructor(people_IDs, delta, set_directly = false) {
        this.people_IDs = people_IDs;
        this.delta = delta;
        this.set_directly = set_directly;
    }
    process() {
        let relationship = relationship_matrix[this.people_IDs[0]][this.people_IDs[1]];
        if (this.set_directly) {
            relationship.feelings[0] = this.delta[0];
            relationship.feelings[1] = this.delta[1];
        } else {
            relationship.feelings[0] += this.delta[0];
            relationship.feelings[1] += this.delta[1];
        }
    }
}


// ========== CORE FUNCTIONS ===========



// ========== UTILITY ===========
function dump_all_info() {
    console.log(get_all_info());
}
function get_all_info() {
    let str = "";
    str += "PEOPLE:\n";
    for (let i=0; i < num_people; i++) {
        str += all_people[i].get_info() + "\n";
    }
    str += "RELATIONSHIPS:\n";
    for (let i=0; i < num_people; i++) {
        for (let j=i+1; j < num_people; j++) {
            str += relationship_matrix[i][j].get_info() + "\n";
        }
    }
    return str;
}


// ========== INITIALIZATION ==========
for (let i=0; i < num_people; i++) {
    all_people.push(new Person("temp_name_" + i, i));
    relationship_matrix.push(new Array(num_people));
}

for (let i=0; i < num_people; i++) {
    for (let j=i+1; j < num_people; j++) {
        let new_relationship = new Relationship([i, j]);
        relationship_matrix[i][j] = new_relationship;
        relationship_matrix[j][i] = new_relationship;
    }
}



// ========== TESTING ============
dump_all_info();
