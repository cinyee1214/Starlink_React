import React, { useState } from "react";
import {
  Geographies,
  Geography,
  Graticule,
  Sphere,
  ComposableMap,
  Marker
} from "react-simple-maps";
import { Button, InputNumber, Progress } from "antd";
import { NY20_API_KEY, NY20_BASE_URL } from "../constants";

export const POSITION_API_BASE_URL = `${NY20_BASE_URL}/positions`;

const progressStatus = {
  Idle: 'Idle',
  Tracking: 'Tracking...',
  Complete: 'Complete'
}

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const WorldMap = ({
  selectedSatellites,
  disabled,
  onTracking,
  observerInfo
}) => {
  const [duration, setDuration] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressText, setProgressText] = useState(progressStatus.Idle);
  const [timerId, setTimerId] = useState(undefined);
  const [markersInfo, setMarkersInfo] = useState([]);
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  const abortOnClick = () => {
    if (timerId) {
      clearInterval(timerId);
      setProgressPercentage(0);
      setProgressText(progressStatus.Idle);
      onTracking(false);
      setTimerId(undefined);
    }
  }

  const fetchPositions = () => {
    const { longitude, latitude, altitude } = observerInfo;

    return selectedSatellites.map((sat) => {
      const id = sat.satid;
      return fetch(`${POSITION_API_BASE_URL}/${id}/${latitude}/${longitude}/${altitude}/${duration * 60}&apiKey=${NY20_API_KEY}`)
        .then(response => response.json());
    })
  }

  const updateMarker = (data, index) => {
    setMarkersInfo(data.map((sat) => {
      return {
        lon: sat.positions[index].satlongitude,
        lat: sat.positions[index].satlatitude,
        name: sat.info.satname,
      };
    }))
  }

  const startTracking = (data) => {
    let index = 59;
    let end = data[0].positions.length - 1;
    
    setCurrentTimestamp(new Date(data[0].positions[index].timestamp * 1000).toString());
    updateMarker(data, index);
    const timerId =  setInterval(() => {
      index += 60;
      setProgressPercentage((index / end) * 100);
      updateMarker(data, index);
      setCurrentTimestamp(new Date(data[0].positions[index].timestamp * 1000).toString());

      if (index >= end) {
        setProgressText(progressStatus.Complete);
        setTimerId(undefined);
        onTracking(false);
        clearInterval(timerId);
      }

    }, 1000);

    return timerId;
  }

  const trackOnClick = () => {
    setProgressText(progressStatus.Tracking);
    setProgressPercentage(0);
    onTracking(true);

    Promise.all(fetchPositions()).then((data) => {
      const id = startTracking(data);
      setTimerId(id);
    }).catch(() => {
      // TO DO: add some fallback UI handler here
    });
  }

  return (
    <>
      <div className="track-info-panel">
        <Button 
          type="primary"
          onClick={trackOnClick}
          disabled={selectedSatellites.length === 0 || disabled}
        >
          Track selected satellites
        </Button>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>for</span>
        <InputNumber 
          min={1}
          max={50}
          defaultValue={1}
          onChange={(value) => setDuration(value)}
          disabled={disabled}
        />
        <span style={{ marginLeft: "10px", marginRight: "30px" }}>minutes</span>
        <Progress 
          style={{ width: "500px", marginRight: "150px" }}
          percent={progressPercentage} 
          format={() => progressText} 
        />
        {timerId &&
          <Button 
            type="primary"
            onClick={abortOnClick}
          >
            Abort
          </Button>
        }
      </div>
      <div className="time-stamp-container" style={{textAlign: "center"}}>
        <b>{currentTimestamp}</b>
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
        {
          markersInfo.map((mark) => 
            <Marker coordinates={[mark.lon, mark.lat]}>
              <circle r={4} fill="#F53" />
              <text>{mark.name}</text>
            </Marker>
          )
        }
      </ComposableMap>
    </>
  )
}

export default WorldMap;
