import axios from "axios";
import {Marker} from "react-leaflet";
import {LocationIcon} from "../components/LocationIcon";
import MarkerPopup from "../components/MarkerPopup";
import React from "react";


export const truncStr = (string, limit) => {
    return string.length > limit
        ? string
        .trim()
        .substring(0, limit - 3)
        .trim() + "..."
        : string;
};

const resources = {};

const makeRequestCreator = (auth = true) => {
    let cancel;

    return async query => {
        if (cancel) {
            // Cancel the previous request before making a new request
            cancel.cancel();
        }
        // Create a new CancelToken
        cancel = axios.CancelToken.source();
        try {
            if (resources[query]) {
                // Return result if it exists
                return resources[query];
            }
            //const res = await axios(query, { cancelToken: cancel.token });
            const headers = auth ? {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`} : {}
            const res = await axios
                .get(query + "", {
                    headers: headers
                })
                .catch(error => {
                    console.log(error);
                });

            const result = res.data.users;
            // Store response
            resources[query] = result;

            return result;
        } catch (error) {
            if (axios.isCancel(error)) {
                // Handle if request was cancelled
                console.log("Request canceled", error.message);
            } else {
                // Handle usual errors
                console.log("Something went wrong: ", error.message);
            }
        }
    };
};

export const getCentralGeoCoordinate = (array) => {
    if (array.length > 0) {
        let x = 0;
        let y = 0;
        let z = 0;

        array.forEach(element => {
                const latitude = element.geometry[0] * Math.PI / 180;
                const longitude = element.geometry[1] * Math.PI / 180;

                x += Math.cos(latitude) * Math.cos(longitude);
                y += Math.cos(latitude) * Math.sin(longitude);
                z += Math.sin(latitude);
            }
        )

        const total = array.length;

        x = x / total;
        y = y / total;
        z = z / total;

        const centralLongitude = Math.atan2(y, x);
        const centralSquareRoot = Math.sqrt(x * x + y * y);
        const centralLatitude = Math.atan2(z, centralSquareRoot);

        let centerPoint = {lat: centralLatitude * 180 / Math.PI, lng: centralLongitude * 180 / Math.PI}
        return centerPoint;
    } else return {lat: 39.557191, lng: -7.8536599} // Center of Portugal
}


export const search = makeRequestCreator();
