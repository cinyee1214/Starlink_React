
import React from "react";
import {
  Geographies,
  Geography,
  ComposableMap,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const WorldMap = () => {
  return (
    <ComposableMap projectionConfig={{ scale: 137 }} style={{ height: "700px", marginLeft: "100px" }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#DDD"
              stroke="#FFF"
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}

export default WorldMap;
