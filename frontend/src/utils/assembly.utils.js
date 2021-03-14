/**
 * Returns the schema of an assembly based on the assembly type name
 * @param type string representing assembly type
 */
export const getSchema = async (type, isAssembly) => {
    const name = encodeURI(type);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/assets/assembly/schema?type=${name}&assembly=${isAssembly}`)
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

    /* Get all names of items needed for a schema */
    for (const item of components) {
        const json = await getField(item.serial, "assetName");
        foundNames.push(json["assetName"]);
    }

    /* Initialize variable with number of necessary components */
    let count = schema["components"].length;
    const missingItems = [];

    /* If the current cart contains the name of a necessary component, decrement the number missing */
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/assets/${serial}?project=${field}`);
    if (response.status < 300) {
        const json = await response.json();
        return json;
    } else {
        return {};
    }
}