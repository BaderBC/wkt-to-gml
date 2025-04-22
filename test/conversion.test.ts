import { describe, it, expect } from "vitest";
import { wktToGml } from "../src";

/**
 * Prepare the string for comparison
 * */
function prep(str: string): string {
  return str.replace(/\s+/g, "");
}

describe("wktToGml", () => {
  // --- Point ---
  it("converts POINT to GML correctly", () => {
    const wkt = "POINT(30 10)";
    const expectedGml = `
      <gml:Point xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:pos>30 10</gml:pos>
      </gml:Point>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- LineString ---
  it("converts LINESTRING to GML correctly", () => {
    const wkt = "LINESTRING(30 10, 10 30, 40 40)";
    const expectedGml = `
      <gml:LineString xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:posList>30 10 10 30 40 40</gml:posList>
      </gml:LineString>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- Polygon ---
  it("converts POLYGON to GML correctly", () => {
    const wkt = "POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))";
    const expectedGml = `
      <gml:Polygon xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:exterior>
          <gml:LinearRing>
            <gml:posList>30 10 40 40 20 40 10 20 30 10</gml:posList>
          </gml:LinearRing>
        </gml:exterior>
      </gml:Polygon>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- MultiPoint ---
  it("converts MULTIPOINT to GML correctly", () => {
    const wkt = "MULTIPOINT((10 40), (40 30), (20 20), (30 10))";
    const expectedGml = `
      <gml:MultiPoint xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:pointMember>
          <gml:Point>
            <gml:pos>10 40</gml:pos>
          </gml:Point>
        </gml:pointMember>
        <gml:pointMember>
          <gml:Point>
            <gml:pos>40 30</gml:pos>
          </gml:Point>
        </gml:pointMember>
        <gml:pointMember>
          <gml:Point>
            <gml:pos>20 20</gml:pos>
          </gml:Point>
        </gml:pointMember>
        <gml:pointMember>
          <gml:Point>
            <gml:pos>30 10</gml:pos>
          </gml:Point>
        </gml:pointMember>
      </gml:MultiPoint>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- MultiLineString ---
  it("converts MULTILINESTRING to GML correctly", () => {
    const wkt = "MULTILINESTRING((10 10, 20 20, 10 40), (40 40, 30 30, 40 20, 30 10))";
    const expectedGml = `
      <gml:MultiLineString xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:lineStringMember>
          <gml:LineString>
            <gml:posList>10 10 20 20 10 40</gml:posList>
          </gml:LineString>
        </gml:lineStringMember>
        <gml:lineStringMember>
          <gml:LineString>
            <gml:posList>40 40 30 30 40 20 30 10</gml:posList>
          </gml:LineString>
        </gml:lineStringMember>
      </gml:MultiLineString>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- MultiPolygon ---
  it("converts MULTIPOLYGON to GML correctly", () => {
    const wkt = "MULTIPOLYGON(((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))";
    const expectedGml = `
      <gml:MultiPolygon xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:polygonMember>
          <gml:Polygon>
            <gml:exterior>
              <gml:LinearRing>
                <gml:posList>30 20 45 40 10 40 30 20</gml:posList>
              </gml:LinearRing>
            </gml:exterior>
          </gml:Polygon>
        </gml:polygonMember>
        <gml:polygonMember>
          <gml:Polygon>
            <gml:exterior>
              <gml:LinearRing>
                <gml:posList>15 5 40 10 10 20 5 10 15 5</gml:posList>
              </gml:LinearRing>
            </gml:exterior>
          </gml:Polygon>
        </gml:polygonMember>
      </gml:MultiPolygon>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- GeometryCollection ---
  it("converts GEOMETRYCOLLECTION to GML correctly", () => {
    const wkt = "GEOMETRYCOLLECTION(POINT(4 6), LINESTRING(4 6, 7 10))";
    const expectedGml = `
      <gml:GeometryCollection xmlns:gml="http://www.opengis.net/gml/3.2">
        <gml:geometryMember>
          <gml:Point>
            <gml:pos>4 6</gml:pos>
          </gml:Point>
        </gml:geometryMember>
        <gml:geometryMember>
          <gml:LineString>
            <gml:posList>4 6 7 10</gml:posList>
          </gml:LineString>
        </gml:geometryMember>
      </gml:GeometryCollection>`;
    expect(prep(wktToGml(wkt))).toBe(prep(expectedGml));
  });

  // --- Error Handling ---
  it("throws an error for unsupported WKT types", () => {
    const invalidWkt = "CURVE(1 1, 2 2)";
    expect(() => wktToGml(invalidWkt)).toThrowError("Invalid WKT string");
  });
});