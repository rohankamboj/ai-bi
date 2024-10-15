// src/components/MapComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Legend from '@arcgis/core/widgets/Legend';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';

interface AdvancedMapComponentProps {
  center?: [number, number];
  zoom?: number;
  basemap?: string;
  featureLayerUrl?: string;
}

const AdvancedMapComponent: React.FC<AdvancedMapComponentProps> = ({
  center = [-118.805, 34.027],
  zoom = 13,
  basemap = 'topo-vector',
  featureLayerUrl = 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0'
}) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const map = new Map({
        basemap: basemap,
      });

      const newView = new MapView({
        container: mapDiv.current as HTMLDivElement,
        map: map,
        center: center,
        zoom: zoom,
      });

      if (featureLayerUrl) {
        const featureLayer = new FeatureLayer({
          url: featureLayerUrl,
          outFields: ["*"],
          popupTemplate: new PopupTemplate({
            title: "{TRL_NAME}",
            content: [{
              type: "fields",
              fieldInfos: [
                { fieldName: "PARK_NAME", label: "Park Name" },
                { fieldName: "ELEV_FT", label: "Elevation" },
                { fieldName: "USE_BIKE", label: "Bike Use" },
                { fieldName: "USE_HIKE", label: "Hike Use" },
                { fieldName: "USE_HORSE", label: "Horse Use" },
              ]
            }]
          })
        });

        map.add(featureLayer);
      }

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      // Add a point
      const point = {
        type: "point",
        longitude: -118.80657463861,
        latitude: 34.0005930608889
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      };
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
      });
      graphicsLayer.add(pointGraphic);

      // Add widgets
      const legend = new Legend({ view: newView });
      newView.ui.add(legend, "bottom-left");

      const basemapGallery = new BasemapGallery({ view: newView });
      const bgExpand = new Expand({
        view: newView,
        content: basemapGallery
      });
      newView.ui.add(bgExpand, "top-right");

      setView(newView);

      return newView.when();
    };

    initializeMap().catch((error) => {
      console.error("Error initializing map:", error);
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [center, zoom, basemap, featureLayerUrl]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (view) {
        view.resize();
      }
    });

    if (mapDiv.current) {
      resizeObserver.observe(mapDiv.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [view]);

  return <div className="w-full h-full" ref={mapDiv}></div>;
};

export default AdvancedMapComponent;
