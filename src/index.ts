import { parse } from "wellknown";
import { create } from "xmlbuilder2";

const DEFAULT_GML_NS = "http://www.opengis.net/gml/3.2";

interface WktToGmlOptions {
  gmlNamespace?: string;
  prettyPrint?: boolean;
  headlessXml?: boolean;
}

/**
 * Converts WKT (Well-Known Text) to GML (Geography Markup Language).
 * Supports all standard geometry types including:
 * - Point
 * - LineString
 * - Polygon
 * - MultiPoint
 * - MultiLineString
 * - MultiPolygon
 * - GeometryCollection
 */
export function wktToGml(wktString: string, options?: WktToGmlOptions): string {
  const geoJson = parse(wktString);
  if (!geoJson) {
    throw new Error("Invalid WKT string");
  }

  const root = create().ele("gml:" + geoJson.type, {
    "xmlns:gml": options?.gmlNamespace ?? DEFAULT_GML_NS,
  });

  switch (geoJson.type) {
    case "Point":
      buildPoint(root, geoJson.coordinates);
      break;
    case "LineString":
      buildLineString(root, geoJson.coordinates);
      break;
    case "Polygon":
      buildPolygon(root, geoJson.coordinates);
      break;
    case "MultiPoint":
      buildMultiPoint(root, geoJson.coordinates);
      break;
    case "MultiLineString":
      buildMultiLineString(root, geoJson.coordinates);
      break;
    case "MultiPolygon":
      buildMultiPolygon(root, geoJson.coordinates);
      break;
    case "GeometryCollection":
      buildGeometryCollection(root, geoJson.geometries);
      break;
  }

  return root.end({
    prettyPrint: options?.prettyPrint ?? true,
    headless: options?.headlessXml ?? true,
  });
}

// Helper functions for building GML elements
function buildPoint(root: any, coordinates: number[]) {
  root.ele("gml:pos").txt(coordinates.join(" "));
}

function buildLineString(root: any, coordinates: number[][]) {
  root.ele("gml:posList").txt(coordinates.map(coord => coord.join(" ")).join(" "));
}

function buildPolygon(root: any, coordinates: number[][][]) {
  if (coordinates.length > 0) {
    // Exterior ring (first element)
    const exterior = coordinates[0];
    const exteriorElement = root.ele("gml:exterior").ele("gml:LinearRing");
    exteriorElement.ele("gml:posList").txt(exterior.map(coord => coord.join(" ")).join(" "));

    // Interior rings (remaining elements)
    for (let i = 1; i < coordinates.length; i++) {
      const interior = coordinates[i];
      const interiorElement = root.ele("gml:interior").ele("gml:LinearRing");
      interiorElement.ele("gml:posList").txt(interior.map(coord => coord.join(" ")).join(" "));
    }
  }
}

function buildMultiPoint(root: any, coordinates: number[][]) {
  coordinates.forEach(coord => {
    const pointMember = root.ele("gml:pointMember");
    buildPoint(pointMember.ele("gml:Point"), coord);
  });
}

function buildMultiLineString(root: any, coordinates: number[][][]) {
  coordinates.forEach(line => {
    const lineMember = root.ele("gml:lineStringMember");
    buildLineString(lineMember.ele("gml:LineString"), line);
  });
}

function buildMultiPolygon(root: any, coordinates: number[][][][]) {
  coordinates.forEach(polygon => {
    const polyMember = root.ele("gml:polygonMember");
    buildPolygon(polyMember.ele("gml:Polygon"), polygon);
  });
}

function buildGeometryCollection(root: any, geometries: any[]) {
  geometries.forEach(geom => {
    const geomMember = root.ele("gml:geometryMember");
    const nestedRoot = geomMember.ele("gml:" + geom.type);
    switch (geom.type) {
      case "Point":
        buildPoint(nestedRoot, geom.coordinates);
        break;
      case "LineString":
        buildLineString(nestedRoot, geom.coordinates);
        break;
      case "Polygon":
        buildPolygon(nestedRoot, geom.coordinates);
        break;
      case "MultiPoint":
        buildMultiPoint(nestedRoot, geom.coordinates);
        break;
      case "MultiLineString":
        buildMultiLineString(nestedRoot, geom.coordinates);
        break;
      case "MultiPolygon":
        buildMultiPolygon(nestedRoot, geom.coordinates);
        break;
      default:
        throw new Error(`Unsupported nested geometry type: ${geom.type}`);
    }
  });
}