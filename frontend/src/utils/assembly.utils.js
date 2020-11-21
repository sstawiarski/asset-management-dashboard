/**
 * Returns the schema of an assembly based on the assembly type name
 * @param type string representing assembly type
 */
export const getSchema = async (type) => {
    const name = encodeURI(type);
    const response = await fetch(`http://localhost:4000/assets/assembly/schema?type=${name}`)
    if (response.status < 300) {
        const json = await response.json();
        return json;
    } else {
        return {};
    };
};

/**
 * Takes in array of serials and compares them against the provided schema
 * Helper method for creating a new assembly
 * 
 * @param schema the assembly schema retreived from the API from the API
 * @param components the array of selected serials
 * 
 * @returns array with boolean for completeness and an array of the names of the missing assets
 */
export const compareSchema = async (schema, components) => {
    let foundNames = [];
    for (const name of components) {
        const json = await getField(name, "assetName");
        foundNames.push(json["assetName"]);
    }

    let count = schema["components"].length;
    const missingItems = [];

    for (const item of schema["components"]) {
        if (foundNames.includes(item)) count--;
        else {
            missingItems.push(item);
        }
    }
    const isComplete = count === 0 ? true : false;


    return [isComplete, missingItems];

};

/**
 * Gets a singular field from an asset based on its serial
 * 
 * @param serial the serial of the asset to get
 * @param field field to project from resulting object, usually assetName for assembly creation
 */
export const getField = async (serial, field) => {
    const response = await fetch(`http://localhost:4000/assets/${serial}?project=${field}`);
    if (response.status < 300) {
        const json = await response.json();
        return json;
    } else {
        return {};
    }
}