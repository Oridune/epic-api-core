import e from "validator";

export const PointSchema = e.tuple([
  e.number().describe("longitude"),
  e.number().describe("latitude"),
]);
export const LinearRingSchema = e.array(PointSchema);
export const PolygonSchema = e.array(LinearRingSchema);
export const MultiPolygonSchema = e.array(PolygonSchema);

export const GeoPointSchema = e.object({
  type: e.value("Point" as const),
  coordinates: PointSchema,
});

export const GeoMultiPolygonSchema = e.object({
  type: e.value("MultiPolygon" as const),
  coordinates: MultiPolygonSchema,
});

export const GeoFeatureSchema = e.object({
  type: e.value("Feature" as const),
  geometry: GeoMultiPolygonSchema,
  properties: e.optional(e.record(e.any())),
});
