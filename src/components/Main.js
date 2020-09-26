import React, { useState } from "react";
import { Col, Row } from "antd";
import ObserverInfo from "./ObserverInfo";
import { SAT_CATEGORY, NY20_API_KEY, NY20_BASE_URL } from "../constants";
import SatelliteList from "./SatelliteList";

export const ABOVE_API_BASE_URL = `${NY20_BASE_URL}/above`;

const Main = () => {
  const [satList, setSatList] = useState([]);

  const findSatellitesOnClick = (nextObserverInfo) => {
    const { longitude, latitude, altitude, radius } = nextObserverInfo;

    fetch(`${ABOVE_API_BASE_URL}/${latitude}/${longitude}/${altitude}/${radius}/${SAT_CATEGORY}&apiKey=${NY20_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setSatList(data.above.map((satellite) => {
          return {
            ...satellite,
            selected: false,
          }
        }));
      })
      .catch(() => {
        // Do things when API call fails
      });
  }

  return (
    <Row>
      <Col span={8}>
        <ObserverInfo 
          findSatellitesOnClick={findSatellitesOnClick}
        />
        <SatelliteList 
          satList={satList}
          updateSatelliteList={setSatList}
        />
      </Col>
      <Col span={16}>
        WorldMap
      </Col>
    </Row>
  )
}

export default Main;
