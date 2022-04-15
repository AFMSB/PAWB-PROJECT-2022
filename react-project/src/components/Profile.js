import FollowersList from "./FollowersList";
import React, {Component} from "react";
import SearchUsers from "./SearchUsers";
import MapView from "./MapView";
import SendLocBtn from "./SendLocBtn";
const API_URL = "http://localhost:3000/api/v1/position/";
class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            markers:[]
        }
    }

    async componentDidMount() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"','')}`}

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"start": "0", "end": "0"})
        };
        const response = await fetch(API_URL + "history", requestOptions);
        const data = await response.json();
        let markers = await Promise.all(data.locations.map(async (marker) => {
            return {
                created_at: marker.CreatedAt.split("T")[0],
                geometry: [marker.Latitude, marker.Longitude]
            }
        }));

        console.log("^^^",markers)
        this.setState({ markers })

    }



    render() {

        return (
            <div className="container mt-3">
                <div className="d-flex flex-wrap justify-content-between">
                    <div className="col-12 col-md-3 card mb-2 mb-sm-0">
                        <div className="card-body">
                            <div className="d-flex flex-column align-items-center text-center">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin"
                                     className="rounded-circle" width="150"/>
                                <div className="mt-3">
                                    <h4>{localStorage.getItem("username").replaceAll('"', '')}</h4>
                                    <p className="text-secondary mb-1">UFP</p>
                                    <div>
                                        {<SendLocBtn/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-9 card profile-card">
                        <div className="card-body map-parent">
                            <MapView markers={this.state.markers}/>
                            <div className="bg-light map-overlay">
                                History
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 card mt-2">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            {<SearchUsers/>}
                        </div>

                        <div className="d-flex flex-column align-items-center text-center">
                            <h4 className="mt-3 mt-sm-0">Followers</h4>
                            <FollowersList/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
