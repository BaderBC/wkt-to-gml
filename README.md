# `wkt-to-gml` 📍➡️🗺️  

A lightweight TypeScript library for converting **Well-Known Text (WKT)** to **Geography Markup Language (GML)**. Supports all standard geometry types with customizable output.  

## **Features**  

✅ **Supports all standard WKT geometries**:  
- `Point`, `LineString`, `Polygon`  
- `MultiPoint`, `MultiLineString`, `MultiPolygon`  
- `GeometryCollection`  

✅ **Customizable GML output**:  
- Choose your GML namespace (default: `3.2`).  
- Toggle pretty-printing and XML declaration.  

✅ **TypeScript & JavaScript**: Fully typed for seamless integration.  

---

## **Installation**  

```bash
npm install wkt-to-gml
```
or  
```bash
yarn add wkt-to-gml
```
or  
```bash
pnpm add wkt-to-gml
```

---

## **Usage**  

### **Basic Conversion**  
```ts
import { wktToGml } from 'wkt-to-gml';

const gml = wktToGml('POINT(30 10)');
console.log(gml);
```
**Output:**  
```xml
<gml:Point xmlns:gml="http://www.opengis.net/gml/3.2">
  <gml:pos>30 10</gml:pos>
</gml:Point>
```

### **Advanced Options**  
```ts
const gml = wktToGml('LINESTRING(10 20, 30 40)', {
  gmlNamespace: 'http://www.opengis.net/gml/3.3', // Custom namespace
  prettyPrint: false, // Minified output
  headlessXml: true,  // Omit <?xml?>
});
```
**Output:**  
```xml
<gml:LineString xmlns:gml="http://www.opengis.net/gml/3.3"><gml:posList>10 20 30 40</gml:posList></gml:LineString>
```

---

## **API**  

### **`wktToGml(wktString: string, options?: WktToGmlOptions): string`**  

#### **Options**  
| Key             | Type      | Default                          | Description |  
|-----------------|-----------|----------------------------------|-------------|  
| `gmlNamespace`  | `string`  | `"http://www.opengis.net/gml/3.2"` | Custom GML namespace URI. |  
| `prettyPrint`   | `boolean` | `true`                          | Pretty-print XML with indentation. |  
| `headlessXml`   | `boolean` | `true`                          | Omit `<?xml version="1.0"?>`. |  

---

## **Examples**  

### **1. Convert a Polygon**  
```ts
wktToGml('POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))');
```
**Output:**  
```xml
<gml:Polygon xmlns:gml="http://www.opengis.net/gml/3.2">
  <gml:exterior>
    <gml:LinearRing>
      <gml:posList>30 10 40 40 20 40 10 20 30 10</gml:posList>
    </gml:LinearRing>
  </gml:exterior>
</gml:Polygon>
```

### **2. Convert a MultiLineString (Minified)**  
```ts
wktToGml('MULTILINESTRING((10 10, 20 20), (30 30, 40 40))', { prettyPrint: false });
```
**Output:**  
```xml
<gml:MultiLineString xmlns:gml="http://www.opengis.net/gml/3.2"><gml:lineStringMember><gml:LineString><gml:posList>10 10 20 20</gml:posList></gml:LineString></gml:lineStringMember><gml:lineStringMember><gml:LineString><gml:posList>30 30 40 40</gml:posList></gml:LineString></gml:lineStringMember></gml:MultiLineString>
```

---

## **Contributing**  
PRs welcome! Run tests with:  
```bash
npm test
```

---

## **License**  
MIT © Bartłomiej Strama 2025
