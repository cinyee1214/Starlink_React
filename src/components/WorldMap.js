
import React, { useState } from "react";
import {
  Geographies,
  Geography,
  Graticule,
  Sphere,
  ComposableMap,
} from "react-simple-maps";
import { Button, InputNumber, Progress } from "antd";

const progressStatus = {
  Idle: 'Idle',
  Tracking: 'Tracking...',
  Complete: 'Complete'
}

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const WorldMap = ({
  selectedSatellites
}) => {
  const [duration, setDuration] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressText, setProgressText] = useState(progressStatus.Idle);

  const trackOnClick = () => {
    setProgressText(`Tracking for ${duration} minutes`);
    setProgressPercentage(0);

    let curMin = 0;
    const timerId = setInterval(() => {
      setProgressPercentage((curMin / duration) * 100);

      if (curMin === duration) {
        setProgressText(progressStatus.Complete)
        clearInterval(timerId);
      }

      curMin++;
    }, 1000);
  }

  return (
    <>
      <div className="track-info-panel">
        <Button 
          type="primary"
          onClick={trackOnClick}
          disabled={selectedSatellites.length === 0}
        >
          Track selected satellites
        </Button>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>for</span>
        <InputNumber 
          min={1}
          max={50}
          defaultValue={1}
          onChange={(value) => setDuration(value)}
        />
        <span style={{ marginLeft: "10px", marginRight: "30px" }}>minutes</span>
        <Progress 
          style={{ width: "500px" }}
          percent={progressPercentage} 
          format={() => progressText} 
        />
      </div>
      <ComposableMap projectionConfig={{ scale: 137 }} style={{ height: "700px", marginLeft: "100px" }}>
        <Graticule stroke="#DDD" strokeWidth={0.5} />
        <Sphere stroke="#DDD" strokeWidth={0.5} />
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
    </>
  )
}

export default WorldMap;
