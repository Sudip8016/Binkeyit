import Axios from "./Axios"
import summaryApi from "../common/summaryApi"

const fetchUserDetails = async() => {
    try {
        const res = await Axios({
            ...summaryApi.userDetails
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails