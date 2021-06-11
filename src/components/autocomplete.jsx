import React, { useState } from "react";

import Map, { Marker } from "google-maps-react";
// import clsx from 'clsx';
// import { makeStyles } from '@material-ui/core/styles';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import TextField from '@material-ui/core/TextField';

import CalendarSVG from "./calendar";

import styles from "./autocomplete.module.scss";
import SearchInput from "./search-input";
import FinderSVG from "./finder";
import SeatsSVG from "./seats";
import InvertSVG from "./invert";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   margin: {
//     margin: theme.spacing(1),
//   },
//   withoutLabel: {
//     marginTop: theme.spacing(3),
//   },
//   textField: {
//     width: '25ch',
//   },
// }));

const Contents = ({ google }) => {
  const [map, setMap] = useState(null);

  const [address, setAddress] = useState({
    from: null,
    dest: null
  });
  const placeholders = {
    from: "Leaving from...",
    dest: "Going to..."
  };

  const [activeField, setActiveField] = useState("");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState({
    distance: "",
    duration: ""
  });

  const placeListener = (id, place) => {
    setActiveField("");
    if (!place) return;

    const newAddr = {
      ...address,
      [id]: place
    };
    setAddress(newAddr);
    if (id === "from") {
      setActiveField("dest");
    }

    if (!newAddr.from || !newAddr.dest) {
      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    } else {
      var bounds = new google.maps.LatLngBounds();
      [newAddr.from, newAddr.dest].forEach(place => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
      calcRoute(newAddr.from.geometry.location, newAddr.dest.geometry.location);
    }
  };

  const calcRoute = (origin, destination) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      RenderCustomDirections
    );
  };

  const RenderCustomDirections = (response, status) => {
    console.log("render-route", status, response);
    if (status !== google.maps.DirectionsStatus.OK) {
      return;
    }
    directionsRenderer.setDirections(response);
    setRouteInfo({
      distance: response.routes[0].legs[0].distance.text,
      duration: response.routes[0].legs[0].duration.text
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log("submit");
    if (!address.from || !address.dest) return;
  };

  const mapLoaded = (mapProps, map) => {
    setMap(map);

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
    directionsRenderer.setMap(map);

    setDirectionsService(directionsService);
    setDirectionsRenderer(directionsRenderer);
  };

  return (
    <div className={styles.flexWrapper}>
      <div className={styles.left}>
        <div className="sc-dymIpo kGFxSt"></div>
        <div className="gVRRSR">
          <h1 className="sc-gFaPwZ hcCwWZ">Your ride. Your choice.</h1>
          <div className="sc-fhYwyz iXcwKt">
            <form
              action=""
              noValidate
              className="sc-TFwJa kVQVJo kirk-searchForm"
              role="search"
              method="post"
              onSubmit={onSubmit}
            >
              <div className="kirk-searchForm-from-container">
                <div className="kirk-searchForm-from">
                  <div className="sc-dTdPqK dHWNZE slide-enter-done">
                    <button
                      type="button"
                      className="kirk-search-button"
                      onClick={() => setActiveField("from")}
                    >
                      <span className="kirk-bullet--searchForm">
                        <div
                          className="sc-dnqmqq fzalHo kirk-bullet kirk-bullet--search"
                          aria-hidden="true"
                        ></div>
                      </span>
                      {address.from ? (
                        <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis">
                          {address.from.formatted_address}
                        </span>
                      ) : (
                        <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis kirk-search-placeholder">
                          {placeholders.from}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="kirk-searchForm-invert">
                  <button type="button" className="kirk-search-button">
                    <InvertSVG />
                  </button>
                </div>
              </div>
              <hr className="sc-krDsej dUDfSE" />
              <div className="sc-fjmCvl knJFGD kirk-searchForm-overlay kirk-searchForm-autocomplete-from">
                {activeField === "from" ? (
                  <SearchInput
                    google={google}
                    map={map}
                    id="from"
                    label={placeholders.from}
                    placeListener={placeListener}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="kirk-searchForm-to">
                <div
                  transform="[object Object]"
                  className="sc-dTdPqK xVuju slide-enter-done"
                >
                  <button
                    type="button"
                    className="kirk-search-button"
                    onClick={() => setActiveField("dest")}
                  >
                    <span className="kirk-bullet--searchForm">
                      <div
                        className="sc-dnqmqq fzalHo kirk-bullet kirk-bullet--search"
                        aria-hidden="true"
                      ></div>
                    </span>
                    {address.dest ? (
                      <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis">
                        {address.dest.formatted_address}
                      </span>
                    ) : (
                      <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis kirk-search-placeholder">
                        {placeholders.dest}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <hr className="sc-krDsej dUDfSE" />
              <div className="sc-fjmCvl knJFGD kirk-searchForm-overlay kirk-searchForm-autocomplete-to">
                {activeField === "dest" ? (
                  <SearchInput
                    google={google}
                    map={map}
                    id="dest"
                    label={placeholders.dest}
                    placeListener={placeListener}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="kirk-searchForm-dateSeat-container">
                <div className="kirk-searchForm-date">
                  <button type="button" className="kirk-search-button">
                    <CalendarSVG />
                    <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis kirk-search-ellipsis">
                      {routeInfo.duration}
                    </span>
                  </button>
                </div>
                <div className="sc-fjmCvl knJFGD kirk-searchForm-overlay kirk-searchForm-datepicker"></div>
                <hr className="sc-bHwgHz gdIsON" />
                <div className="kirk-searchForm-seats">
                  <button type="button" className="kirk-search-button">
                    <SeatsSVG />
                    <span className="sc-iwsKbI sc-gZMcBi sc-jTzLTM kvihvE kirk-search-ellipsis kirk-search-ellipsis">
                      {routeInfo.distance}
                    </span>
                  </button>
                </div>
                <div className="sc-fjmCvl knJFGD kirk-searchForm-overlay kirk-searchForm-stepper"></div>
                <div className="kirk-searchForm-submit">
                  <button
                    type="submit"
                    className="kirk-search-button"
                    data-testid="kirk-search-form-submit-buttom"
                  >
                    <FinderSVG />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <div>
          <div>Lat: {position && position.lat()}</div>
          <div>Lng: {position && position.lng()}</div>
        </div> */}
      </div>

      <div className={styles.right}>
        <Map
          google={google}
          // center={position}
          onReady={(mapProps, map) => mapLoaded(mapProps, map)}
          centerAroundCurrentLocation={false}
          containerStyle={{
            // height: '100vh',
            position: "relative",
            width: "100%"
          }}
        >
          {address.from ? (
            <Marker position={address.from.geometry.location} />
          ) : (
            <></>
          )}
          {address.dest ? (
            <Marker position={address.dest.geometry.location} />
          ) : (
            <></>
          )}
        </Map>
      </div>
    </div>
  );
};

// const MapWrapper = props => (
//   <Map className="map" google={props.google} visible={false}>
//     <Contents {...props} />
//   </Map>
// );

// export default MapWrapper;
export default Contents;
