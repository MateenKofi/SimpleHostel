import { readFileSync, writeFileSync } from "fs";
import { parsePrismaSchema } from "@loancrate/prisma-schema-parser";

// Path to your Prisma schema file
const schemaPath = "./prisma/schema.prisma";

// Read and parse the schema
const schema = readFileSync(schemaPath, "utf-8");
const parsedSchema = parsePrismaSchema(schema);



// Define the interfaces based on the expected structure of the parsed schema
interface Location {
  start: {
    offset: number;
    line: number;
    column: number;
  };
  end: {
    offset: number;
    line: number;
    column: number;
  };
}

interface Name {
  kind: string;
  value: string;
  location: Location;
}

interface TypeId {
  kind: string;
  name: Name;
}

interface FieldAttribute {
  kind: string;
  path: {
    kind: string;
    value: string[];
    location: Location;
  };
  args: any[];
  location: Location;
}

interface Member {
  kind: string;
  name: Name;
  type: TypeId | { kind: string; type: TypeId };
  attributes: FieldAttribute[];
  comment: any;
  location: Location;
}

interface Model {
  kind: string;
  name: Name;
  members: Member[];
  location: Location;
}

interface Declarations {
  declarations: Model[];
}

interface ExtractedModel {
  modelName: string;
  fields: string[];
}

// Function to extract models and their fields
const extractModels = (data: Declarations): ExtractedModel[] => {
  if (!data.declarations || !Array.isArray(data.declarations)) {
    console.error("Declarations not found or not an array.");
    return [];
  }

  return data.declarations.map((model) => {
    // Check if the model has a valid 'name' field
    const modelName = model.name?.value || "Unnamed Model"; // Default if name is missing

    // If model has no name field, log the issue for debugging
    if (!model.name) {
      console.warn(`Model missing 'name' field: ${JSON.stringify(model, null, 2)}`);
    }

    if (!model.members || !Array.isArray(model.members)) {
      console.warn(`No members found for model: ${modelName}`);
      return { modelName, fields: [] };
    }

    const fields = model.members
      .filter((member) => {
        // Filtering out fields of type "list" or those with "relation" attributes
        if (member.type && member.type.kind === "list") {
          return false;
        }

        if (
          member.attributes &&
          member.attributes.some((attr) =>
            attr.path.value.includes("relation")
          )
        ) {
          return false;
        }

        return true;
      })
      .map((member) => member.name?.value || "Unnamed Field"); // Default if field name is missing

    console.log(`Model: ${modelName}, Fields: ${fields.join(", ")}`); // Log model fields
    return {
      modelName,
      fields,
    };
  });
};

// Extract allowed fields from parsed schema
const allowedFields = extractModels(parsedSchema as Declarations);

// Writing output to JSON files for further analysis
writeFileSync("./generatedSchema.json", JSON.stringify(parsedSchema, null, 2));
writeFileSync("./allowedFields.json", JSON.stringify(allowedFields, null, 2));

console.log("Extraction complete.");
