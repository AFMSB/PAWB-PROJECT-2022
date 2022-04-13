

const Profile = () => {
    return (
        <div className="container mt-3">
            <div className="d-flex flex-wrap justify-content-between">
                <div className="col-12 col-md-6 card mb-3 mb-sm-0 profile-card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin"
                                 className="rounded-circle" width="150"></img>
                            <div className="mt-3">
                                <h4>John Doe</h4>
                                <p className="text-secondary mb-1">Username</p>
                                <div>
                                    <button className="btn btn-outline-warning m-2">Send Location</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 card profile-card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <h4>Followers</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
