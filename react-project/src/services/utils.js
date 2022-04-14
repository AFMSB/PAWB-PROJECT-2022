import axios from "axios";

export const truncStr = (string, limit) => {
    return string.length > limit
        ? string
        .trim()
        .substring(0, limit - 3)
        .trim() + "..."
        : string;
};

const resources = {};

const makeRequestCreator = (auth=true) => {
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

export const search = makeRequestCreator();
