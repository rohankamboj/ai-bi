// src/components/maps/AdvancedInteractiveMap.tsx

import React, { useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";
import LayerList from "@arcgis/core/widgets/LayerList";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import "@arcgis/core/assets/esri/themes/light/main.css";

interface MapMarker {
  [key: string]: any;
}

interface AdvancedInteractiveMapProps {
  basemap?: string;
  markers: MapMarker[];
  latitudeField: string;
  longitudeField: string;
}

const AdvancedInteractiveMap: React.FC<AdvancedInteractiveMapProps> = ({
  basemap = "streets-navigation-vector",
  markers,
  latitudeField,
  longitudeField,
}) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    const initializeMap = async () => {
      const map = new Map({ basemap });

      const { center, zoom } = calculateMapView(markers, latitudeField, longitudeField);

      const newView = new MapView({
        container: mapDiv.current as HTMLDivElement,
        map: map,
        center: center,
        zoom: zoom,
      });

      // Add widgets
      const legend = new Legend({ view: newView });
      newView.ui.add(legend, "bottom-left");

      const basemapGallery = new BasemapGallery({ view: newView });
      const basemapExpand = new Expand({
        view: newView,
        content: basemapGallery,
        expandIcon: "esri-icon-basemap",
      });
      newView.ui.add(basemapExpand, "top-right");

      const searchWidget = new Search({ view: newView });
      newView.ui.add(searchWidget, "top-right");

      const layerList = new LayerList({ view: newView });
      const layerListExpand = new Expand({
        view: newView,
        content: layerList,
        expandIcon: "esri-icon-layer-list",
      });
      newView.ui.add(layerListExpand, "top-right");

      setView(newView);

      // Add markers to the map
      addMarkersToMap(map, newView, markers, latitudeField, longitudeField);

      return newView.when();
    };

    initializeMap().catch((error) =>
      console.error("Error initializing map:", error)
    );

    return () => {
      if (view) view.destroy();
    };
  }, [basemap, markers, latitudeField, longitudeField]);

  const calculateMapView = (markers: MapMarker[], latField: string, lonField: string) => {
    let minLat = Number.MAX_VALUE;
    let maxLat = Number.MIN_VALUE;
    let minLon = Number.MAX_VALUE;
    let maxLon = Number.MIN_VALUE;

    markers.forEach(marker => {
      const lat = parseFloat(marker[latField]);
      const lon = parseFloat(marker[lonField]);
      if (!isNaN(lat) && !isNaN(lon)) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      }
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // Calculate an appropriate zoom level
    const latDiff = maxLat - minLat;
    const lonDiff = maxLon - minLon;
    const maxDiff = Math.max(latDiff, lonDiff);
    let zoom = 2;  // Default zoom level
    if (maxDiff < 360) zoom = 3;
    if (maxDiff < 180) zoom = 4;
    if (maxDiff < 90) zoom = 5;
    if (maxDiff < 45) zoom = 6;
    if (maxDiff < 22.5) zoom = 7;
    if (maxDiff < 11.25) zoom = 8;
    if (maxDiff < 5.625) zoom = 9;
    if (maxDiff < 2.813) zoom = 10;

    return { center: [centerLon, centerLat], zoom };
  };

  const addMarkersToMap = (
    map: Map,
    mapView: MapView,
    markers: MapMarker[],
    latField: string,
    lonField: string
  ) => {
    const graphicsLayer = new GraphicsLayer({ title: "Map Markers" });
    map.add(graphicsLayer);

    markers.forEach((marker) => {
      const lat = parseFloat(marker[latField]);
      const lon = parseFloat(marker[lonField]);
      if (isNaN(lat) || isNaN(lon)) return;

      const popupTemplate = new PopupTemplate({
        title: "Marker Information",
        content: Object.entries(marker)
          .map(([key, value]) => `<b>${key}:</b> ${value}`)
          .join("<br/>"),
      });

      const graphic = new Graphic({
        geometry: new Point({
          longitude: lon,
          latitude: lat,
        }),
        symbol: {
          type: "simple-marker",
          color: [0, 0, 255, 0.6],
          outline: {
            color: [255, 255, 255],
            width: 1,
          },
          size: "8px",
        },
        attributes: marker,
        popupTemplate: popupTemplate,
      });

      graphicsLayer.add(graphic);
    });

    // Adjust the view to fit all markers
    mapView.goTo(graphicsLayer.graphics.toArray());
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0" ref={mapDiv}></div>
    </div>
  );
};

export default AdvancedInteractiveMap;
