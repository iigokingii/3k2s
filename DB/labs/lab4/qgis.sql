-- 6
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo'

-- 7 id системы координат
select geometry_columns.srid as SRID from geometry_columns;

-- 8
SELECT COLUMN_NAME, DATA_TYPE
	FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = 'dbo' AND DATA_TYPE != 'geometry'

-- 9.	Верните описания пространственных объектов в формате WKT
--  текстовый формат для представления геометрических объектов в пространстве
SELECT geom.STAsText() AS WKT_Description FROM [ne_110m_geography_regions_polys]

-- 10
select * from ne_110m_geography_regions_polys;

-- 10.1.
	
SELECT obj1.geom.STIntersection(obj2.geom) AS Intersection
	FROM ne_110m_geography_regions_polys obj1, ne_110m_geography_regions_polys obj2
		WHERE obj1.qgs_fid = 1 AND obj2.qgs_fid = 9

-- 10.2.

SELECT geom.STPointN(1).ToString() AS VertexCoordinates
FROM ne_110m_geography_regions_polys
WHERE qgs_fid = 1

-- 10.3.	
SELECT geom.STArea() AS ObjectArea
FROM ne_110m_geography_regions_polys
WHERE qgs_fid = 5

-- 11.	
DECLARE @pointGeometry GEOMETRY;
SET @pointGeometry = GEOMETRY::STGeomFromText('POINT(5 14)', 0);
SELECT @pointGeometry AS PointGeometry;

DECLARE @lineGeometry GEOMETRY;
SET @lineGeometry = GEOMETRY::STGeomFromText('LINESTRING(1 5, 10 5)', 0);
SELECT @lineGeometry AS LineGeometry;


-- полигон
DECLARE @polygonGeometry GEOMETRY;
SET @polygonGeometry = GEOMETRY::STGeomFromText('POLYGON((1 1, 50 1, 50 50, 1 50, 1 1))', 0);
SELECT @polygonGeometry AS PolygonGeometry;


-- 12.	
DECLARE @point GEOMETRY = GEOMETRY::STGeomFromText('POINT(13 5)', 0);
DECLARE @polygon GEOMETRY = GEOMETRY::STGeomFromText('POLYGON((1 1, 50 1, 50 50, 1 50, 1 1))', 0);
SELECT @point.STWithin(@polygon) AS PointWithinPolygon;


DECLARE @line GEOMETRY = GEOMETRY::STGeomFromText('LINESTRING(1 5, 10 5)', 0);
DECLARE @polygonn GEOMETRY = GEOMETRY::STGeomFromText('POLYGON((1 1, 50 1, 50 50, 1 50, 1 1))', 0);
SELECT @line.STIntersects(@polygonn) AS LineIntersectsPolygon;


-- 13.
Create SPATIAL INDEX Geometry_index1
ON ne_110m_geography_regions_polys(geom)
USING GEOMETRY_GRID
WITH (
  BOUNDING_BOX = (-180, -90, 180, 90),
  GRIDS = (low, low, low, low),
  CELLS_PER_OBJECT = 20
);

SELECT *
FROM ne_110m_geography_regions_polys WITH(INDEX(Geometry_index1))
WHERE geom.STIntersects(geometry::STGeomFromText('POINT(10 20)', 4326)) = 1;

-- 14.
create procedure PointCheckProc
@point geometry
as
begin
DECLARE @polygon GEOMETRY = GEOMETRY::STGeomFromText('POLYGON((1 1, 50 1, 50 50, 1 50, 1 1))', 0);
SELECT @point.STWithin(@polygon) AS PointWithinPolygon;
end;

exec PointCheckProc 'POINT(2 5)';
