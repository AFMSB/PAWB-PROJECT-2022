import React, {Component} from "react";
import UsersList from "./UsersList";
import UsersLastLocation from "./UsersLastLocation";
import '../css/App.css';
import MapView from "./MapView";

class AdminDashboard extends Component {
    constructor(props) {
        super(props)
    }





    render() {
        return (
            <div className="container mt-3">
                <div className="col-12 card mt-2 d-flex flex-column">
                    <div className="accordion " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="false"
                                        aria-controls="collapseOne">
                                    <strong>Users Information</strong>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse"
                                 aria-labelledby="headingOne"
                                 data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <UsersList/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-12 card d-flex flex-column mt-2 ">
                    <div className="accordion  " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo" aria-expanded="false"
                                        aria-controls="collapseTwo">
                                    <strong>Users Last Locations</strong>
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse"
                                 aria-labelledby="headingTwo"
                                 data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <UsersLastLocation/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-12 col-md-12 card mt-2">
                    <div className="card-body map-parent">
                        <MapView markers={[]} zoom={5}/>
                        <div className="bg-light map-overlay">
                            Users Last Locations
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default AdminDashboard;
